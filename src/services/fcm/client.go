package fcm

import (
	"context"

	fcm "github.com/appleboy/go-fcm"
)

func CreateFCMClient(credentialsFilePath string) (*fcm.Client, error) {
	ctx := context.Background()

	client, err := fcm.NewClient(
    ctx,
    fcm.WithCredentialsFile(credentialsFilePath),
  )

	if err != nil {
		return nil, err
	}

	return client, nil
}
