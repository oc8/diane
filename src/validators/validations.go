package validators

import "github.com/pocketbase/pocketbase"

func BindValidators(app *pocketbase.PocketBase) {
	bindUsersValidations(app)
}
