package jobs

import (
	"context"

	"github.com/appleboy/go-fcm"
	"github.com/kataras/i18n"
	"github.com/oc8/pb-learn-with-ai/src/senders"
	"github.com/pocketbase/pocketbase"
)

type JobBuilder struct {
	job Job
}

func NewJob(id, schedule string, app *pocketbase.PocketBase) *JobBuilder {
	return &JobBuilder{
		job: Job{
			ID:       id,
			Schedule: schedule,
			App:      app,
		},
	}
}

func (b *JobBuilder) WithFcmClient(client *fcm.Client) *JobBuilder {
	b.job.FcmClient = client
	return b
}

func (b *JobBuilder) WithI18n(i18n *i18n.I18n) *JobBuilder {
	b.job.I18n = i18n
	return b
}

func (b *JobBuilder) AddSender(sender interface{}) *JobBuilder {
	switch s := sender.(type) {
	case *senders.EmailSender:
		b.job.EmailSender = s
	case *senders.PushNotificationSender:
		b.job.PushSender = s
	default:
		panic("unsupported sender type")
	}
	return b
}

func (b *JobBuilder) Handler(fn func(ctx context.Context, job *Job) error) *JobBuilder {
	b.job.Handler = fn
	return b
}

func (b *JobBuilder) Build() Job {
	return b.job
}

func (b *JobBuilder) BuildAndRegister() Job {
	b.job.Register()
	return b.job
}

func (j *Job) Register() {
	j.App.Cron().MustAdd(j.ID, j.Schedule, func() {
		ctx := context.Background()
		if err := j.Handler(ctx, j); err != nil {
			j.App.Logger().Error("Error running job %s: %v", j.ID, err)
		}
	})
}
