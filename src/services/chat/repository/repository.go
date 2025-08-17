package repository

import (
	"encoding/json"
	"fmt"

	"github.com/oc8/pb-learn-with-ai/src/services"
	"github.com/oc8/pb-learn-with-ai/src/types"
	// "github.com/oc8/pb-learn-with-ai/src/utils"
	"github.com/pocketbase/pocketbase"
)

// Repository handles database operations for chat functionality
type Repository struct {
	app *pocketbase.PocketBase
}

// NewRepository creates a new repository
func NewRepository(app *pocketbase.PocketBase) *Repository {
	return &Repository{
		app: app,
	}
}

// GetDeckAndUser retrieves deck and user information
func (r *Repository) GetDeckAndUser(deckID string) (*types.Deck, *types.User, error) {
	db := r.app.DB()

	// Get the deck
	deck := &types.Deck{}
	err := db.NewQuery("SELECT id, name, public, user, content FROM decks WHERE id = {:deck}").
		Bind(map[string]interface{}{"deck": deckID}).
		One(deck)
	if err != nil {
		return nil, nil, fmt.Errorf("deck not found: %w", err)
	}

	// Get the user language
	user := &types.User{}
	if deck.User != "" {
		err = db.NewQuery("SELECT language, subscription_status FROM users WHERE id = {:user}").
			Bind(map[string]interface{}{"user": deck.User}).
			One(user)
		if err != nil {
			return deck, nil, fmt.Errorf("user not found: %w", err)
		}
	}

	return deck, user, nil
}

// GetCards retrieves cards for a deck
func (r *Repository) GetCards(deckID string) ([]types.Card, error) {
	db := r.app.DB()
	var cards []types.Card

	err := db.NewQuery("SELECT id, question, answer, action FROM cards WHERE deck = {:deck}").
		Bind(map[string]interface{}{"deck": deckID}).
		All(&cards)

	return cards, err
}

// UpdateDeckName updates the deck name
func (r *Repository) UpdateDeckName(deckID, name string) error {
	db := r.app.DB()
	// slug, err := utils.GenerateUniqueSlug(r.app, name)
	// if err != nil {
	// 	return fmt.Errorf("failed to generate slug: %w", err)
	// }

	_, err := db.NewQuery("UPDATE decks SET name = {:name} WHERE id = {:id}").
		Bind(map[string]interface{}{
			"name": name,
			// "slug": slug,
			"id": deckID,
		}).Execute()
	return err
}

// UpdateDeckIcon updates the deck icon
func (r *Repository) UpdateDeckIcon(deckID, icon string) error {
	db := r.app.DB()
	_, err := db.NewQuery("UPDATE decks SET icon = {:icon} WHERE id = {:id}").
		Bind(map[string]interface{}{
			"icon": icon,
			"id":   deckID,
		}).Execute()
	return err
}

// UpdateDeckContent updates the deck content
func (r *Repository) UpdateDeckContent(deckID, content string) error {
	db := r.app.DB()
	_, err := db.NewQuery("UPDATE decks SET content = {:content} WHERE id = {:id}").
		Bind(map[string]interface{}{
			"content": content,
			"id":      deckID,
		}).Execute()
	return err
}

// SaveMessages saves messages to the deck
func (r *Repository) SaveMessages(deckID string, messages []services.MessageType) error {
	db := r.app.DB()
	logger := r.app.Logger()

	// Process messages (remove unnecessary sources)
	var processedMessages []services.MessageType
	for _, message := range messages {
		for i, source := range message.Sources {
			if source.Base64 != "" {
				source.Base64 = ""
			}
			message.Sources[i] = source
		}

		processedMessages = append(processedMessages, message)
	}

	logger.Warn("Saving messages", "messages", processedMessages)

	messagesJSON, err := json.Marshal(processedMessages)
	if err != nil {
		return fmt.Errorf("failed to marshal messages: %w", err)
	}

	_, err = db.NewQuery("UPDATE decks SET messages = {:messages} WHERE id = {:id}").
		Bind(map[string]interface{}{
			"messages": string(messagesJSON),
			"id":       deckID,
		}).Execute()

	if err != nil {
		return fmt.Errorf("failed to update deck messages: %w", err)
	}

	return nil
}
