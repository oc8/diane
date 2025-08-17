package routes

import (
	"github.com/oc8/pb-learn-with-ai/src/handlers"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

// RegisterDeckRoutes registers the deck routes
func RegisterDeckRoutes(se *core.ServeEvent, app *pocketbase.PocketBase) {
	deckHandler := handlers.NewDeckHandler(app)

	app.Logger().Info("Registering deck routes")

	// Community certified decks
	se.Router.GET("/v1/decks/community/certified", deckHandler.HandleCommunityDecks)

	// Share deck (make public and get link)
	se.Router.GET("/v1/deck/{id}/share", deckHandler.HandleShareDeck)
	se.Router.GET("/v2/decks/{id}/share", deckHandler.HandleShareDeck)

	// Duplicate deck (requires authentication)
	se.Router.POST("/v1/decks/{id}/duplicate", deckHandler.HandleDuplicateDeck)

	// Check if email exists
	se.Router.GET("/v1/check-email/{email}", deckHandler.HandleCheckEmail)

	se.Router.Bind(apis.BodyLimit(200<<20)).POST("/v1/import/anki", deckHandler.HandleImportAnki)
}
