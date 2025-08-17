package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"strings"

	"github.com/iktakahiro/revcatgo"
	"github.com/ipinfo/go/v2/ipinfo"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v82"
	"github.com/stripe/stripe-go/v82/webhook"
)

var supportedCurrencies []string

type BillingHandler struct {
	app         *pocketbase.PocketBase
	sc          *stripe.Client
	ipLocClient *ipinfo.Client
}

func NewBillingHandler(app *pocketbase.PocketBase, sc *stripe.Client, ipLocClient *ipinfo.Client) *BillingHandler {
	supportedCurrencies = strings.Split(strings.TrimSpace(os.Getenv("SUPPORTED_CURRENCIES")), ",")

	return &BillingHandler{
		app,
		sc,
		ipLocClient,
	}
}

type APIPrice struct {
	ID                string `json:"id"`
	Amount            int64  `json:"amount"`
	Currency          string `json:"currency"`
	RecurringInterval string `json:"recurring_interval"`
}

func isCurrencySupported(currency string) bool {
	for _, c := range supportedCurrencies {
		if strings.TrimSpace(c) == currency {
			return true
		}
	}
	return false
}

func (h *BillingHandler) GetStripeSubscriptionPrices(e *core.RequestEvent) error {
	productId := os.Getenv("STRIPE_SUBSCRIPTION_PRODUCT_ID")
	if productId == "" {
		return apis.NewApiError(http.StatusInternalServerError, "Invalid product ID", nil)
	}

	currency := e.Request.URL.Query().Get("currency")
	currency = strings.ToUpper(strings.TrimSpace(currency))

	if currency == "" {
		info, err := h.ipLocClient.GetIPInfo(net.ParseIP(e.Request.RemoteAddr))
		if err != nil {
			log.Printf("Failed to get IP info for %s: %v", e.Request.RemoteAddr, err)
			currency = "EUR"
		}
		if info != nil && info.CountryCurrency.Code != "" {
			currency = info.CountryCurrency.Code
		} else {
			currency = "EUR"
		}
		log.Printf("Using currency %s for IP %s", currency, e.Request.RemoteAddr)
	}

	if !isCurrencySupported(currency) && currency != "ALL" {
		log.Printf("Currency %s is not supported, defaulting to EUR", currency)
		currency = "EUR"
	}

	ctx := context.Background()
	params := &stripe.PriceListParams{
		Active:  stripe.Bool(true),
		Product: stripe.String(productId),
		Expand:  []*string{stripe.String("data.currency_options")},
	}

	annualPrices := []APIPrice{}
	monthlyPrices := []APIPrice{}
	productsIter := h.sc.V1Prices.List(ctx, params)
	for price, err := range productsIter {
		if err != nil {
			log.Printf("Failed to list Stripe prices: %v", err)
			return apis.NewApiError(http.StatusInternalServerError, "Failed to list Stripe prices", err)
		}
		if price.Active && price.Recurring != nil {
			if price.CurrencyOptions != nil {
				for currencyCode, option := range price.CurrencyOptions {
					if option != nil {
						if currency == "ALL" || strings.EqualFold(currencyCode, currency) {
							apiPrice := APIPrice{
								ID:                price.ID,
								RecurringInterval: string(price.Recurring.Interval),
								Amount:            int64(option.UnitAmount),
								Currency:          string(currencyCode),
							}

							switch price.Recurring.Interval {
							case stripe.PriceRecurringIntervalMonth:
								monthlyPrices = append(monthlyPrices, apiPrice)
							case stripe.PriceRecurringIntervalYear:
								annualPrices = append(annualPrices, apiPrice)
							}
						}
					} else {
						e.App.Logger().Error("Currency option is nil for price", "price_id", price.ID, "currency", currencyCode)
					}
				}
			}
		}
	}

	return e.JSON(http.StatusOK, map[string]interface{}{
		"annual":  annualPrices,
		"monthly": monthlyPrices,
	})
}

func (h *BillingHandler) checkCouponCode(couponCode string) (string, error) {
	if couponCode == "" {
		return "", nil
	}

	promoCodeListParams := &stripe.PromotionCodeListParams{
		Code:   stripe.String(couponCode),
		Active: stripe.Bool(true),
		ListParams: stripe.ListParams{
			Limit: stripe.Int64(1),
		},
	}

	ctx := context.Background()
	iter := h.sc.V1PromotionCodes.List(ctx, promoCodeListParams)
	for coupon, err := range iter {
		if err != nil {
			log.Printf("Failed to list Stripe discount codes: %v", err)
			return "", apis.NewApiError(http.StatusInternalServerError, "Internal server error", nil)
		}
		return coupon.ID, nil
	}

	return "", nil
}

type CreateCustomerRequest struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

type CreateSubscriptionRequest struct {
	PriceID      string `json:"price_id"`
	Currency     string `json:"currency"`
	DiscountCode string `json:"discount_code,omitempty"`
}

func (h *BillingHandler) CreateSubscription(e *core.RequestEvent) error {
	var req CreateSubscriptionRequest
	body, err := io.ReadAll(e.Request.Body)
	if err != nil {
		return apis.NewApiError(http.StatusBadRequest, "Failed to read request body", err)
	}

	if err := json.Unmarshal(body, &req); err != nil {
		return apis.NewApiError(http.StatusBadRequest, "Invalid request body", err)
	}

	if req.PriceID == "" {
		return apis.NewApiError(http.StatusBadRequest, "Missing required field: price_id", nil)
	}

	if e.Auth == nil || e.Auth.Id == "" {
		return apis.NewApiError(http.StatusUnauthorized, "Authentication required", nil)
	}

	user, err := h.app.FindAuthRecordByEmail("users", e.Auth.Email())
	if err != nil {
		log.Printf("Failed to find user by email: %v", err)
		return apis.NewApiError(http.StatusInternalServerError, "Failed to find user", err)
	}

	customerId := user.GetString("customer_id")
	subscriptionActive := user.GetString("subscription_status") == "active"

	if subscriptionActive {
		return apis.NewApiError(http.StatusBadRequest, "User already has an active subscription", nil)
	}

	req.Currency = strings.ToUpper(strings.TrimSpace(req.Currency))
	if req.Currency == "" {
		var clientIp string
		if e.Request.Header.Get("X-Forwarded-For") != "" {
			clientIp = e.Request.Header.Get("X-Forwarded-For")
		} else if e.Request.RemoteAddr != "" {
			clientIp = e.Request.RemoteAddr
		}

		info, err := h.ipLocClient.GetIPInfo(net.ParseIP(clientIp))
		if err != nil {
			log.Printf("Failed to get IP info for %s: %v", clientIp, err)
			req.Currency = "EUR"
		} else if info != nil && info.CountryCurrency.Code != "" {
			req.Currency = info.CountryCurrency.Code
		} else {
			req.Currency = "EUR"
		}
		log.Printf("Using currency %s for IP %s", req.Currency, clientIp)
	}
	if !isCurrencySupported(req.Currency) {
		log.Printf("Currency %s is not supported, defaulting to EUR", req.Currency)
		req.Currency = "EUR"
	}

	ctx := context.Background()

	if customerId == "" {
		email := e.Auth.Email()
		if email == "" {
			log.Println("Email is required to create a Stripe customer for user:", e.Auth.Id)
			return apis.NewApiError(http.StatusBadRequest, "Email is required to create a Stripe customer", nil)
		}

		params := &stripe.CustomerCreateParams{
			Email: stripe.String(email),
		}

		customer, err := h.sc.V1Customers.Create(ctx, params)

		if err != nil {
			log.Printf("Failed to create Stripe customer: %v", err)
			return apis.NewApiError(http.StatusInternalServerError, "Failed to create Stripe customer", err)
		}

		user.Set("customer_id", customer.ID)
		if err := h.app.Save(user); err != nil {
			log.Printf("Failed to save user with new customer ID: %v", err)
			return apis.NewApiError(http.StatusInternalServerError, "Failed to save user with new customer ID", err)
		}

		customerId = customer.ID
	}

	var promotionCodeId string
	if req.DiscountCode != "" {
		promotionCodeId, err = h.checkCouponCode(req.DiscountCode)
		if err != nil {
			log.Printf("Failed to check discount code: %v", err)
			return apis.NewApiError(http.StatusInternalServerError, "Failed to check discount code validity", err)
		}

		if promotionCodeId == "" {
			log.Printf("Invalid discount code: %s", req.DiscountCode)
			return apis.NewApiError(http.StatusBadRequest, "Invalid discount code", nil)
		}
	}

	subscriptionParams := &stripe.SubscriptionCreateParams{
		Customer: stripe.String(customerId),
		Items: []*stripe.SubscriptionCreateItemParams{
			{
				Price: stripe.String(req.PriceID),
			},
		},
		PaymentBehavior: stripe.String("default_incomplete"),
		BillingMode: &stripe.SubscriptionCreateBillingModeParams{
			Type: stripe.String("flexible"),
		},
		CancelAtPeriodEnd: stripe.Bool(true),
		Currency:          stripe.String(req.Currency),
	}

	if req.DiscountCode != "" {
		subscriptionParams.Discounts = []*stripe.SubscriptionCreateDiscountParams{
			{
				PromotionCode: stripe.String(promotionCodeId),
			},
		}
	}

	subscriptionParams.AddExpand("latest_invoice.confirmation_secret")

	subscription, err := h.sc.V1Subscriptions.Create(ctx, subscriptionParams)
	if err != nil {
		log.Printf("Failed to create subscription: %v", err)
		return apis.NewApiError(http.StatusInternalServerError, "Failed to create subscription", err)
	}

	var clientSecret string
	if subscription.LatestInvoice != nil && subscription.LatestInvoice.ConfirmationSecret != nil {
		clientSecret = subscription.LatestInvoice.ConfirmationSecret.ClientSecret
	} else {
		log.Println("No confirmation secret found in the latest invoice")
		clientSecret = ""
	}

	e.JSON(http.StatusOK, map[string]interface{}{
		"customer_id":    customerId,
		"payment_intent": clientSecret,
		"amount_due":     subscription.LatestInvoice.AmountDue,
		"currency":       subscription.LatestInvoice.Currency,
		"discounts":      subscription.Discounts,
	})

	return nil
}

func (h *BillingHandler) CancelSubscription(e *core.RequestEvent) error {
	if e.Auth == nil || e.Auth.Id == "" {
		return apis.NewApiError(http.StatusUnauthorized, "Authentication required", nil)
	}

	user, err := h.app.FindAuthRecordByEmail("users", e.Auth.Email())
	if err != nil {
		log.Printf("Failed to find user by email: %v", err)
		return apis.NewApiError(http.StatusInternalServerError, "Failed to find user", err)
	}

	currentSubscriptionId := user.GetString("subscription_id")
	if currentSubscriptionId == "" {
		return apis.NewApiError(http.StatusBadRequest, "No active subscription found for user", nil)
	}

	ctx := context.Background()
	_, err = h.sc.V1Subscriptions.Cancel(ctx, currentSubscriptionId, nil)
	if err != nil {
		log.Printf("Failed to cancel subscription for user %s: %v", user.Id, err)
		return apis.NewApiError(http.StatusInternalServerError, "Failed to cancel subscription", err)
	}

	return e.JSON(http.StatusOK, map[string]string{"status": "success"})
}

func (h *BillingHandler) HandleWebhook(e *core.RequestEvent) error {
	body, err := io.ReadAll(e.Request.Body)
	if err != nil {
		return apis.NewApiError(http.StatusBadRequest, "Failed to read request body", err)
	}

	event, err := webhook.ConstructEventWithOptions(body, e.Request.Header.Get("Stripe-Signature"), os.Getenv("STRIPE_WEBHOOK_SECRET"), webhook.ConstructEventOptions{
		IgnoreAPIVersionMismatch: true,
	})
	if err != nil {
		log.Printf("webhook.ConstructEvent: %v", err)
		return apis.NewApiError(http.StatusBadRequest, "Invalid webhook signature", err)
	}

	switch event.Type {
	case "customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted", "customer.subscription.paused":
		var subscription stripe.Subscription
		if err := json.Unmarshal(event.Data.Raw, &subscription); err != nil {
			log.Printf("Failed to unmarshal subscription data: %v", err)
			return apis.NewApiError(http.StatusInternalServerError, "Failed to process subscription data", err)
		}

		user, err := h.app.FindFirstRecordByData("users", "customer_id", subscription.Customer.ID)
		if err != nil {
			log.Printf("Failed to find user by customer ID: %v", err)
			return apis.NewApiError(http.StatusInternalServerError, "Failed to find user", err)
		}

		log.Printf("Received subscription event: %s for user %s", event.Type, user.Id)
		log.Printf("Subscription ID: %s, Status: %s", subscription.ID, subscription.Status)

		user.Set("subscription_status", string(subscription.Status))
		user.Set("subscription_id", subscription.ID)
		user.Set("payment_processor", "stripe")
		if err := h.app.Save(user); err != nil {
			log.Printf("Failed to update user subscription status: %v", err)
			return apis.NewApiError(http.StatusInternalServerError, "Failed to update user subscription status", err)
		}

		return e.JSON(http.StatusOK, map[string]string{"status": "success"})
	}

	return e.JSON(http.StatusOK, map[string]string{"status": "success"})
}

func (h *BillingHandler) HandleRevenueCatWebhook(e *core.RequestEvent) error {
	secretHeader := e.Request.Header.Get("Authorization")
	if secretHeader != fmt.Sprintf("Bearer %s", os.Getenv("REVENUE_CAT_WEBHOOK_SECRET")) {
		return apis.NewApiError(http.StatusUnauthorized, "Invalid webhook secret", nil)
	}

	var webhookEvent revcatgo.WebhookEvent
	err := json.NewDecoder(e.Request.Body).Decode(&webhookEvent)
	if err != nil {
		return err
	}

	log.Printf("Received RevenueCat webhook event: %v", webhookEvent)

	user, err := h.app.FindFirstRecordByData("users", "id", webhookEvent.Event.AppUserID)
	if err != nil {
		log.Printf("Failed to find user by app user ID: %v", err)
		return apis.NewApiError(http.StatusInternalServerError, "Failed to find user", err)
	}

	if user == nil {
		log.Printf("No user found for app user ID: %s", webhookEvent.Event.AppUserID)
		return apis.NewApiError(http.StatusNotFound, "User not found", nil)
	}

	switch webhookEvent.Event.Type.String() {
	case revcatgo.EventTypeInitialPurchase, revcatgo.EventTypeRenewal, revcatgo.EventTypeUnCancellation:
		{
			user.Set("subscription_status", "active")
			user.Set("subscription_id", webhookEvent.Event.OriginalTransactionID)
			user.Set("payment_processor", "revenuecat")
		}
	case revcatgo.EventTypeExpiration:
		{
			user.Set("subscription_status", "canceled")
			user.Set("subscription_id", "")
			user.Set("payment_processor", "revenuecat")
		}
	}

	if err := h.app.Save(user); err != nil {
		log.Printf("Failed to update user subscription status: %v", err)
		return apis.NewApiError(http.StatusInternalServerError, "Failed to update user subscription status", err)
	}

	return e.JSON(http.StatusOK, map[string]string{"status": "success"})
}
