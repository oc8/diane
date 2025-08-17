package handlers

import (
	"net/http"

	"github.com/oc8/pb-learn-with-ai/src/services/quiz"
	"github.com/oc8/pb-learn-with-ai/src/types"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

// QuizHandler handles quiz-related requests
type QuizHandler struct {
	app         *pocketbase.PocketBase
	quizService *quiz.Service
}

// NewQuizHandler creates a new quiz handler
func NewQuizHandler(app *pocketbase.PocketBase) *QuizHandler {
	return &QuizHandler{
		app:         app,
		quizService: quiz.NewService(app),
	}
}

// HandleGenerateQuiz generates quiz choices for cards in a deck
func (h *QuizHandler) HandleGenerateQuiz(e *core.RequestEvent) error {
	deckID := e.Request.PathValue("id")
	if deckID == "" {
		return apis.NewApiError(http.StatusBadRequest, "Missing deck ID", nil)
	}

	logger := h.app.Logger()
	db := h.app.DB()

	// Get deck and check authorization
	deck := &types.Deck{}
	err := db.NewQuery("SELECT id, name, public, user FROM decks WHERE id = {:id}").
		Bind(map[string]interface{}{"id": deckID}).
		One(deck)
	if err != nil {
		return apis.NewApiError(http.StatusNotFound, "Deck not found", err)
	}

	// Check authorization - deck must be public or user must be the owner
	authRecord := e.Auth
	if !deck.Public && (authRecord == nil || deck.User != authRecord.Id) {
		return apis.NewApiError(http.StatusUnauthorized, "Unauthorized", nil)
	}

	// Generate quiz
	err = h.quizService.GenerateQuiz(deckID)
	if err != nil {
		logger.Error("Failed to generate quiz", "error", err, "deck_id", deckID)
		return apis.NewApiError(http.StatusInternalServerError, "Failed to generate quiz", err)
	}

	return e.JSON(http.StatusOK, map[string]string{
		"message": "OK",
	})
}