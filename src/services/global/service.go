package global

import (
	"github.com/pocketbase/pocketbase"
)

// Service handles deck-related business logic
type Service struct {
	app *pocketbase.PocketBase
}

// NewService creates a new deck service
func NewService(app *pocketbase.PocketBase) *Service {
	return &Service{
		app: app,
	}
}
