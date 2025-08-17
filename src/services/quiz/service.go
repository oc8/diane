package quiz

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/oc8/pb-learn-with-ai/src/services"
	"github.com/oc8/pb-learn-with-ai/src/types"
	"github.com/pocketbase/pocketbase"
	"google.golang.org/genai"
)

// Service handles quiz generation business logic
type Service struct {
	app *pocketbase.PocketBase
}

// NewService creates a new quiz service
func NewService(app *pocketbase.PocketBase) *Service {
	return &Service{
		app: app,
	}
}

// GenerateQuiz generates quiz choices for cards in a deck
func (s *Service) GenerateQuiz(deckID string) error {
	db := s.app.DB()
	logger := s.app.Logger()

	// Get deck information
	deck := &types.Deck{}
	err := db.NewQuery("SELECT id, name, public FROM decks WHERE id = {:id}").
		Bind(map[string]interface{}{"id": deckID}).
		One(deck)
	if err != nil {
		return fmt.Errorf("deck not found: %w", err)
	}

	// Get cards without choices
	var cards []types.Card
	err = db.NewQuery("SELECT id, question, answer, COALESCE(choices, '') as choices FROM cards WHERE deck = {:deck}").
		Bind(map[string]interface{}{"deck": deckID}).
		All(&cards)
	if err != nil {
		return fmt.Errorf("failed to get cards: %w", err)
	}

	// Filter cards that don't have choices
	var cardsWithoutChoices []types.Card
	for _, card := range cards {
		if card.Choices == "" {
			cardsWithoutChoices = append(cardsWithoutChoices, card)
		}
	}

	if len(cardsWithoutChoices) == 0 {
		return fmt.Errorf("no cards need quiz choices")
	}

	// Build system prompt and response schema
	systemPrompt := `Fill the choices field for each card with 3 false answers and the correct answer in random order.
The false answers must seem true.`

	// Create message content
	cardsJSON, err := json.Marshal(cardsWithoutChoices)
	if err != nil {
		return fmt.Errorf("failed to marshal cards: %w", err)
	}

	messageContent := fmt.Sprintf(`deck name: %s
cards:
%s`, deck.Name, string(cardsJSON))

	messages := []services.MessageType{
		{
			Role:    "user",
			Content: messageContent,
		},
	}

	// Build response schema
	responseSchema := genai.Schema{
		Type: "object",
		Properties: map[string]*genai.Schema{
			"cards": &genai.Schema{
				Type: "array",
				Items: &genai.Schema{
					Type: "object",
					Properties: map[string]*genai.Schema{
						"id": &genai.Schema{
							Type: "string",
						},
						"question": &genai.Schema{
							Type: "string",
						},
						"answer": &genai.Schema{
							Type: "string",
						},
						"choices": &genai.Schema{
							Type: "array",
							Items: &genai.Schema{
								Type: "string",
							},
						},
					},
					Required: []string{"id", "question", "answer", "choices"},
				},
			},
		},
		Required: []string{"cards"},
	}

	logger.Warn("Quiz generation", "system_prompt", systemPrompt)
	logger.Warn("Quiz generation", "messages", messages)

	// Call Gemini API directly to get raw JSON response
	ctx, cancel := context.WithTimeout(context.Background(), 120*time.Second)
	defer cancel()

	apiKey := os.Getenv("GEMINI_SECRET_KEY")
	if apiKey == "" {
		return fmt.Errorf("Gemini API key is not configured")
	}

	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  apiKey,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		return fmt.Errorf("failed to create Gemini client: %w", err)
	}

	config := &genai.GenerateContentConfig{
		ResponseMIMEType:  "application/json",
		ResponseSchema:    &responseSchema,
		SystemInstruction: genai.NewContentFromText(systemPrompt, genai.RoleUser),
	}

	chat, err := client.Chats.Create(ctx, "gemini-2.5-flash-preview-05-20", config, nil)
	if err != nil {
		return fmt.Errorf("failed to create chat: %w", err)
	}

	messageParts := []genai.Part{{Text: messages[0].Content}}
	res, err := chat.SendMessage(ctx, messageParts...)
	if err != nil {
		return fmt.Errorf("failed to send message to Gemini: %w", err)
	}

	logger.Debug("Full Gemini response", "response", res)

	if len(res.Candidates) == 0 {
		return fmt.Errorf("no response candidates from Gemini")
	}

	jsonData := res.Candidates[0].Content.Parts[0].Text
	logger.Warn("Raw JSON from Gemini", "json", jsonData)

	// Parse the response
	var quizResponse types.QuizResponse
	err = json.Unmarshal([]byte(jsonData), &quizResponse)
	if err != nil {
		logger.Error("Failed to parse quiz response", "error", err, "raw_json", jsonData)
		return fmt.Errorf("failed to parse quiz response: %w", err)
	}

	// Update cards with choices
	for _, card := range quizResponse.Cards {
		logger.Warn("Updating card with choices", "card", card)
		
		choicesJSON, err := json.Marshal(card.Choices)
		if err != nil {
			logger.Error("Failed to marshal choices", "error", err, "card_id", card.ID)
			continue
		}

		_, err = db.NewQuery("UPDATE cards SET choices = {:choices} WHERE id = {:id}").
			Bind(map[string]interface{}{
				"choices": string(choicesJSON),
				"id":      card.ID,
			}).Execute()

		if err != nil {
			logger.Error("Failed to update card choices", "error", err, "card_id", card.ID)
		}
	}

	return nil
}