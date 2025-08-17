package chat

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/oc8/pb-learn-with-ai/src/services"
	"github.com/oc8/pb-learn-with-ai/src/services/chat/prompts"
	"github.com/oc8/pb-learn-with-ai/src/services/chat/repository"
	"github.com/oc8/pb-learn-with-ai/src/services/flashcards"
	"github.com/oc8/pb-learn-with-ai/src/types"
	"github.com/pocketbase/pocketbase"
)

// Service handles chat-related business logic
type Service struct {
	app           *pocketbase.PocketBase
	repo          *repository.Repository
	promptBuilder *prompts.Builder
	flashcardOps  *flashcards.Operations
}

// NewService creates a new chat service
func NewService(app *pocketbase.PocketBase) *Service {
	return &Service{
		app:           app,
		repo:          repository.NewRepository(app),
		promptBuilder: prompts.NewBuilder(),
		flashcardOps:  flashcards.NewOperations(app),
	}
}

// ProcessChatRequest processes a chat request
func (s *Service) ProcessChatRequest(req types.ChatRequest) (*services.Result, error) {
	logger := s.app.Logger()

	// Get deck and user information
	deck, user, err := s.repo.GetDeckAndUser(req.DeckID)
	if err != nil {
		return nil, fmt.Errorf("failed to get deck and user: %w", err)
	}

	// Check authorization
	if !s.isAuthorized(deck, user) {
		return nil, fmt.Errorf("unauthorized access to deck")
	}

	// Get cards for the deck
	cards, err := s.repo.GetCards(req.DeckID)
	if err != nil {
		logger.Error("Failed to get cards", "error", err)
	}

	// Process messages
	processedMessages := make([]services.MessageType, len(req.Messages))
	copy(processedMessages, req.Messages)

	// Build system prompt and response schema
	systemPrompt, responseSchema := s.promptBuilder.BuildPromptAndSchema(req.Modes, cards, user, req.Lang)

	// Prepare messages for LLM
	llmMessages := s.prepareLLMMessages(processedMessages, cards, deck)

	logger.Warn("system prompt", "system_prompt", systemPrompt)
	logger.Warn("last message", "content", llmMessages[len(llmMessages)-1].Content)
	logger.Warn("last sources", "sources", len(llmMessages[len(llmMessages)-1].Sources))

	// Call Gemini API
	ctx, cancel := context.WithTimeout(context.Background(), 180*time.Second)
	defer cancel()

	response, err := services.SendMessageWithResponse(ctx, llmMessages, systemPrompt, responseSchema, user.SubscriptionStatus, true, logger)
	if err != nil {
		logger.Error("Failed to call Gemini API", "error", err)
		return nil, fmt.Errorf("failed to call Gemini API: %w", err)
	}

	// Add assistant message to processed messages
	processedMessages = append(processedMessages, services.MessageType{
		Role:    "assistant",
		Content: response.Message,
	})

	// Handle deck updates if response contains deck data
	if response.Deck != nil {
		err = s.handleDeckUpdates(req.DeckID, deck, response.Deck, cards)
		if err != nil {
			logger.Error("Failed to handle deck updates", "error", err)
		}
	}

	// Save messages
	err = s.repo.SaveMessages(req.DeckID, processedMessages)
	if err != nil {
		logger.Error("Failed to save messages", "error", err)
	}

	return &response, nil
}

// isAuthorized checks if access to the deck is authorized
func (s *Service) isAuthorized(deck *types.Deck, user *types.User) bool {
	// For debugging - currently always authorize
	s.app.Logger().Info("Deck access check", "deck_public", deck.Public, "deck_user", deck.User)
	return true
}

// prepareLLMMessages prepares messages for the LLM
func (s *Service) prepareLLMMessages(messages []services.MessageType, cards []types.Card, deck *types.Deck) []services.MessageType {
	llmMessages := make([]services.MessageType, len(messages))
	copy(llmMessages, messages)

	// Add task wrapper to last message
	llmMessages[len(llmMessages)-1].Content = `
		<Task>
		` + llmMessages[len(llmMessages)-1].Content + `
		</Task>`

	// Add flashcards or note content
	if len(cards) > 0 {
		cardsJSON, err := json.Marshal(cards)
		if err != nil {
			s.app.Logger().Error("Failed to marshal cards to JSON", "error", err)
		} else {
			llmMessages[len(llmMessages)-1].Content += `
			<Flashcards>
` + string(cardsJSON) + `
			</Flashcards>`
		}
	} else if deck.Content != "" {
		llmMessages[len(llmMessages)-1].Content += `
			<Note>
			` + deck.Content + `
			</Note>`
	}

	return llmMessages
}

// handleDeckUpdates handles updates to the deck based on AI response
func (s *Service) handleDeckUpdates(deckID string, deck *types.Deck, responseDeck *services.Deck, cards []types.Card) error {
	// Update deck name
	if responseDeck.Name != "" {
		err := s.repo.UpdateDeckName(deckID, responseDeck.Name)
		if err != nil {
			return fmt.Errorf("failed to update deck name: %w", err)
		}

		// Set default icon if not set
		if deck.Icon == "" {
			err = s.repo.UpdateDeckIcon(deckID, "lucide:text")
			if err != nil {
				return fmt.Errorf("failed to update deck icon: %w", err)
			}
		}
	}

	// Update summary/content
	if responseDeck.Summary != "" {
		err := s.repo.UpdateDeckContent(deckID, responseDeck.Summary)
		if err != nil {
			return fmt.Errorf("failed to update deck content: %w", err)
		}
		s.RemoveLoadingState(deckID, "note")
	}

	// Handle flashcard operations
	if responseDeck.Flashcards != nil && len(responseDeck.Flashcards) > 0 {
		err := s.flashcardOps.ProcessFlashcards(deckID, responseDeck.Flashcards, cards)
		if err != nil {
			return fmt.Errorf("failed to process flashcards: %w", err)
		}
		s.RemoveLoadingState(deckID, "flashcards")
	}

	return nil
}

// contains checks if a slice contains a string
func contains(slice []string, s string) bool {
	for _, item := range slice {
		if item == s {
			return true
		}
	}
	return false
}

func (s *Service) AddLoadingState(deckID string, name string) error {
	db := s.app.DB()

	var deck struct {
		Loading string `db:"loading"`
	}
	err := db.NewQuery("SELECT loading FROM decks WHERE id = {:deckID}").
		Bind(map[string]interface{}{"deckID": deckID}).
		One(&deck)
	if err != nil {
		return fmt.Errorf("deck not found: %w", err)
	}

	var loadingSlice []string
	if deck.Loading == "" {
		loadingSlice = []string{}
	} else {
		if err := json.Unmarshal([]byte(deck.Loading), &loadingSlice); err != nil {
			return fmt.Errorf("failed to decode loading state: %w", err)
		}
	}

	// Check if name already exists
	for _, existing := range loadingSlice {
		if existing == name {
			return nil
		}
	}

	loadingSlice = append(loadingSlice, name)

	// Convert back to JSON string
	loadingJSON, err := json.Marshal(loadingSlice)
	if err != nil {
		return fmt.Errorf("failed to encode loading state: %w", err)
	}

	_, err = db.NewQuery("UPDATE decks SET loading = {:loading} WHERE id = {:deckID}").
		Bind(map[string]interface{}{
			"loading": string(loadingJSON),
			"deckID":  deckID,
		}).Execute()
	if err != nil {
		return fmt.Errorf("failed to set loading state: %w", err)
	}

	return nil
}

func (s *Service) RemoveLoadingState(deckID string, name string) error {
	db := s.app.DB()

	var deck struct {
		Loading string `db:"loading"`
	}
	err := db.NewQuery("SELECT loading FROM decks WHERE id = {:deckID}").
		Bind(map[string]interface{}{"deckID": deckID}).
		One(&deck)
	if err != nil {
		return fmt.Errorf("deck not found: %w", err)
	}
	var loadingSlice []string
	if deck.Loading == "" || deck.Loading == "[]" {
		return nil
	}

	if err := json.Unmarshal([]byte(deck.Loading), &loadingSlice); err != nil {
		return fmt.Errorf("failed to decode loading state: %w", err)
	}

	// Remove the name if it exists
	for i, existing := range loadingSlice {
		if existing == name {
			loadingSlice = append(loadingSlice[:i], loadingSlice[i+1:]...)
			break
		}
	}

	// Convert back to JSON string
	loadingJSON, err := json.Marshal(loadingSlice)
	if err != nil {
		return fmt.Errorf("failed to encode loading state: %w", err)
	}

	_, err = db.NewQuery("UPDATE decks SET loading = {:loading} WHERE id = {:deckID}").
		Bind(map[string]interface{}{
			"loading": string(loadingJSON),
			"deckID":  deckID,
		}).Execute()
	if err != nil {
		return fmt.Errorf("failed to set loading state: %w", err)
	}

	return nil
}
