package validators

import (
	"time"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	// "github.com/oc8/pb-learn-with-ai/src/services/event/repository"
)

func bindUsersValidations(app *pocketbase.PocketBase) {
	app.OnRecordValidate("users", "timezone").BindFunc(func(e *core.RecordEvent) error {
		timezone := e.Record.GetString("timezone")
		if timezone == "" {
			return e.Next()
		}

		_, err := time.LoadLocation(timezone)

		if err != nil {
			return apis.NewBadRequestError("Invalid timezone", err)
		}

		return e.Next()
	})
}

// func OnUserCreated(app *pocketbase.PocketBase, handler func(userRecord *core.Record) error) {
// 	app.OnRecordCreate("users").BindFunc(func(e *core.RecordEvent) error {
// 		if err := handler(e.Record); err != nil {
// 			return err
// 		}
// 		return e.Next()
// 	})
// }
