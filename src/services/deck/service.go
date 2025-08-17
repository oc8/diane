package deck

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/oc8/pb-learn-with-ai/src/internal/anki"
	"github.com/oc8/pb-learn-with-ai/src/services/flashcards"
	"github.com/oc8/pb-learn-with-ai/src/types"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

// Service handles deck-related business logic
type Service struct {
	app *pocketbase.PocketBase
}

// NewService creates a new deck service
func NewService(app *pocketbase.PocketBase) *Service {
	return &Service{
		app: app,
	}
}

// GetCommunityDecks returns certified community decks
func (s *Service) GetCommunityDecks(lang string) ([]types.CommunityDeck, error) {
	db := s.app.DB()

	// Get certified users
	var certifiedUsers []types.CertifiedUser
	err := db.NewQuery("SELECT id, name FROM users WHERE certified = true").All(&certifiedUsers)
	if err != nil {
		return nil, fmt.Errorf("failed to get certified users: %w", err)
	}

	// Create a map for quick lookup
	userMap := make(map[string]*types.CertifiedUser)
	for i := range certifiedUsers {
		userMap[certifiedUsers[i].ID] = &certifiedUsers[i]
	}

	// Get public decks
	var decks []struct {
		ID          string `db:"id"`
		Slug        string `db:"slug"`
		Name        string `db:"name"`
		User        string `db:"user"`
		Color       string `db:"color"`
		Icon        string `db:"icon"`
		Tag         string `db:"tag"`
		Languages   string `db:"languages"`
		Description string `db:"description"`
		Links       string `db:"links"`
		Updated     string `db:"updated"`
	}

	err = db.NewQuery("SELECT id, slug, name, user, COALESCE(color, '') as color, COALESCE(icon, '') as icon, COALESCE(tag, '') as tag, COALESCE(languages, '') as languages, COALESCE(description, '') as description, COALESCE(links, '') as links, COALESCE(updated, '') as updated FROM decks WHERE public = true").All(&decks)
	if err != nil {
		return nil, fmt.Errorf("failed to get public decks: %w", err)
	}

	var result []types.CommunityDeck
	for _, deck := range decks {
		// Check if deck belongs to certified user
		certifiedUser, exists := userMap[deck.User]
		if !exists {
			continue
		}

		// Parse languages - handle both array and object formats
		var languages []string
		if deck.Languages != "" {
			err := json.Unmarshal([]byte(deck.Languages), &languages)
			if err != nil {
				// If that fails, it might be an object or other format, just use empty array
				s.app.Logger().Debug("Languages not in array format, using empty array", "languages", deck.Languages, "error", err)
				languages = []string{}
			}
		}

		// Filter by language if specified
		if lang != "" && len(languages) > 0 {
			found := false
			for _, deckLang := range languages {
				if deckLang == lang {
					found = true
					break
				}
			}
			if !found {
				continue
			}
		}

		// Parse links
		var links []types.Link
		if deck.Links != "" {
			err := json.Unmarshal([]byte(deck.Links), &links)
			if err != nil {
				s.app.Logger().Debug("Links not in array format, using empty array", "links", deck.Links, "error", err)
				links = []types.Link{}
			}
		}

		// Get deck size by counting cards
		var deckSize struct {
			Count int `db:"count"`
		}
		db.NewQuery("SELECT COUNT(*) as count FROM cards WHERE deck = {:deck}").
			Bind(map[string]interface{}{"deck": deck.ID}).
			One(&deckSize)

		communityDeck := types.CommunityDeck{
			ID:          deck.ID,
			Slug:        deck.Slug,
			Name:        deck.Name,
			User:        certifiedUser,
			Color:       deck.Color,
			Icon:        deck.Icon,
			Tag:         deck.Tag,
			Languages:   languages,
			Size:        deckSize.Count,
			Description: deck.Description,
			Links:       links,
			Updated:     deck.Updated,
		}

		result = append(result, communityDeck)
	}

	return result, nil
}

// ShareDeck makes a deck public and returns a share link
func (s *Service) ShareDeck(deckID string) (string, error) {
	db := s.app.DB()

	// Get deck info
	var deck struct {
		ID   string `db:"id"`
		Slug string `db:"slug"`
		User string `db:"user"`
	}

	err := db.NewQuery("SELECT id, slug, user FROM decks WHERE id = {:id}").
		Bind(map[string]interface{}{"id": deckID}).
		One(&deck)
	if err != nil {
		return "", fmt.Errorf("deck not found")
	}

	// Get user language
	var user struct {
		Language string `db:"language"`
	}

	err = db.NewQuery("SELECT COALESCE(language, 'en') as language FROM users WHERE id = {:id}").
		Bind(map[string]interface{}{"id": deck.User}).
		One(&user)
	if err != nil {
		// Default to English if user not found
		user.Language = "en"
	}

	// Make deck public
	_, err = db.NewQuery("UPDATE decks SET public = true WHERE id = {:id}").
		Bind(map[string]interface{}{"id": deck.ID}).
		Execute()
	if err != nil {
		return "", fmt.Errorf("failed to make deck public: %w", err)
	}

	// Build share link
	frontURL := os.Getenv("FRONT_URL")
	if frontURL == "" {
		frontURL = "http://localhost:3000" // fallback
	}

	shareLink := fmt.Sprintf("%s/%s/dashboard/%s", frontURL, user.Language, deck.ID)
	return shareLink, nil
}

// DuplicateDeck duplicates a deck for a user
func (s *Service) DuplicateDeck(sourceDeckID, userID string) (string, error) {
	db := s.app.DB()
	logger := s.app.Logger()

	// Get source deck
	var sourceDeck struct {
		ID          string `db:"id"`
		Name        string `db:"name"`
		Description string `db:"description"`
		Public      bool   `db:"public"`
		User        string `db:"user"`
		Icon        string `db:"icon"`
		Type        string `db:"type"`
		Color       string `db:"color"`
	}

	err := db.NewQuery("SELECT id, name, COALESCE(description, '') as description, public, user, COALESCE(icon, '') as icon, COALESCE(type, '') as type, COALESCE(color, '') as color FROM decks WHERE id = {:id}").
		Bind(map[string]interface{}{"id": sourceDeckID}).
		One(&sourceDeck)
	if err != nil {
		return "", fmt.Errorf("Source deck not found")
	}

	// Check permissions
	if sourceDeck.User != userID && !sourceDeck.Public {
		return "", fmt.Errorf("This deck is private and cannot be duplicated")
	}

	// Get user's main node
	var user struct {
		MainNode string `db:"main_node"`
	}

	err = db.NewQuery("SELECT COALESCE(main_node, '') as main_node FROM users WHERE id = {:id}").
		Bind(map[string]interface{}{"id": userID}).
		One(&user)
	if err != nil {
		return "", fmt.Errorf("User not found")
	}

	// Generate unique marker
	timestamp := time.Now().UnixMilli()
	uniqueMarker := fmt.Sprintf("%s_%d", sourceDeck.Name, timestamp)

	// Create new deck
	_, err = db.NewQuery("INSERT INTO decks (name, description, public, user, icon, type, color) VALUES ({:name}, {:description}, {:public}, {:user}, {:icon}, {:type}, {:color})").
		Bind(map[string]interface{}{
			"name":        sourceDeck.Name,
			"description": uniqueMarker, // Temporary unique marker
			"public":      false,
			"user":        userID,
			"icon":        sourceDeck.Icon,
			"type":        sourceDeck.Type,
			"color":       sourceDeck.Color,
		}).Execute()
	if err != nil {
		return "", fmt.Errorf("failed to create new deck: %w", err)
	}

	// Get new deck ID using unique marker
	var newDeck struct {
		ID string `db:"id"`
	}

	err = db.NewQuery("SELECT id FROM decks WHERE user = {:user} AND description = {:marker}").
		Bind(map[string]interface{}{
			"user":   userID,
			"marker": uniqueMarker,
		}).One(&newDeck)
	if err != nil {
		return "", fmt.Errorf("failed to get new deck ID: %w", err)
	}

	// Restore original description
	_, err = db.NewQuery("UPDATE decks SET description = {:description} WHERE id = {:id}").
		Bind(map[string]interface{}{
			"description": sourceDeck.Description,
			"id":          newDeck.ID,
		}).Execute()
	if err != nil {
		logger.Error("Failed to restore deck description", "error", err)
	}

	// Copy flashcards
	_, err = db.NewQuery(`
		INSERT INTO cards (question, answer, deck, user, type, choices)
		SELECT question, answer, {:newDeckId}, {:userId}, COALESCE(type, ''), COALESCE(choices, '')
		FROM cards
		WHERE deck = {:sourceDeckId}
	`).Bind(map[string]interface{}{
		"newDeckId":    newDeck.ID,
		"userId":       userID,
		"sourceDeckId": sourceDeckID,
	}).Execute()
	if err != nil {
		return "", fmt.Errorf("failed to copy flashcards: %w", err)
	}

	logger.Warn("Deck duplicated successfully", "new_deck_id", newDeck.ID)
	return newDeck.ID, nil
}

// CheckEmailExists checks if an email exists in the users table
func (s *Service) CheckEmailExists(email string) (bool, error) {
	db := s.app.DB()

	var result []struct {
		Email string `db:"email"`
	}

	err := db.NewQuery("SELECT email FROM users WHERE email = {:email}").
		Bind(map[string]interface{}{"email": email}).
		All(&result)
	if err != nil {
		return false, fmt.Errorf("failed to check email: %w", err)
	}

	return len(result) > 0, nil
}

func uploadAnkiMedias(mediaFiles []anki.AnkiMedia, deck *core.Record) error {
	files := make([]*filesystem.File, len(mediaFiles))
	for i, mediaRef := range mediaFiles {
		file, err := filesystem.NewFileFromPath(mediaRef.Path)
		if err != nil {
			log.Printf("Failed to create file from path: %s, error: %v", mediaRef.Filename, err)
			continue
		}

		file.Name = mediaRef.Filename

		log.Printf("Uploading media file: %s", file.Name)
		files[i] = file
	}

	if len(files) == 0 {
		log.Println("No media files to upload.")
		return nil
	}

	deck.Set("attachments", files)

	return nil
}

func (s *Service) ImportAnki(
	deck *core.Record,
	user *core.Record,
	file multipart.File,
	fileHeader *multipart.FileHeader,
	flashcardOps *flashcards.Operations,
) (int, error) {
	logger := s.app.Logger()
	deckID := deck.Id

	tempDir, err := os.MkdirTemp("", "anki-parser-*")
	if err != nil {
		logger.Error("Failed to create temporary directory", "error", err)
		return 0, fmt.Errorf("failed to create temporary directory: %w", err)
	}
	defer os.RemoveAll(tempDir)

	apkgPath := filepath.Join(tempDir, fileHeader.Filename)
	outFile, err := os.Create(apkgPath)
	if err != nil {
		logger.Error("Failed to create temporary file for deck", "error", err)
		return 0, fmt.Errorf("failed to create temp file for deck: %w", err)
	}
	defer outFile.Close()

	if _, err := io.Copy(outFile, file); err != nil {
		logger.Error("Failed to save uploaded file", "error", err)
		return 0, fmt.Errorf("failed to save uploaded file: %w", err)
	}

	logger.Info("Starting to process Anki deck: " + fileHeader.Filename)

	extractDir := filepath.Join(tempDir, "extracted")

	flashcardChan, errChan := anki.ExtractFlashcardsStream(apkgPath, extractDir)
	// TODO: Chunk this to max 5000
	var flashcardsToInsert []types.Card
	var mediasToUpload []anki.AnkiMedia
	for flashCard := range flashcardChan {
		if flashCard.Question == "" && flashCard.Answer == "" {
			logger.Warn("Skipping empty flashcard", "deck", fileHeader.Filename)
			continue
		}

		var mediasString string
		for _, media := range flashCard.Medias {
			mediasString += media.Filename + ","
		}
		mediasString = strings.TrimSuffix(mediasString, ",")

		flashcardsToInsert = append(flashcardsToInsert, types.Card{
			Question: flashCard.Question,
			Answer:   flashCard.Answer,
			Medias:   mediasString,
		})
		if len(flashCard.Medias) > 0 {
			log.Println("Adding medias to upload", "medias", flashCard.Medias)
			mediasToUpload = append(mediasToUpload, flashCard.Medias...)
		}
	}

	if err := <-errChan; err != nil {
		logger.Error("Anki deck parsing failed", "error", err)
		return 0, fmt.Errorf("failed to parse Anki deck: %w", err)
	}

	flashCardsCount := len(flashcardsToInsert)
	if flashCardsCount > 0 {
		err := flashcardOps.BulkInsertFlashcards(flashcardsToInsert, deckID, user.Id)
		if err != nil {
			logger.Error("Failed to bulk save cards", "error", err)
			return 0, fmt.Errorf("failed to bulk save cards: %w", err)
		}

		if len(mediasToUpload) > 0 {
			if err := uploadAnkiMedias(mediasToUpload, deck); err != nil {
				logger.Error("Failed to upload Anki media files", "error", err)
				return 0, fmt.Errorf("failed to upload Anki media files: %w", err)
			}
		}
	} else {
		logger.Warn("No flashcards found in the Anki deck", "deck", fileHeader.Filename)
		return 0, fmt.Errorf("no flashcards found in the Anki deck: %w", err)
	}

	deck.Set("name", fileHeader.Filename)
	if err := s.app.Save(deck); err != nil {
		logger.Error("Failed to update deck name", "error", err, "deck_id", deckID)
		return 0, fmt.Errorf("failed to update deck name: %w", err)
	}

	logger.Info("Finished processing Anki deck", "deck", fileHeader.Filename, "count", flashCardsCount)

	return flashCardsCount, nil
}
