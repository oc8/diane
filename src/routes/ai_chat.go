package routes

import (
	"github.com/oc8/pb-learn-with-ai/src/handlers"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

// RegisterAIChatRoutes registers the AI chat routes
func RegisterAIChatRoutes(se *core.ServeEvent, app *pocketbase.PocketBase) {
	chatHandler := handlers.NewChatHandler(app)
	se.Router.POST("/v4/ai/chat", chatHandler.HandleChatRequest)
}
