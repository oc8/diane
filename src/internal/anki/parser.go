package anki

import (
	"archive/zip"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

type AnkiMedia struct {
	Filename string `json:"filename"`
	Path     string `json:"path"`
}

type Flashcard struct {
	Question         string
	Answer           string
	Medias           []AnkiMedia
	IsCloze          bool
	ClozeNum         int
	IsImageOcclusion bool
}

type AnkiModel struct {
	Flds []struct {
		Name string `json:"name"`
		Ord  int    `json:"ord"`
	} `json:"flds"`
}

type AnkiCollection struct {
	Models map[string]AnkiModel `json:"models"`
}

func unzipApkg(src string, dest string) error {
	r, err := zip.OpenReader(src)
	if err != nil {
		return fmt.Errorf("failed to open zip file: %w", err)
	}
	defer r.Close()

	for _, f := range r.File {
		path := filepath.Join(dest, f.Name)

		if !strings.HasPrefix(path, filepath.Clean(dest)+string(os.PathSeparator)) && filepath.Clean(path) != filepath.Clean(dest) {
			return fmt.Errorf("zip slip vulnerability detected: %s", path)
		}

		if f.FileInfo().IsDir() {
			if err := os.MkdirAll(path, f.Mode()); err != nil {
				return fmt.Errorf("failed to create directory %s: %w", path, err)
			}
			continue
		}

		if err := os.MkdirAll(filepath.Dir(path), os.ModePerm); err != nil {
			return fmt.Errorf("failed to create directory %s: %w", filepath.Dir(path), err)
		}

		outFile, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
		if err != nil {
			return fmt.Errorf("failed to create file %s: %w", path, err)
		}
		rc, err := f.Open()
		if err != nil {
			outFile.Close()
			return fmt.Errorf("failed to open file in zip %s: %w", f.Name, err)
		}

		_, err = io.Copy(outFile, rc)

		outFile.Close()
		rc.Close()

		if err != nil {
			return fmt.Errorf("failed to copy file %s: %w", f.Name, err)
		}
	}
	return nil
}

var (
	imgSrcRegex = regexp.MustCompile(`(?i)<img[^>]+src=["']([^"']+)["']`)
	clozeRegex  = regexp.MustCompile(`\{\{c(\d+)::((?:[^{]|\{[^{])+)(?:::([^}]+))?\}\}`)
)

func extractMediaFilenames(content string, medias []AnkiMedia) []AnkiMedia {
	var media []AnkiMedia

	matches := imgSrcRegex.FindAllStringSubmatch(content, -1)
	for _, match := range matches {
		if len(match) > 1 {
			filename := match[1]
			for _, mediaItem := range medias {
				if mediaItem.Filename == filename {
					media = append(media, mediaItem)
					break
				}
			}
		}
	}

	return media
}

func isImageOcclusion(content string) bool {
	imageOcclusionRegex := regexp.MustCompile(`\b[a-f0-9]{32}-(ao|oa)-\d+\b`)
	return imageOcclusionRegex.MatchString(content)
}

func buildImageOcclusionCards(question string, medias []AnkiMedia) (Flashcard, error) {
	log.Println("Building image occlusion cards for question:", question, "with medias:", medias)

	if len(medias) < 3 {
		return Flashcard{}, fmt.Errorf("not enough media files for image occlusion. Expected at least 3, got %d", len(medias))
	}

	var baseImage, qMask, aMask string
	for _, media := range medias {
		if strings.Contains(media.Filename, "-Q") && strings.HasSuffix(media.Filename, ".svg") {
			qMask = media.Filename
		} else if strings.Contains(media.Filename, "-A") && strings.HasSuffix(media.Filename, ".svg") {
			aMask = media.Filename
		} else if !strings.HasSuffix(media.Filename, ".svg") {
			baseImage = media.Filename
		}
	}
	log.Println("Base image:", baseImage, "Question mask:", qMask, "Answer mask:", aMask)

	if baseImage == "" || qMask == "" || aMask == "" {
		return Flashcard{}, fmt.Errorf("could not find all required files for image occlusion (base image, question mask, and answer mask)")
	}

	htmlTemplate := `<div style="position: relative; display: inline-block;">
		<img src="%s" style="position: relative; z-index: 1;">
		<img src="%s" style="position: absolute; top: 0; left: 0; z-index: 2;">
	</div>`

	questionHTML := fmt.Sprintf(htmlTemplate, baseImage, qMask)
	answerHTML := fmt.Sprintf(htmlTemplate, baseImage, aMask)

	return Flashcard{
		Question:         questionHTML,
		Answer:           answerHTML,
		Medias:           medias,
		IsCloze:          false,
		ClozeNum:         0,
		IsImageOcclusion: true,
	}, nil
}

type ClozeMatch struct {
	Number int
	Text   string
	Hint   string
	Start  int
	End    int
}

func findClozes(text string) []ClozeMatch {
	matches := clozeRegex.FindAllStringSubmatchIndex(text, -1)
	submatches := clozeRegex.FindAllStringSubmatch(text, -1)

	var clozes []ClozeMatch
	for i, match := range matches {
		if len(submatches[i]) >= 3 {
			number := 0
			fmt.Sscanf(submatches[i][1], "%d", &number)

			hint := ""
			if len(submatches[i]) > 3 && submatches[i][3] != "" {
				hint = submatches[i][3]
			}

			clozes = append(clozes, ClozeMatch{
				Number: number,
				Text:   submatches[i][2],
				Hint:   hint,
				Start:  match[0],
				End:    match[1],
			})
		}
	}
	return clozes
}

func generateClozeCards(originalQuestion string, originalAnswer string, medias []AnkiMedia) []Flashcard {
	clozes := findClozes(originalQuestion)
	if len(clozes) == 0 {
		return nil
	}

	var cards []Flashcard

	clozeNumbers := make(map[int]bool)
	for _, cloze := range clozes {
		clozeNumbers[cloze.Number] = true
	}

	for clozeNum := range clozeNumbers {
		questionBuilder := strings.Builder{}
		lastIndex := 0
		for _, cloze := range clozes {
			questionBuilder.WriteString(originalQuestion[lastIndex:cloze.Start])

			if cloze.Number == clozeNum {
				if cloze.Hint != "" {
					questionBuilder.WriteString(fmt.Sprintf("[...%s]", cloze.Hint))
				} else {
					questionBuilder.WriteString("[...]")
				}
			} else {
				questionBuilder.WriteString(cloze.Text)
			}
			lastIndex = cloze.End
		}
		questionBuilder.WriteString(originalQuestion[lastIndex:])
		finalQuestion := questionBuilder.String()

		var finalAnswer string
		if originalQuestion == originalAnswer {
			answerBuilder := strings.Builder{}
			lastIndex = 0
			for _, cloze := range clozes {
				answerBuilder.WriteString(originalQuestion[lastIndex:cloze.Start])

				answerBuilder.WriteString(cloze.Text)
				lastIndex = cloze.End
			}
			answerBuilder.WriteString(originalQuestion[lastIndex:])
			finalAnswer = answerBuilder.String()
		} else {
			finalAnswer = originalAnswer
		}

		cards = append(cards, Flashcard{
			Question: strings.TrimSpace(finalQuestion),
			Answer:   strings.TrimSpace(finalAnswer),
			Medias:   medias,
			IsCloze:  true,
			ClozeNum: clozeNum,
		})
	}

	return cards
}

func ExtractFlashcardsStream(apkgPath, extractDir string) (<-chan Flashcard, <-chan error) {
	flashcardStream := make(chan Flashcard, 100)
	errorStream := make(chan error, 1)

	go func() {
		defer close(flashcardStream)
		defer close(errorStream)

		err := unzipApkg(apkgPath, extractDir)
		if err != nil {
			errorStream <- fmt.Errorf("failed to unzip Anki package: %w", err)
			return
		}

		dbPath := filepath.Join(extractDir, "collection.anki21")
		if _, err := os.Stat(dbPath); os.IsNotExist(err) {
			dbPath = filepath.Join(extractDir, "collection.anki21b")
		}

		if _, err := os.Stat(dbPath); os.IsNotExist(err) {
			errorStream <- fmt.Errorf("anki database file not found: %s", dbPath)
			return
		}

		db, err := sql.Open("sqlite3", dbPath)
		if err != nil {
			errorStream <- fmt.Errorf("failed to open Anki database %s: %w", dbPath, err)
			return
		}
		defer db.Close()

		var colJSON string
		err = db.QueryRow("SELECT models FROM col").Scan(&colJSON)
		if err != nil {
			errorStream <- fmt.Errorf("failed to query 'models' from 'col' table: %w", err)
			return
		}

		var ankiCol AnkiCollection
		err = json.Unmarshal([]byte(colJSON), &ankiCol.Models)
		if err != nil {
			errorStream <- fmt.Errorf("failed to unmarshal Anki collection models JSON: %w", err)
			return
		}

		mediaMap := map[string]string{}
		mediaJSONPath := filepath.Join(extractDir, "media")
		mediaBytes, err := os.ReadFile(mediaJSONPath)
		if err == nil {
			err = json.Unmarshal(mediaBytes, &mediaMap)
			if err != nil {
				errorStream <- fmt.Errorf("failed to unmarshal media JSON: %w", err)
				return
			}
		} else if !os.IsNotExist(err) {
			errorStream <- fmt.Errorf("error reading media file: %w", err)
			return
		}

		medias := make([]AnkiMedia, 0, len(mediaMap))
		for index, name := range mediaMap {
			medias = append(medias, AnkiMedia{
				Filename: name,
				Path:     filepath.Join(extractDir, index),
			})
		}

		rows, err := db.Query("SELECT flds, mid FROM notes")
		if err != nil {
			errorStream <- fmt.Errorf("failed to query notes from database: %w", err)
			return
		}
		defer rows.Close()

		for rows.Next() {
			var fldsRaw string
			var midStr string
			if err := rows.Scan(&fldsRaw, &midStr); err != nil {
				errorStream <- fmt.Errorf("failed to scan note row: %w", err)
				return
			}

			model, ok := ankiCol.Models[midStr]
			if !ok {
				fmt.Printf("Warning: Skipping note with unknown model ID: %s\n", midStr)
				continue
			}

			parts := strings.Split(fldsRaw, "\x1f")

			var noteMediaFiles []AnkiMedia

			fieldContents := make(map[string]string)

			for _, field := range model.Flds {
				if field.Ord < len(parts) {
					content := parts[field.Ord]
					fieldContents[field.Name] = content
					noteMediaFiles = append(noteMediaFiles, extractMediaFilenames(content, medias)...)
				}
			}

			questionContent := ""
			answerContent := ""

			if content, ok := fieldContents["Front"]; ok {
				questionContent = content
			} else if content, ok := fieldContents["Question"]; ok {
				questionContent = content
			} else if len(parts) > 0 {
				questionContent = parts[0]
			}

			if content, ok := fieldContents["Back"]; ok {
				answerContent = content
			} else if content, ok := fieldContents["Answer"]; ok {
				answerContent = content
			} else if len(parts) > 1 {
				answerContent = parts[1]
			}

			if questionContent == "" && answerContent == "" {
				log.Println("Skipping empty flashcard")
				continue
			}

			if isImageOcclusion(questionContent) {
				card, err := buildImageOcclusionCards(questionContent, noteMediaFiles)
				if err != nil {
					errorStream <- fmt.Errorf("failed to build image occlusion cards: %w", err)
					return
				}
				flashcardStream <- card
				continue
			}

			if clozeRegex.MatchString(questionContent) {
				clozeCards := generateClozeCards(questionContent, answerContent, noteMediaFiles)
				for _, card := range clozeCards {
					flashcardStream <- card
				}
				continue
			}

			flashcardStream <- Flashcard{
				Question: questionContent,
				Answer:   answerContent,
				Medias:   noteMediaFiles,
				IsCloze:  false,
				ClozeNum: 0,
			}
		}

		if err := rows.Err(); err != nil {
			errorStream <- fmt.Errorf("error iterating through note rows: %w", err)
			return
		}
	}()

	return flashcardStream, errorStream
}
