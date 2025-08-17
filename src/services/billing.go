package services

import (
	"context"
	"fmt"
	"log"

	"github.com/stripe/stripe-go/v82"
)

func CreateStripeCustomer(sc *stripe.Client, email string) (*stripe.Customer, error) {
	if email == "" {
		log.Println("Email is required to create a Stripe customer")
		return nil, fmt.Errorf("email is required")
	}

	params := &stripe.CustomerCreateParams{
		Email: stripe.String(email),
	}

	ctx := context.Background()

	customer, err := sc.V1Customers.Create(ctx, params)
	if err != nil {
		log.Printf("Failed to create Stripe customer: %v", err)
		return nil, err
	}

	return customer, nil
}

func CreateIncompleteStripeSubscription(sc *stripe.Client, customerID, priceID string) (*stripe.Subscription, error) {
	params := &stripe.SubscriptionCreateParams{
		Customer: stripe.String(customerID),
		Items: []*stripe.SubscriptionCreateItemParams{
			{
				Price: stripe.String(priceID),
			},
		},
		PaymentBehavior: stripe.String("default_incomplete"),
		Expand: []*string{
			stripe.String("latest_invoice.payment_intent"),
		},
	}

	ctx := context.Background()

	subscription, err := sc.V1Subscriptions.Create(ctx, params)
	if err != nil {
		log.Printf("Failed to create subscription: %v", err)
		return nil, err
	}

	return subscription, nil
}
