package senders

import (
	"context"
	"fmt"
	"net/mail"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/tools/mailer"
)

type EmailSender struct {
	App *pocketbase.PocketBase
}

type EmailPayload struct {
	To      string
	Subject string
	HTML    string
	Text    string
}

func (s *EmailSender) Send(ctx context.Context, payload interface{}) error {
	emailPayload, ok := payload.(*EmailPayload)
	if !ok {
		return fmt.Errorf("invalid payload type for EmailSender: expected *EmailPayload")
	}

	if s.App == nil {
		return fmt.Errorf("PocketBase app is not initialized in EmailSender")
	}
	if s.App.Settings() == nil || s.App.Settings().Meta.SenderAddress == "" {
		return fmt.Errorf("PocketBase sender address is not configured")
	}

	message := &mailer.Message{
		From: mail.Address{
			Address: s.App.Settings().Meta.SenderAddress,
			Name:    s.App.Settings().Meta.SenderName,
		},
		To:      []mail.Address{{Address: emailPayload.To}},
		Subject: emailPayload.Subject,
		HTML:    emailPayload.HTML,
		Text:    emailPayload.Text,
	}

	return s.App.NewMailClient().Send(message)
}
