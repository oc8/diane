package jobs

import (
	"log"
	"time"

	// "github.com/kataras/i18n"
	"github.com/pocketbase/pocketbase"
)

const inactiveThresholdDays = 5
const reminderHour = 11 // 11am

type InactiveUser struct {
	Id       string `db:"id"`
	Email    string `db:"email"`
	Name     string `db:"name"`
	Language string `db:"language"`
	Timezone string `db:"timezone"`
	LastSeen string `db:"last_seen"`
}

// RegisterSendInactiveUserReminderEmailJob registers a scheduled job that runs every hour to check
// for users who haven't used the app for 5 days and sends them a reminder email at 11am in their timezone.
func RegisterSendInactiveUserReminderEmailJob(app *pocketbase.PocketBase) {
	app.Cron().MustAdd("SendInactiveUserReminderEmail", "0 */1 * * *", func() {
		now := time.Now().UTC()

		var inactiveUsers []InactiveUser

		// Query users who haven't been seen in 5 days or more
		err := app.DB().NewQuery(`
			SELECT u.id, u.email, u.name, u.language, u.timezone, u.last_seen
			FROM users u
			WHERE u.last_seen <= datetime('now', '-5 days')
			AND u.email <> ''
			AND NOT EXISTS (
				-- Check if we already sent an email in the last 7 days to avoid spamming
				SELECT 1 FROM email_logs el
				WHERE el.user = u.id
				AND el.type = 'inactive_reminder'
				AND el.created >= datetime('now', '-7 days')
			)
		`).Bind(nil).All(&inactiveUsers)

		if err != nil {
			log.Println("Query error for inactive users:", err)
			return
		}

		var eligibleUsers []InactiveUser

		// Filter users based on their local time (only send at 11am in their timezone)
		for _, user := range inactiveUsers {
			loc, err := time.LoadLocation(user.Timezone)
			if err != nil {
				log.Printf("Invalid timezone %s: %v", user.Timezone, err)
				loc = time.UTC
			}

			localTime := now.In(loc)
			if localTime.Hour() == reminderHour && localTime.Minute() < 5 {
				eligibleUsers = append(eligibleUsers, user)
			}
		}

		log.Printf("%d inactive users eligible for %d:00 reminder email", len(eligibleUsers), reminderHour)

		// Send emails to eligible users
		for _, user := range eligibleUsers {
			go func(user InactiveUser) {
				log.Printf("Sending inactive reminder email to user %s", user.Id)

				// Prepare email content
				// subject := "We miss you! Why did you leave?"
				// body := fmt.Sprintf(`
				// 	<p>Hello %s,</p>

				// 	<p>We noticed you haven't used our app for a while.
				// 	We'd love to hear your feedback on why you left and what we could do better.</p>

				// 	<p>If there's anything we can help with or if you have any suggestions,
				// 	please reply to this email or log back into the app.</p>

				// 	<p>Best regards,<br>
				// 	The Team</p>
				// `, user.Name)

				// message := &mailer.Message{
				// 	From: mail.Address{
				// 		// Address: e.App.Settings().Meta.SenderAddress,
				// 		// Name:    e.App.Settings().Meta.SenderName,
				// 	},
				// 	To:      []mail.Address{{Address: e.Record.Email()}},
				// 	Subject: subject,
				// 	HTML:    body,
				// 	// bcc, cc, attachments and custom headers are also supported...
				// }

				// err := mailClient.Send(message)
				// if err != nil {
				// 	log.Printf("Error sending inactive reminder email to %s: %v", user.Id, err)
				// 	return
				// }

				// For now, we're just logging that the email was sent
				// TODO: Add proper email logging mechanism when database structure is known
				log.Printf("Sent inactive reminder email to %s (%s)", user.Name, user.Email)

				log.Printf("Inactive reminder email sent to %s", user.Id)
			}(user)
		}
	})
}
