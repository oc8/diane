package types

import "github.com/oc8/pb-learn-with-ai/src/services"

// ChatRequest holds the data for the chat request
type ChatRequest struct {
	Messages []services.MessageType `json:"messages"`
	DeckID   string                 `json:"deckId"`
	Modes    []string               `json:"modes,omitempty"`
	Lang     string                 `json:"lang,omitempty"`
}

// User represents a user in the system
type User struct {
	ID                 string `json:"id"`
	Language           string `json:"language"`
	SubscriptionStatus string `json:"subscription_status"`
}

// Card represents a flashcard in a deck
type Card struct {
	ID       string `json:"id"`
	Question string `json:"question"`
	Answer   string `json:"answer"`
	Choices  string `json:"choices,omitempty"`
	Medias   string `json:"medias,omitempty"` // media list separated by commas
}

// Deck represents a collection of flashcards
type Deck struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Public  bool   `json:"public"`
	User    string `json:"user"`
	Icon    string `json:"icon"`
	Content string `json:"content"`
}

// QuizCard represents a card with quiz choices
type QuizCard struct {
	ID       string   `json:"id"`
	Question string   `json:"question"`
	Answer   string   `json:"answer"`
	Choices  []string `json:"choices"`
}

// QuizResponse represents the AI response for quiz generation
type QuizResponse struct {
	Cards []QuizCard `json:"cards"`
}

// CertifiedUser represents a certified user
type CertifiedUser struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Link struct {
	Name string `json:"name"`
	Type string `json:"type"`
	URL  string `json:"url"`
}

// CommunityDeck represents a deck in the community
type CommunityDeck struct {
	ID          string         `json:"id"`
	Slug        string         `json:"slug"`
	Name        string         `json:"name"`
	User        *CertifiedUser `json:"user"`
	Color       string         `json:"color"`
	Icon        string         `json:"icon"`
	Tag         string         `json:"tag"`
	Languages   []string       `json:"languages"`
	Size        int            `json:"size"`
	Description string         `json:"description"`
	Links       []Link         `json:"links"`
	Updated     string         `json:"updated"`
}

// ShareResponse represents the response for sharing a deck
type ShareResponse struct {
	Link string `json:"link"`
}

// DuplicateResponse represents the response for duplicating a deck
type DuplicateResponse struct {
	ID string `json:"id"`
}

// EmailCheckResponse represents the response for email checking
type EmailCheckResponse struct {
	Exists bool `json:"exists"`
}

// CSVImportResponse represents the response for CSV import
type CSVImportResponse struct {
	ImportedCount  int      `json:"imported_count"`
	DuplicateCount int      `json:"duplicate_count"`
	TotalProcessed int      `json:"total_processed"`
	Errors         []string `json:"errors,omitempty"`
}
