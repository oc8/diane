package handlers

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/oc8/pb-learn-with-ai/src/services/deck"
	"github.com/oc8/pb-learn-with-ai/src/services/flashcards"
	"github.com/oc8/pb-learn-with-ai/src/types"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

// DeckHandler handles deck-related requests
type DeckHandler struct {
	app          *pocketbase.PocketBase
	deckService  *deck.Service
	flashcardOps *flashcards.Operations
}

// NewDeckHandler creates a new deck handler
func NewDeckHandler(app *pocketbase.PocketBase) *DeckHandler {
	return &DeckHandler{
		app:          app,
		deckService:  deck.NewService(app),
		flashcardOps: flashcards.NewOperations(app),
	}
}

// HandleCommunityDecks handles GET /v1/decks/community/certified
func (h *DeckHandler) HandleCommunityDecks(e *core.RequestEvent) error {
	lang := e.Request.URL.Query().Get("lang")

	decks, err := h.deckService.GetCommunityDecks(lang)
	if err != nil {
		h.app.Logger().Error("Failed to get community decks", "error", err)
		return apis.NewApiError(http.StatusInternalServerError, "Failed to get community decks", err)
	}

	return e.JSON(http.StatusOK, decks)
}

// HandleShareDeck handles GET /v1/deck/{id}/share
func (h *DeckHandler) HandleShareDeck(e *core.RequestEvent) error {
	deckID := e.Request.PathValue("id")
	if deckID == "" {
		return apis.NewApiError(http.StatusBadRequest, "Missing deck ID", nil)
	}

	shareLink, err := h.deckService.ShareDeck(deckID)
	if err != nil {
		if err.Error() == "deck not found" {
			return apis.NewApiError(http.StatusNotFound, "Deck not found", err)
		}
		h.app.Logger().Error("Failed to share deck", "error", err, "deck_id", deckID)
		return apis.NewApiError(http.StatusInternalServerError, "Failed to share deck", err)
	}

	return e.JSON(http.StatusOK, types.ShareResponse{
		Link: shareLink,
	})
}

// HandleDuplicateDeck handles POST /v1/decks/{id}/duplicate
func (h *DeckHandler) HandleDuplicateDeck(e *core.RequestEvent) error {
	deckID := e.Request.PathValue("id")
	if deckID == "" {
		return apis.NewApiError(http.StatusBadRequest, "Missing deck ID", nil)
	}

	authRecord := e.Auth
	if authRecord == nil {
		return apis.NewApiError(http.StatusUnauthorized, "Authentication required", nil)
	}

	newDeckID, err := h.deckService.DuplicateDeck(deckID, authRecord.Id)
	if err != nil {
		h.app.Logger().Error("Failed to duplicate deck", "error", err, "deck_id", deckID, "user_id", authRecord.Id)
		return apis.NewApiError(http.StatusBadRequest, err.Error(), err)
	}

	return e.JSON(http.StatusOK, types.DuplicateResponse{
		ID: newDeckID,
	})
}

// HandleCheckEmail handles GET /v1/check-email/{email}
func (h *DeckHandler) HandleCheckEmail(e *core.RequestEvent) error {
	email := e.Request.PathValue("email")
	if email == "" {
		return apis.NewApiError(http.StatusBadRequest, "Missing email", nil)
	}

	// Clean and normalize email
	email = strings.ToLower(strings.TrimSpace(email))

	exists, err := h.deckService.CheckEmailExists(email)
	if err != nil {
		h.app.Logger().Error("Failed to check email", "error", err, "email", email)
		return apis.NewApiError(http.StatusInternalServerError, "Failed to check email", err)
	}

	if exists {
		return e.JSON(http.StatusOK, map[string]interface{}{})
	}

	return e.JSON(http.StatusNotFound, map[string]interface{}{})
}

func (h *DeckHandler) HandleImportAnki(e *core.RequestEvent) error {
	logger := h.app.Logger()

	if e.Auth == nil || e.Auth.Id == "" {
		return apis.NewApiError(http.StatusUnauthorized, "Authentication required", nil)
	}

	// TODO: clean up this
	user, err := h.app.FindRecordById("users", e.Auth.Id)
	if err != nil {
		logger.Error("Failed to find user by id", "error", err)
		return apis.NewApiError(http.StatusInternalServerError, "Failed to find user", err)
	}
	if user == nil {
		logger.Error("User not found", "id", e.Auth.Id)
		return apis.NewApiError(http.StatusNotFound, "User not found", nil)
	}
	if user.GetString("subscription_status") != "active" {
		logger.Error("User subscription is not active", "user_id", user.Id)
		return apis.NewApiError(http.StatusPaymentRequired, "Subscription required to import anki files", nil)
	}

	const maxUploadSize = 200 << 20 // 200 MB
	if err := e.Request.ParseMultipartForm(maxUploadSize); err != nil {
		logger.Error("Failed to parse multipart form", "error", err)
		return apis.NewBadRequestError("Failed to parse multipart form", err)
	}

	deckID := e.Request.FormValue("deck_id")
	if deckID == "" {
		logger.Error("Missing required parameter: deck_id")
		return apis.NewApiError(http.StatusBadRequest, "Missing required parameter: deckId", nil)
	}

	// TODO: clean up this
	deck, err := h.app.App.FindRecordById("decks", deckID)
	if err != nil {
		logger.Error("Failed to find deck", "error", err, "deck_id", deckID)
		return apis.NewApiError(http.StatusInternalServerError, "Failed to find deck", err)
	}
	if deck == nil {
		logger.Error("Deck not found", "deck_id", deckID)
		return apis.NewApiError(http.StatusNotFound, "Deck not found", nil)
	}
	if deck.GetString("user") != user.Id {
		logger.Error("User does not own the deck", "user_id", user.Id, "deck_id", deckID)
		return apis.NewApiError(http.StatusForbidden, "You do not own this deck", nil)
	}

	file, fileHeader, err := e.Request.FormFile("file")
	if err != nil {
		logger.Error("Failed to get file from form", "error", err)
		return apis.NewBadRequestError("Failed to get file 'file' from form", err)
	}
	defer file.Close()

	if fileHeader == nil || fileHeader.Filename == "" {
		logger.Error("No file uploaded or file name is empty")
		return apis.NewBadRequestError("No file uploaded or file name is empty", nil)
	}

	if !strings.HasSuffix(fileHeader.Filename, ".apkg") {
		logger.Error("Invalid file type", "filename", fileHeader.Filename)
		return apis.NewBadRequestError("Invalid file type, expected .apkg", nil)
	}

	flashCardsCount, err := h.deckService.ImportAnki(deck, user, file, fileHeader, h.flashcardOps)
	if err != nil {
		logger.Error("Failed to import Anki file", "error", err)
		return apis.NewInternalServerError("Failed to import Anki file", err)
	}

	return e.JSON(http.StatusOK, map[string]any{
		"message":   fmt.Sprintf("Successfully processed %d flashcards from '%s'", flashCardsCount, fileHeader.Filename),
		"cardCount": flashCardsCount,
	})
}
