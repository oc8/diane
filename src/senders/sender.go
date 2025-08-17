package senders

import (
	"context"
)

type ISender interface {
	Send(ctx context.Context, payload interface{}) error
}
