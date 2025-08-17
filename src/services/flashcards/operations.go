package flashcards

import (
	"fmt"
	"log"

	"github.com/oc8/pb-learn-with-ai/src/services"
	"github.com/oc8/pb-learn-with-ai/src/types"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

// Operations handles flashcard-related operations
type Operations struct {
	app *pocketbase.PocketBase
}

// NewOperations creates a new flashcard operations handler
func NewOperations(app *pocketbase.PocketBase) *Operations {
	return &Operations{
		app: app,
	}
}

// ProcessFlashcards processes flashcard operations from AI response
func (o *Operations) ProcessFlashcards(deckID string, flashcards []services.Flashcard, existingCards []types.Card) error {
	logger := o.app.Logger()

	for _, flashcard := range flashcards {
		action := flashcard.Action
		question := flashcard.Q
		answer := flashcard.A
		id := flashcard.ID

		switch action {
		case "", "add":
			err := o.addFlashcard(deckID, question, answer, existingCards)
			if err != nil {
				logger.Error("Failed to add flashcard", "error", err)
				return err
			}

		case "update":
			err := o.updateFlashcard(id, question, answer)
			if err != nil {
				logger.Error("Failed to update flashcard", "error", err, "id", id)
				return err
			}

		case "remove":
			err := o.removeFlashcard(id)
			if err != nil {
				logger.Error("Failed to remove flashcard", "error", err, "id", id)
				return err
			}
		}

		logger.Info(fmt.Sprintf("Flashcard %s", action), "flashcard", flashcard)
	}

	return nil
}

// addFlashcard adds a new flashcard to the deck
func (o *Operations) addFlashcard(deckID, question, answer string, existingCards []types.Card) error {
	db := o.app.DB()

	action := "add"
	if len(existingCards) == 0 {
		action = ""
	}

	query := "INSERT INTO cards (question, answer, deck, action) VALUES ({:question}, {:answer}, {:deck}, {:action})"
	params := map[string]interface{}{
		"question": question,
		"answer":   answer,
		"deck":     deckID,
		"action":   action,
	}

	_, err := db.NewQuery(query).Bind(params).Execute()
	return err
}

func (o *Operations) BulkInsertFlashcards(flashcards []types.Card, deckID string, userId string) error {
	if len(flashcards) == 0 {
		o.app.Logger().Warn("No flashcards to insert.")
		return nil
	}

	return o.app.RunInTransaction(func(txApp core.App) error {
		baseSQL := "INSERT INTO cards (question, answer, medias, deck, user) VALUES "
		valuePlaceholders := ""
		params := dbx.Params{}
		paramCounter := 0

		for _, flashcard := range flashcards {
			questionKey := fmt.Sprintf("question%d", paramCounter)
			answerKey := fmt.Sprintf("answer%d", paramCounter)
			mediasKey := fmt.Sprintf("medias%d", paramCounter)

			log.Println("Processing flashcard", "question", flashcard.Question, "answer", flashcard.Answer)

			if valuePlaceholders != "" {
				valuePlaceholders += ","
			}
			valuePlaceholders += fmt.Sprintf("({:%s}, {:%s}, {:%s}, {:deck}, {:user})", questionKey, answerKey, mediasKey)

			params[questionKey] = flashcard.Question
			params[answerKey] = flashcard.Answer
			params[mediasKey] = flashcard.Medias

			paramCounter++
		}

		params["deck"] = deckID
		params["user"] = userId

		fullSQL := baseSQL + valuePlaceholders

		if paramCounter == 0 {
			o.app.Logger().Warn("No valid flashcards found for bulk insert after filtering empty ones.")
			return nil
		}

		_, err := txApp.DB().NewQuery(fullSQL).Bind(params).Execute()
		if err != nil {
			return fmt.Errorf("failed to execute bulk insert: %w", err)
		}

		return nil
	})
}

// updateFlashcard updates an existing flashcard
func (o *Operations) updateFlashcard(id, question, answer string) error {
	if id == "" {
		return fmt.Errorf("flashcard ID is empty for update")
	}

	db := o.app.DB()

	// Check if the card content has changed
	var oldCard types.Card
	err := db.NewQuery("SELECT id, question, answer FROM cards WHERE id = {:id}").
		Bind(map[string]interface{}{"id": id}).
		One(&oldCard)

	if err != nil {
		return fmt.Errorf("failed to fetch card for update: %w", err)
	}

	// Skip if no changes
	if oldCard.Question == question && oldCard.Answer == answer {
		return nil
	}

	// Update the card
	_, err = db.NewQuery("UPDATE cards SET new_question = {:question}, new_answer = {:answer}, action = {:action} WHERE id = {:id}").
		Bind(map[string]interface{}{
			"question": question,
			"answer":   answer,
			"action":   "update",
			"id":       id,
		}).Execute()

	return err
}

// removeFlashcard marks a flashcard for removal (soft delete)
func (o *Operations) removeFlashcard(id string) error {
	if id == "" {
		return fmt.Errorf("flashcard ID is empty for remove")
	}

	db := o.app.DB()

	_, err := db.NewQuery("UPDATE cards SET action = {:action} WHERE id = {:id}").
		Bind(map[string]interface{}{
			"action": "remove",
			"id":     id,
		}).Execute()

	return err
}
