package routes

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"

	"firebase.google.com/go/v4/messaging"
	"github.com/appleboy/go-fcm"
	"github.com/oc8/pb-learn-with-ai/src/utils"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

type PushToken struct {
	DeviceID string `db:"device_id" json:"device_id"`
	Token    string `db:"token" json:"token"`
	Platform string `db:"platform" json:"platform"`
	User     string `db:"user" json:"user"`
	Enabled  bool   `db:"enabled" json:"enabled"`
	LastSeen string `db:"last_seen" json:"last_seen,omitempty"`
}

type PushTokenSend struct {
	Token string `db:"token" json:"token"`
	Title string `db:"title" json:"title"`
	Body  string `db:"body" json:"body"`
}

func RegisterPushTokenRoutes(se *core.ServeEvent, app *pocketbase.PocketBase, fcmClient *fcm.Client) {
	se.Router.POST("/api/push_token", func(e *core.RequestEvent) error {
		isMobile := utils.IsMobileUserAgent(e.Request.UserAgent()) ||
			utils.IsMobileSecCHUA(e.Request.Header.Get("Sec-CH-UA"))
		if !isMobile {
			return apis.NewApiError(http.StatusBadRequest, "Push tokens are only supported for mobile devices", nil)
		}

		var req PushToken
		body, err := io.ReadAll(e.Request.Body)
		if err != nil {
			return apis.NewApiError(http.StatusBadRequest, "Failed to read request body", err)
		}

		if err := json.Unmarshal(body, &req); err != nil {
			return apis.NewApiError(http.StatusBadRequest, "Invalid request body", err)
		}

		if req.DeviceID == "" || req.Token == "" || req.Platform == "" || req.User == "" {
			return apis.NewApiError(http.StatusBadRequest, "Missing required fields: device_id, token, platform, user", nil)
		}

		db := app.DB()
		logger := app.Logger()

		query := `
			INSERT INTO user_push_tokens (device_id, token, platform, user, enabled, last_seen)
			VALUES ({:device_id}, {:token}, {:platform}, {:user}, {:enabled}, datetime('now'))
			ON CONFLICT (device_id, user, platform) DO UPDATE SET
					token = EXCLUDED.token,
					enabled = CASE
							WHEN user_push_tokens.enabled = 0 THEN 0
							ELSE EXCLUDED.enabled
					END,
					last_seen = datetime('now')
			RETURNING device_id, token, platform, user, enabled, last_seen;
		`

		params := map[string]interface{}{
			"device_id": req.DeviceID,
			"token":     req.Token,
			"platform":  req.Platform,
			"user":      req.User,
			"enabled":   true,
		}

		var savedToken PushToken

		err = db.NewQuery(query).Bind(params).One(&savedToken)
		if err != nil {
			logger.Error("Failed to upsert push token", "error", err)
			return apis.NewApiError(http.StatusInternalServerError, "Failed to upsert push token", err)
		}

		e.Response.Header().Set("Content-Type", "application/json")
		return e.JSON(http.StatusOK, savedToken)
	})

	se.Router.POST("/api/push_token/send_test", func(e *core.RequestEvent) error {
		var req PushTokenSend
		body, err := io.ReadAll(e.Request.Body)
		if err != nil {
			return apis.NewApiError(http.StatusBadRequest, "Failed to read request body", err)
		}

		if err := json.Unmarshal(body, &req); err != nil {
			return apis.NewApiError(http.StatusBadRequest, "Invalid request body", err)
		}

		if req.Token == "" {
			return apis.NewApiError(http.StatusBadRequest, "Missing required fields: token", nil)
		}

		ctx := context.Background()

		ttl := time.Hour * 24
		_, err = fcmClient.Send(ctx, &messaging.Message{
			Token: req.Token,
			Notification: &messaging.Notification{
				Title: req.Title,
				Body:  req.Body,
			},
			APNS: &messaging.APNSConfig{
				Headers: map[string]string{
					"apns-priority": "10",
				},
				Payload: &messaging.APNSPayload{
					Aps: &messaging.Aps{
						Alert: &messaging.ApsAlert{
							Title: req.Title,
							Body:  req.Body,
						},
						Sound: "default",
					},
				},
			},
			Android: &messaging.AndroidConfig{
				Priority: "high",
				TTL:      &ttl,
			},
			FCMOptions: &messaging.FCMOptions{
				AnalyticsLabel: "review_reminder",
			},
		})
		if err != nil {
			log.Printf("Error sending notification to %s: %v", req.Token, err)
			return err
		}
		log.Printf("Notification sent to %s", req.Token)

		e.Response.Header().Set("Content-Type", "application/json")
		return e.JSON(http.StatusOK, map[string]string{
			"message": "Test push notification sent successfully",
		})
	})
}
