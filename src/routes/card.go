package routes

import (
	"github.com/oc8/pb-learn-with-ai/src/handlers"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

// RegisterCardRoutes registers the card routes
func RegisterCardRoutes(se *core.ServeEvent, app *pocketbase.PocketBase) {
	cardHandler := handlers.NewCardHandler(app)
	
	app.Logger().Info("Registering card routes")
	
	// CSV import route - requires authentication
	se.Router.POST("/v1/cards/import/csv", cardHandler.HandleCSVImport)
}