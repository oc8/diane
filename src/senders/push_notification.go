package senders

import (
	"context"
	"fmt"
	"time"

	"firebase.google.com/go/v4/messaging"
	"github.com/appleboy/go-fcm"
)

type FCMOptions struct {
	APNS struct {
		Headers map[string]string
		Sound   string
	}
	Android struct {
		Priority string
		TTL      time.Duration
	}
	FCMOptions struct {
		AnalyticsLabel string
	}
}

var DefaultFCMOptions = FCMOptions{
	APNS: struct {
		Headers map[string]string
		Sound   string
	}{
		Headers: map[string]string{"apns-priority": "10"},
		Sound:   "default",
	},
	Android: struct {
		Priority string
		TTL      time.Duration
	}{
		Priority: "high",
		TTL:      24 * time.Hour,
	},
	FCMOptions: struct {
		AnalyticsLabel string
	}{
		AnalyticsLabel: "default",
	},
}

type FCMOptionsBuilder struct {
	opts FCMOptions
}

func NewFCMOptions() *FCMOptionsBuilder {
	return &FCMOptionsBuilder{
		opts: DefaultFCMOptions,
	}
}

func (b *FCMOptionsBuilder) Android(priority string, ttl time.Duration) *FCMOptionsBuilder {
	b.opts.Android.Priority = priority
	b.opts.Android.TTL = ttl
	return b
}

func (b *FCMOptionsBuilder) APNS(headers map[string]string, sound string) *FCMOptionsBuilder {
	b.opts.APNS.Headers = headers
	b.opts.APNS.Sound = sound
	return b
}

func (b *FCMOptionsBuilder) AnalyticsLabel(label string) *FCMOptionsBuilder {
	b.opts.FCMOptions.AnalyticsLabel = label
	return b
}

func (b *FCMOptionsBuilder) Build() FCMOptions {
	return b.opts
}

type PushNotificationSender struct {
	FCMClient *fcm.Client
}

type PushNotificationPayload struct {
	Token      string
	Title      string
	Body       string
	FCMOptions *FCMOptions
}

func (s *PushNotificationSender) Send(ctx context.Context, payload interface{}) error {
	pushPayload, ok := payload.(*PushNotificationPayload)
	if !ok {
		return fmt.Errorf("invalid payload type for PushNotificationSender: expected *PushNotificationPayload")
	}

	if s.FCMClient == nil {
		return fmt.Errorf("FCM client is not initialized in PushNotificationSender")
	}

	if pushPayload.Token == "" {
		return fmt.Errorf("token is required for push notification")
	}

	opt := DefaultFCMOptions
	if pushPayload.FCMOptions != nil {
		opt = *pushPayload.FCMOptions
	}

	msg := &messaging.Message{
		Token: pushPayload.Token,
		Notification: &messaging.Notification{
			Title: pushPayload.Title,
			Body:  pushPayload.Body,
		},
		APNS: &messaging.APNSConfig{
			Headers: opt.APNS.Headers,
			Payload: &messaging.APNSPayload{
				Aps: &messaging.Aps{
					Sound: opt.APNS.Sound,
					Alert: &messaging.ApsAlert{
						Title: pushPayload.Title,
						Body:  pushPayload.Body,
					},
				},
			},
		},
		Android: &messaging.AndroidConfig{
			Priority: opt.Android.Priority,
			TTL:      &opt.Android.TTL,
		},
		FCMOptions: &messaging.FCMOptions{
			AnalyticsLabel: opt.FCMOptions.AnalyticsLabel,
		},
	}

	_, err := s.FCMClient.Send(ctx, msg)
	return err
}
