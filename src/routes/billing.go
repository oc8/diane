package routes

import (
	"github.com/ipinfo/go/v2/ipinfo"
	"github.com/oc8/pb-learn-with-ai/src/handlers"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v82"
)

func RegisterBillingRoutes(se *core.ServeEvent, app *pocketbase.PocketBase, sc *stripe.Client, ipLocClient *ipinfo.Client) {
	handler := handlers.NewBillingHandler(app, sc, ipLocClient)

	se.Router.GET("/v1/billing/subscription/prices", handler.GetStripeSubscriptionPrices)
	se.Router.POST("/v1/billing/subscription", handler.CreateSubscription)
	se.Router.DELETE("/v1/billing/subscription", handler.CancelSubscription)
	se.Router.POST("/v1/billing/webhook", handler.HandleWebhook)
	se.Router.POST("/v1/billing/webhook/revenuecat", handler.HandleRevenueCatWebhook)
}
