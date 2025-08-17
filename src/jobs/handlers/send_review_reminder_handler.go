package jobs_handlers

import (
	"context"
	"log"
	"sync"
	"time"

	"github.com/golang-queue/queue"
	"github.com/oc8/pb-learn-with-ai/src/jobs"
	jobs_messages "github.com/oc8/pb-learn-with-ai/src/jobs/messages"
	"github.com/oc8/pb-learn-with-ai/src/senders"
)

const notifyHour = 18
const minuteOffset = 5 // used to avoid race conditions when the for loop takes too long to execute

type TokenUserJoin struct {
	TokenId  string `db:"id"`
	Token    string `db:"token"`
	UserId   string `db:"user"`
	Name     string `db:"name"`
	Language string `db:"language"`
	Streak   int    `db:"streak"`
	Timezone string `db:"timezone"`
	LastSeen string `db:"last_seen"`
}

var reviewMessagesOnce sync.Once

var reviewMessages = []jobs_messages.LocalizedMessage{
	{
		Key: "notifications.reviewReminder.classic",
	},
	{
		Key: "notifications.reviewReminder.streak",
		ConditionFn: func(data any) bool {
			if user, ok := data.(TokenUserJoin); ok {
				return user.Streak > 0
			}
			log.Println("Warning: Data provided to ConditionFn is not a TokenUserJoin struct.")
			return false
		},
	},
}

func reviewReminderTimezoneFilter(now time.Time, users []TokenUserJoin) []TokenUserJoin {
	var filtered []TokenUserJoin

	for _, user := range users {
		loc, err := time.LoadLocation(user.Timezone)
		if err != nil {
			log.Printf("invalid timezone %s: %v", user.Timezone, err)
			loc = time.UTC
		}

		localTime := now.In(loc)
		if localTime.Hour() == notifyHour && localTime.Minute() < minuteOffset {
			filtered = append(filtered, user)
		}
	}

	return filtered
}

func ReviewReminderJobHandler(ctx context.Context, job *jobs.Job) error {
	now := time.Now().In(time.UTC)
	log.Printf("Running review reminder job at %s", now.Format(time.RFC3339))
	logger := job.App.Logger()

	reviewMessagesOnce.Do(func() {
		jobs_messages.CountLocalizedMessages(job.I18n, reviewMessages)
	})

	var results []TokenUserJoin

	// TODO: this is a temporary solution
	// In the future, we should store in the database when we sent notification
	// to avoid querying users that are not eligible
	// Maybe in the future we can chunk the query (FCM bulk is limited to 500)
	err := job.App.DB().NewQuery(`
		WITH RankedPushTokens AS (
			SELECT
				pt.id,
				pt.token,
				pt.user,
				pt.last_seen,
				pt.platform,
				ROW_NUMBER() OVER (PARTITION BY pt.user, pt.platform ORDER BY pt.last_seen DESC) as rn
			FROM user_push_tokens pt
			WHERE pt.last_seen >= datetime('now', '-7 days')
				AND pt.enabled = TRUE
		)
		SELECT
			rpt.id,
			rpt.token,
			rpt.user,
			rpt.last_seen,
			rpt.platform,
			u.timezone,
			u.name,
			u.language,
			u.streak
		FROM RankedPushTokens rpt
		JOIN users u ON rpt.user = u.id
		WHERE rpt.rn = 1
			AND u.review_today = FALSE;
	`).Bind(nil).All(&results)
	if err != nil {
		logger.Error("Failed to execute query", "error", err)
		return err
	}

	filtered := reviewReminderTimezoneFilter(now, results)

	log.Printf("%d tokens eligible for %d:00 notification", len(filtered), notifyHour)

	q := queue.NewPool(10)
	defer q.Release()
	defer q.Wait()

	for _, user := range filtered {
		if err := q.QueueTask(func(ctx context.Context) error {

			lang := jobs.GetLang(user.Language)
			title := jobs_messages.GetMessageText(lang, job.I18n, "notifications.reviewReminder.title", user)
			body := jobs_messages.GetPoolMessageText(lang, job.I18n, reviewMessages, user)

			logger.Info("Sending notification to", "user", user.UserId, "token", user.Token, "language", user.Language, "streak", user.Streak, "title", title, "body", body)

			fcmOpts := senders.NewFCMOptions().
				AnalyticsLabel("review_reminder").
				Build()

			payload := senders.PushNotificationPayload{
				Token:      user.Token,
				Title:      title,
				Body:       body,
				FCMOptions: &fcmOpts,
			}

			job.PushSender.Send(ctx, &payload)

			logger.Info("Notification sent to", "user", user.UserId, "token", user.Token)

			return nil
		}); err != nil {
			logger.Error("Error queuing task", "error", err)
			return err
		}
	}

	return nil
}
