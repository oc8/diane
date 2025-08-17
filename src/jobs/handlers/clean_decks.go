package jobs_handlers

import (
	"context"
	"log"

	"github.com/oc8/pb-learn-with-ai/src/jobs"
)

func CleanDecksJobHandler(ctx context.Context, job *jobs.Job) error {
	log.Println("Running deck cleanup job")
	logger := job.App.Logger()

	result, err := job.App.DB().NewQuery(`
		DELETE FROM decks
		WHERE name IS NULL
		   OR name = ''
	`).Execute()
	//  OR user IS NULL
	//  OR user = ''

	if err != nil {
		logger.Error("Failed to delete invalid decks", "error", err)
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	logger.Info("Deck cleanup completed", "deleted_count", rowsAffected)

	result2, err2 := job.App.DB().NewQuery(`
		DELETE FROM decks
		WHERE
			(SELECT key FROM types WHERE id = note_type) = 'note'
			AND content = ''
			AND (SELECT COUNT(*) FROM cards WHERE deck = id AND type != 'quiz') = 0
	`).Execute()

	if err2 != nil {
		logger.Error("Failed to delete invalid decks", "error", err2)
		return err2
	}

	rowsAffected2, _ := result2.RowsAffected()
	logger.Info("Deck cleanup completed", "deleted_count", rowsAffected2)

	return nil
}
