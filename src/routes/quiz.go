package routes

import (
	"github.com/oc8/pb-learn-with-ai/src/handlers"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

// RegisterQuizRoutes registers the quiz routes
func RegisterQuizRoutes(se *core.ServeEvent, app *pocketbase.PocketBase) {
	quizHandler := handlers.NewQuizHandler(app)
	app.Logger().Info("Registering quiz route: POST /v1/ai/{id}/quiz")
	se.Router.POST("/v1/ai/{id}/quiz", quizHandler.HandleGenerateQuiz)
}