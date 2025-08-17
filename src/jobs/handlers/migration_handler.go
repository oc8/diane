package jobs_handlers

import (
	"context"
	"log"

	"github.com/oc8/pb-learn-with-ai/src/jobs"
	"github.com/pocketbase/pocketbase/core"
)

type DeckMigration struct {
	ID   string `db:"id"`
	Type string `db:"type"`
	User string `db:"user"`
}

type TypeRecord struct {
	ID   string `db:"id"`
	Name string `db:"name"`
	User string `db:"user"`
	Key  string `db:"key"`
}

type UserRecord struct {
	ID       string `db:"id"`
	Language string `db:"language"`
}

func MigrationJobHandler(ctx context.Context, job *jobs.Job) error {
	log.Println("Running deck type migration job")
	logger := job.App.Logger()

	var decks []DeckMigration
	err := job.App.DB().NewQuery("SELECT id, type, user FROM decks").All(&decks)
	if err != nil {
		logger.Error("Failed to query decks", "error", err)
		return err
	}

	logger.Info("Found decks to migrate", "count", len(decks))

	for _, deck := range decks {
		// Convert legacy types
		newType := "note"
		if deck.Type == "image" || deck.Type == "pdf" {
			newType = "document"
		} else if deck.Type != "ai" && deck.Type != "" {
			newType = deck.Type
		}

		// Find or create the corresponding type record
		var typeRecord TypeRecord
		err := job.App.DB().NewQuery("SELECT id, key, user, name FROM types WHERE user = {:user} AND key = {:key}").
			Bind(map[string]any{
				"user": deck.User,
				"key":  newType,
			}).
			One(&typeRecord)

		if err != nil {
			// Type doesn't exist, create it
			logger.Info("Creating new type", "user", deck.User, "type", newType)
			var user UserRecord
			// Get user language for translations
			err := job.App.DB().NewQuery("SELECT id, language FROM users WHERE id = {:user}").
				Bind(map[string]any{"user": deck.User}).
				One(&user)
			if err != nil {
				logger.Error("Failed to get user language", "user", deck.User, "error", err)
				continue
			}

			collection, err := job.App.FindCollectionByNameOrId("types")
			if err != nil {
				logger.Error("Failed to find types collection", "error", err)
				continue
			}
			type Translation struct {
				Fr string `json:"fr"`
				En string `json:"en"`
				Es string `json:"es"`
				De string `json:"de"`
			}
			nameMap := map[string]Translation{
				"folder": {
					Fr: "Dossier",
					En: "Folder",
					Es: "Carpeta",
					De: "Ordner",
				},
				"note": {
					Fr: "Note",
					En: "Note",
					Es: "Nota",
					De: "Notiz",
				},
				"document": {
					Fr: "Document",
					En: "Document",
					Es: "Documento",
					De: "Dokument",
				},
				"video": {
					Fr: "Vidéo",
					En: "Video",
					Es: "Vídeo",
					De: "Video",
				},
			}

			record := core.NewRecord(collection)
			// Get localized name based on user language
			translation := nameMap[newType]
			var localizedName string
			switch user.Language {
			case "fr":
				localizedName = translation.Fr
			case "es":
				localizedName = translation.Es
			case "de":
				localizedName = translation.De
			default:
				localizedName = translation.En
			}
			record.Set("name", localizedName)
			record.Set("user", deck.User)
			record.Set("key", newType)

			switch newType {
			case "note":
				record.Set("icon", "lucide:text")
				record.Set("color", "blue")
			case "folder":
				record.Set("icon", "lucide:folder")
				record.Set("color", "dark-blue")
			case "document":
				record.Set("icon", "lucide:file-text")
				record.Set("color", "green")
			case "video":
				record.Set("icon", "lucide:youtube")
				record.Set("color", "red")
			default:
				logger.Error("Unknown type:", "newType", newType)
				record.Set("icon", "lucide:text")
				record.Set("color", "blue")
			}

			if err := job.App.Save(record); err != nil {
				logger.Error("Failed to create type record", "user", deck.User, "type", newType, "error", err)
				continue
			}

			typeRecord.ID = record.Id
			typeRecord.Key = newType
			typeRecord.User = deck.User
			typeRecord.Name = localizedName

			logger.Info("Created new type", "user", deck.User, "type", newType, "id", record.Id)
		}

		// Update the deck
		_, err = job.App.DB().NewQuery("UPDATE decks SET note_type = {:note_type} WHERE id = {:id}").
			Bind(map[string]any{
				"note_type": typeRecord.ID,
				"id":        deck.ID,
			}).
			Execute()

		if err != nil {
			logger.Error("Failed to update deck", "deck_id", deck.ID, "error", err)
			continue
		}

		logger.Info("Migrated deck", "deck_id", deck.ID, "old_type", deck.Type, "new_type", newType, "note_type_id", typeRecord.ID)
	}

	logger.Info("Migration job completed")
	return nil
}
