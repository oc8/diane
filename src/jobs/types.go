package jobs

import (
	"context"

	"github.com/appleboy/go-fcm"
	"github.com/kataras/i18n"
	"github.com/oc8/pb-learn-with-ai/src/senders"
	"github.com/pocketbase/pocketbase"
)

type Job struct {
	ID          string
	Schedule    string
	App         *pocketbase.PocketBase
	FcmClient   *fcm.Client
	I18n        *i18n.I18n
	EmailSender *senders.EmailSender
	PushSender  *senders.PushNotificationSender
	Handler     func(ctx context.Context, job *Job) error
}
