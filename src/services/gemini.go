package services

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"log/slog"
	"os"
	"strings"

	"google.golang.org/genai"
)

// "net/http"

type SourceType struct {
	Type     string `json:"type"`
	URL      string `json:"url"`
	Name     string `json:"name"`
	Base64   string `json:"base64,omitempty"`
	MimeType string `json:"mimetype,omitempty"`
}

type MessageType struct {
	Role    string       `json:"role"`
	Content string       `json:"content"`
	Sources []SourceType `json:"sources"`
}

type Flashcard struct {
	Q      string `json:"q,omitempty"`
	A      string `json:"a,omitempty"`
	ID     string `json:"id,omitempty"`
	Action string `json:"action,omitempty"`
}
type Deck struct {
	Name string `json:"name,omitempty"`
	// Slug       string      `json:"slug,omitempty"`
	Flashcards []Flashcard `json:"flashcards,omitempty"`
	Summary    string      `json:"summary,omitempty"`
}

type Result struct {
	Message string `json:"message"`
	Deck    *Deck  `json:"deck,omitempty"`
}

func SendMessageWithResponse(ctx context.Context, messages []MessageType, systemPrompt string, responseSchema genai.Schema, subscription_status string, stream bool, logger *slog.Logger) (Result, error) {
	var model = "gemini-2.5-flash"
	if subscription_status == "active" {
		model = "gemini-2.5-pro"
	}
	apiKey := os.Getenv("GEMINI_SECRET_KEY")
	if apiKey == "" {
		return Result{}, fmt.Errorf("Gemini API key is not configured")
	}
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  apiKey,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		log.Fatal(err)
	}

	// convert messages to genai.Content
	var history []*genai.Content
	// don't include the last message in the history
	logger.Info("len(messages)", "len(messages)", len(messages))
	if len(messages) > 1 {
		for _, message := range messages[:len(messages)-1] {
			if message.Role == "user" || message.Role == "assistant" {
				// Determine the role for Gemini API
				var role genai.Role
				if message.Role == "assistant" {
					role = genai.RoleModel
				} else {
					role = genai.RoleUser
				}

				// If there are no sources, just add text content
				// if len(message.Sources) == 0 {
				history = append(history, genai.NewContentFromText(message.Content, role))
				continue
				// }

				// Create content with multiple parts (text + sources)
				parts := []*genai.Part{{Text: message.Content}}

				// Process sources (links and files) from the message
				for _, source := range message.Sources {
					if source.Type == "link" {
						// Add file or link as file_uri
						filePart := genai.NewPartFromURI(source.URL, "")
						parts = append(parts, filePart)
					} else {
						// Read file content from the URL path
						fileData, err := os.ReadFile(source.URL)
						if err != nil {
							logger.Error("Failed to read file", "path", source.URL, "error", err)
							continue
						}

						// Store base64 encoded file data
						source.Base64 = base64.StdEncoding.EncodeToString(fileData)

						filePart := genai.NewPartFromBytes(fileData, source.MimeType)
						parts = append(parts, filePart)
					}
				}

				// Add multi-part content to history
				// Create a proper content object with the right types
				// Role in Content struct is a string, so we need to convert role to string
				roleStr := "user"
				if role == genai.RoleModel {
					roleStr = "model"
				}
				content := &genai.Content{
					Parts: parts,
					Role:  roleStr,
				}
				history = append(history, content)
			}
		}
	}

	config := &genai.GenerateContentConfig{
		ResponseMIMEType:  "application/json",
		ResponseSchema:    &responseSchema,
		SystemInstruction: genai.NewContentFromText(systemPrompt, genai.RoleUser),
	}
	chat, _ := client.Chats.Create(ctx, model, config, history)
	// Create message parts, starting with text content
	lastMessage := messages[len(messages)-1]
	messageParts := []genai.Part{{Text: lastMessage.Content}}

	// Process sources (links and files) from the message
	for _, source := range lastMessage.Sources {
		if source.Type == "link" {
			// Add link as file_uri
			filePart := genai.NewPartFromURI(source.URL, "")
			messageParts = append(messageParts, *filePart)
		} else if source.Type == "audio" {
			uploadedFile, _ := client.Files.UploadFromPath(
				ctx,
				source.URL,
				nil,
			)
			logger.Warn("Uploaded audio file", "url", uploadedFile.URI, "mimeType", uploadedFile.MIMEType)
			filePart := genai.NewPartFromURI(uploadedFile.URI, uploadedFile.MIMEType)
			messageParts = append(messageParts, *filePart)
		} else if source.Base64 != "" && source.MimeType != "" {
			// For files with base64 data
			logger.Warn("Processing base64 file", "name", source.Name, "mimeType", source.MimeType)

			// Handle data URLs by stripping the prefix if present
			base64Data := source.Base64
			dataURLPrefix := "data:" + source.MimeType + ";base64,"
			// TODO: why?
			if strings.HasPrefix(base64Data, dataURLPrefix) && (source.Name == "note.md" || source.Name == "flashcards.json") {
				logger.Info("Stripping data URL prefix", "prefix", dataURLPrefix)
				base64Data = strings.TrimPrefix(base64Data, dataURLPrefix)
			}

			data, err := base64.StdEncoding.DecodeString(base64Data)
			if err != nil {
				logger.Error("Failed to decode base64 data", "error", err, "name", source.Name, "base64_length", len(base64Data))
				continue
			}
			logger.Info("Successfully decoded base64 data", "name", source.Name, "decoded_size", len(data))
			filePart := genai.NewPartFromBytes(data, source.MimeType)
			messageParts = append(messageParts, *filePart)
		} else {
			logger.Info("Skipping source: missing required fields", "type", source.Type)
		}
	}
	res, err := chat.SendMessage(ctx, messageParts...)
	// Send message with all parts
	// for resp, err := range chat.SendMessageStream(ctx, messageParts...) {
	// 	if err != nil {
	// 		logger.Error("failed to send message to Gemini", "error", err)
	// 		continue
	// 	}

	// 	chunk := resp.Text()
	// 	logger.Info("Gemini response chunk", "chunk", chunk)
	// }

	if err != nil {
		return Result{}, fmt.Errorf("failed to send message to Gemini: %w", err)
	}
	logger.Debug("Full Gemini response", "response", res)
	if len(res.Candidates) > 0 {
		jsonData := res.Candidates[0].Content.Parts[0].Text
		var response Result
		err := json.Unmarshal([]byte(jsonData), &response)
		if err != nil {
			return Result{}, err
		}
		return response, nil
	}
	return Result{}, nil
}
