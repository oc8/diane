package utils

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"strings"

	"github.com/gosimple/slug"
	"github.com/pocketbase/pocketbase"
)

func IsMobileUserAgent(userAgent string) bool {
	mobileIdentifiers := []string{"Mobile", "Android", "iPhone", "iPad", "WebView", "iOS"}
	for _, identifier := range mobileIdentifiers {
		if strings.Contains(strings.ToLower(userAgent), strings.ToLower(identifier)) {
			return true
		}
	}
	return false
}

func IsMobileSecCHUA(secCHUA string) bool {
	mobileIdentifiers := []string{"Android", "iOS"}
	for _, identifier := range mobileIdentifiers {
		if strings.Contains(strings.ToLower(secCHUA), strings.ToLower(identifier)) {
			return true
		}
	}
	return false
}

func GenerateUniqueSlug(app *pocketbase.PocketBase, base string) (string, error) {
	slugified := slug.Make(base)
	if slugified == "" {
		return "", fmt.Errorf("failed to generate slug for base: %s", base)
	}

	exists, err := CheckSlugExists(app, slugified)
	if err != nil {
		return "", fmt.Errorf("error checking slug existence: %v", err)
	}

	if !exists {
		return slugified, nil
	}

	for i := 1; i <= 100; i++ {
		randomNum, err := rand.Int(rand.Reader, big.NewInt(1000))
		if err != nil {
			return "", fmt.Errorf("error generating random number: %v", err)
		}
		newSlug := fmt.Sprintf("%s-%d", slugified, randomNum.Int64())
		exists, err := CheckSlugExists(app, newSlug)
		if err != nil {
			return "", fmt.Errorf("error checking new slug existence: %v", err)
		}
		if !exists {
			return newSlug, nil
		}
	}

	return "", fmt.Errorf("failed to generate a unique slug for base: %s", base)
}

func CheckSlugExists(app *pocketbase.PocketBase, slug string) (bool, error) {
	var slugCount struct {
		Count int `db:"count"`
	}

	err := app.DB().NewQuery(`
		SELECT COUNT(*) AS count
		FROM decks
		WHERE slug = {:slug}
	`).Bind(map[string]any{"slug": slug}).One(&slugCount)
	if err != nil {
		return false, fmt.Errorf("error checking slug existence: %v", err)
	}
	return slugCount.Count > 0, nil
}
