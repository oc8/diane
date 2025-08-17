package handlers

import (
	"encoding/csv"
	"fmt"
	"net/http"
	"strings"

	"github.com/oc8/pb-learn-with-ai/src/types"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

// CardHandler handles card-related requests
type CardHandler struct {
	app *pocketbase.PocketBase
}

// NewCardHandler creates a new card handler
func NewCardHandler(app *pocketbase.PocketBase) *CardHandler {
	return &CardHandler{
		app: app,
	}
}

// CSVImportRequest represents the request for CSV import
type CSVImportRequest struct {
	DeckID string `json:"deck_id" form:"deck_id"`
}

// HandleCSVImport handles POST /v1/cards/import/csv
func (h *CardHandler) HandleCSVImport(e *core.RequestEvent) error {
	authRecord := e.Auth
	if authRecord == nil {
		return apis.NewApiError(http.StatusUnauthorized, "Authentication required", nil)
	}

	// Get deck_id from query parameter
	deckID := e.Request.URL.Query().Get("deck_id")
	if deckID == "" {
		return apis.NewApiError(http.StatusBadRequest, "Missing deck_id parameter", nil)
	}

	// Verify the deck exists and belongs to the user
	var deck struct {
		ID   string `db:"id"`
		User string `db:"user"`
	}

	db := h.app.DB()
	err := db.NewQuery("SELECT id, user FROM decks WHERE id = {:id}").
		Bind(map[string]interface{}{"id": deckID}).
		One(&deck)
	if err != nil {
		h.app.Logger().Error("Failed to find deck", "error", err, "deck_id", deckID)
		return apis.NewApiError(http.StatusNotFound, "Deck not found", err)
	}

	if deck.User != authRecord.Id {
		return apis.NewApiError(http.StatusForbidden, "Access denied to this deck", nil)
	}

	// Parse multipart form
	err = e.Request.ParseMultipartForm(32 << 20) // 32MB limit
	if err != nil {
		h.app.Logger().Error("Failed to parse multipart form", "error", err)
		return apis.NewApiError(http.StatusBadRequest, "Invalid multipart form", err)
	}

	// Get the CSV file
	file, fileHeader, err := e.Request.FormFile("csv_file")
	if err != nil {
		h.app.Logger().Error("Failed to get CSV file", "error", err)
		return apis.NewApiError(http.StatusBadRequest, "CSV file is required", err)
	}
	defer file.Close()

	// Validate file type
	if !strings.HasSuffix(strings.ToLower(fileHeader.Filename), ".csv") {
		return apis.NewApiError(http.StatusBadRequest, "File must be a CSV file", nil)
	}

	// Read and parse CSV
	csvReader := csv.NewReader(file)
	csvReader.FieldsPerRecord = -1 // Allow variable number of fields

	records, err := csvReader.ReadAll()
	if err != nil {
		h.app.Logger().Error("Failed to read CSV file", "error", err)
		return apis.NewApiError(http.StatusBadRequest, "Invalid CSV format", err)
	}

	h.app.Logger().Info("CSV parsing results", "total_records", len(records))
	if len(records) == 0 {
		return apis.NewApiError(http.StatusBadRequest, "CSV file is empty", nil)
	}

	// Process CSV records
	var cards []types.Card
	var importErrors []string

	// Detect CSV format and header row
	startIndex := 0
	questionCol := 0
	answerCol := 1

	if len(records) > 0 && len(records[0]) >= 2 {
		firstRow := records[0]

		// Clean BOM from first column if present
		if len(firstRow[0]) > 0 && firstRow[0][0] == 0xEF {
			firstRow[0] = strings.TrimPrefix(firstRow[0], "\ufeff")
		}

		// Check if first row contains headers
		for i, header := range firstRow {
			headerLower := strings.ToLower(strings.TrimSpace(header))
			if headerLower == "question" || headerLower == "front" {
				questionCol = i
				startIndex = 1
			} else if headerLower == "answer" || headerLower == "back" {
				answerCol = i
				startIndex = 1
			}
		}

		if startIndex == 1 {
			h.app.Logger().Info("Detected CSV headers", "question_col", questionCol, "answer_col", answerCol)
		}
	}

	h.app.Logger().Info("CSV processing", "start_index", startIndex, "total_records", len(records), "question_col", questionCol, "answer_col", answerCol)

	for i := startIndex; i < len(records); i++ {
		record := records[i]

		h.app.Logger().Debug("Processing CSV row", "row", i+1, "columns", len(record))

		// Skip empty rows
		if len(record) == 0 {
			h.app.Logger().Debug("Skipping empty row", "row", i+1)
			continue
		}

		// Check if we have enough columns for the detected format
		maxCol := questionCol
		if answerCol > maxCol {
			maxCol = answerCol
		}

		if len(record) <= maxCol {
			importErrors = append(importErrors, fmt.Sprintf("Row %d: insufficient columns (need at least %d)", i+1, maxCol+1))
			h.app.Logger().Debug("Insufficient columns", "row", i+1, "columns", len(record), "need", maxCol+1)
			continue
		}

		question := record[questionCol]
		answer := record[answerCol]

		if question == "" || answer == "" {
			importErrors = append(importErrors, fmt.Sprintf("Row %d: question and answer cannot be empty", i+1))
			h.app.Logger().Debug("Empty question or answer", "row", i+1, "question", question, "answer", answer)
			continue
		}

		h.app.Logger().Debug("Adding card", "row", i+1, "question", question, "answer", answer)
		cards = append(cards, types.Card{
			Question: question,
			Answer:   answer,
		})
	}

	h.app.Logger().Info("CSV processing completed", "valid_cards", len(cards), "errors", len(importErrors))

	if len(cards) == 0 {
		return apis.NewApiError(http.StatusBadRequest, "No valid cards found in CSV", nil)
	}

	// Check for duplicate cards in the deck
	var newCards []types.Card
	duplicateCount := 0

	for _, card := range cards {
		// Check if card already exists in the deck
		var existingCards []struct {
			ID string `db:"id"`
		}

		err := db.NewQuery("SELECT id FROM cards WHERE user = {:user} AND deck = {:deck} AND question = {:question} AND answer = {:answer}").
			Bind(map[string]interface{}{
				"user":     authRecord.Id,
				"deck":     deckID,
				"question": card.Question,
				"answer":   card.Answer,
			}).All(&existingCards)

		if err != nil {
			h.app.Logger().Error("Error checking for duplicate", "error", err, "question", card.Question)
			newCards = append(newCards, card)
		} else if len(existingCards) == 0 {
			// Card doesn't exist, add it
			h.app.Logger().Debug("Card is new", "question", card.Question)
			newCards = append(newCards, card)
		} else {
			h.app.Logger().Debug("Card is duplicate", "question", card.Question, "existing_count", len(existingCards))
			duplicateCount++
		}
	}

	h.app.Logger().Info("Duplicate check completed", "new_cards", len(newCards), "duplicates", duplicateCount)

	// Insert new cards
	importedCount := 0

	for _, card := range newCards {
		h.app.Logger().Debug("Inserting card", "question", card.Question, "answer", card.Answer, "deck", deckID, "user", authRecord.Id)

		_, err := db.NewQuery("INSERT INTO cards (question, answer, deck, user) VALUES ({:question}, {:answer}, {:deck}, {:user})").
			Bind(map[string]interface{}{
				"question": card.Question,
				"answer":   card.Answer,
				"deck":     deckID,
				"user":     authRecord.Id,
			}).Execute()

		if err != nil {
			h.app.Logger().Error("Failed to save card", "error", err, "question", card.Question)
			importErrors = append(importErrors, fmt.Sprintf("Failed to save card: %s", card.Question))
			continue
		}
		h.app.Logger().Debug("Card inserted successfully", "question", card.Question)
		importedCount++
	}

	h.app.Logger().Info("Card insertion completed", "imported", importedCount, "errors", len(importErrors))

	// Prepare response
	response := types.CSVImportResponse{
		ImportedCount:  importedCount,
		DuplicateCount: duplicateCount,
		TotalProcessed: len(cards),
		Errors:         importErrors,
	}

	h.app.Logger().Info("CSV import completed",
		"deck_id", deckID,
		"user_id", authRecord.Id,
		"imported", importedCount,
		"duplicates", duplicateCount,
		"errors", len(importErrors))

	return e.JSON(http.StatusOK, response)
}
