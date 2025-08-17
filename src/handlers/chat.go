package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/oc8/pb-learn-with-ai/src/services/chat"
	"github.com/oc8/pb-learn-with-ai/src/types"
	"github.com/oc8/pb-learn-with-ai/src/utils"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/subscriptions"
	"golang.org/x/sync/errgroup"
)

// ChatHandler handles AI chat requests
type ChatHandler struct {
	app         *pocketbase.PocketBase
	chatService *chat.Service
}

// NewChatHandler creates a new chat handler
func NewChatHandler(app *pocketbase.PocketBase) *ChatHandler {
	return &ChatHandler{
		app:         app,
		chatService: chat.NewService(app),
	}
}

// HandleChatRequest processes AI chat requests
func (h *ChatHandler) HandleChatRequest(e *core.RequestEvent) error {
	logger := h.app.Logger()
	logger.Info("Received AI chat request")
	logger.Error("Received AI chat request error test")
	isMobile := utils.IsMobileUserAgent(e.Request.UserAgent()) ||
		utils.IsMobileSecCHUA(e.Request.Header.Get("Sec-CH-UA"))

	var userID string
	if e.Auth != nil {
		userID = e.Auth.Id
	}
	if !isMobile && userID != "" {
		logger.Debug("Web request from user", "user_id", userID)
		var deckSize struct {
			Count              int    `db:"deck_count"`
			SubscriptionStatus string `db:"subscription_status"`
		}

		err := e.App.DB().NewQuery(`
			SELECT
					subscription_status,
					(SELECT COUNT(*) FROM decks WHERE user = users.id AND name != '') AS deck_count
			FROM
					users
			WHERE
					id = {:user_id}
		`).
			Bind(map[string]any{"user_id": userID}).
			One(&deckSize)

		if err != nil {
			logger.Error("Failed to get deck size", "error", err)
			return apis.NewApiError(http.StatusInternalServerError, "Failed to get deck size", err)
		}
		logger.Debug("Deck size for user", "user_id", userID, "count", deckSize.Count)

		if deckSize.Count >= 6 && deckSize.SubscriptionStatus != "active" {
			return apis.NewApiError(http.StatusPaymentRequired, "Maximum number of decks reached", nil)
		}
	}

	// Parse the request
	var req types.ChatRequest
	body, err := io.ReadAll(e.Request.Body)
	if err != nil {
		return apis.NewApiError(http.StatusBadRequest, "Failed to read request body", err)
	}

	if err := json.Unmarshal(body, &req); err != nil {
		return apis.NewApiError(http.StatusBadRequest, "Invalid request body", err)
	}

	// Validate the request
	if len(req.Messages) == 0 {
		return apis.NewApiError(http.StatusBadRequest, "Missing required parameter: messages", nil)
	}
	if req.DeckID == "" {
		return apis.NewApiError(http.StatusBadRequest, "Missing required parameter: deckId", nil)
	}

	// Process the chat request
	response, err := h.chatService.ProcessChatRequest(req)
	if err != nil {
		for _, mode := range req.Modes {
			h.chatService.RemoveLoadingState(req.DeckID, mode)
		}
		logger.Error("Failed to process chat request", "error", err)
		return apis.NewApiError(http.StatusInternalServerError, "Failed to process chat request", err)
	}

	// send realtime update to '/v4/ai/chat'
	if err := notify(h.app, "/v4/ai/chat", map[string]string{
		"deckId": req.DeckID,
		"userId": userID,
	}); err != nil {
		logger.Error("Failed to notify chat response", "error", err)
	}

	return e.JSON(http.StatusOK, *response)
}

func notify(app core.App, subscription string, data any) error {
	rawData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	message := subscriptions.Message{
		Name: subscription,
		Data: rawData,
	}

	group := new(errgroup.Group)

	chunks := app.SubscriptionsBroker().ChunkedClients(300)

	for _, chunk := range chunks {
		group.Go(func() error {
			for _, client := range chunk {
				if !client.HasSubscription(subscription) {
					continue
				}

				client.Send(message)
			}

			return nil
		})
	}

	return group.Wait()
}
