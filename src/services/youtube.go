package services

import (
	"bytes"
	"encoding/json"
	"math/rand"
	"strings"

	"errors"
	"fmt"

	// "io"
	// "net/http"
	"log/slog"
	"os"
	"os/exec"
	"path/filepath"
	// "time"
)

// ExtractAudioFromYouTube extracts audio from a YouTube video using yt-dlp
// It returns the path to the audio file and any error encountered
func ExtractAudioFromYouTube(youtubeURL string, outputDir string, outputFilename string) (string, error) {
	// Validate YouTube URL
	if youtubeURL == "" {
		return "", errors.New("YouTube URL cannot be empty")
	}

	// Create output directory if it doesn't exist
	if outputDir == "" {
		// Default to temporary directory
		outputDir = os.TempDir()
	}

	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create output directory: %w", err)
	}

	// Set default filename if not provided
	if outputFilename == "" {
		outputFilename = "audio.m4a"
	}

	// Ensure filename has appropriate extension
	if filepath.Ext(outputFilename) == "" {
		outputFilename += ".m4a"
	}

	// Full path to the output file
	outputPath := filepath.Join(outputDir, outputFilename)

	// Prepare the yt-dlp command
	cmd := exec.Command("yt-dlp", "-f", "bestaudio", "-o", outputPath, youtubeURL)

	// Capture standard output and error
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	// Execute the command
	err := cmd.Run()
	if err != nil {
		return "", fmt.Errorf("failed to extract audio: %w, stderr: %s", err, stderr.String())
	}

	// Check if the file was actually created
	if _, err := os.Stat(outputPath); err != nil {
		if os.IsNotExist(err) {
			return "", errors.New("audio file was not created")
		}
		return "", fmt.Errorf("error checking audio file: %w", err)
	}

	return outputPath, nil
}

// ExtractAudioSimple is a simplified version that uses default settings
func ExtractAudioSimple(youtubeURL string) (string, error) {
	return ExtractAudioFromYouTube(youtubeURL, "", "")
}

// internal/ytdl/subtitles.go

// import (
// 	"bufio"
// 	"errors"
// 	"fmt"
// 	"os/exec"
// 	"path/filepath"
// 	"regexp"
// 	"strings"
// )

// FetchSubtitle télécharge les sous-titres d’une vidéo YouTube.
//
// Priorité, dans l’ordre :
//  1. Sous-titres fournis par l’auteur, langue preferredLang
//  2. Sous-titres fournis par l’auteur, anglais (“en”)
//  3. Premier sous-titre non auto-généré disponible
//  4. Sous-titres auto-générés preferredLang
//  5. Sous-titres auto-générés anglais
//  6. Premier sous-titre auto-généré disponible
//
// videoURL      : URL YouTube complète ou abrégée
// preferredLang : code BCP-47 (ex. « fr »), vide ⇒ « en »
// outputDir     : dossier cible (doit exister)
//
// Retourne le chemin du fichier .vtt/ttml/etc. téléchargé.
//
// Nécessite l’exécutable « yt-dlp » présent dans le PATH.
func FetchSubtitle(videoURL string, logger *slog.Logger) (string, error) {
	filename := fmt.Sprintf("subtitle_%d", rand.Intn(100000))
	pattern := filepath.Join("tmp", filename)
	dlCmd := exec.Command(
		"yt-dlp",
		"--write-sub",
		"--skip-download",
		"--extractor-args", "youtube:lang=en;player_client=default,-web",
		"--sub-format", "json3",
		"-o", pattern,
		videoURL,
	)
	if err := dlCmd.Run(); err != nil {
		return "", fmt.Errorf("error downloading subtitle : %w", err)
	}
	//read the file stating by pattern
	path, err := getFullFileName(pattern)
	if err != nil {
		return "", fmt.Errorf("error getting file name : %w", err)
	}
	text, err := os.ReadFile(path)
	if err != nil {
		return "", fmt.Errorf("error reading file : %w", err)
	}
	os.Remove(path)
	var subtitle map[string]interface{}
	if err := json.Unmarshal(text, &subtitle); err != nil {
		return "", fmt.Errorf("error unmarshalling subtitle : %w", err)
	}
	result := ""
	for _, event := range subtitle["events"].([]interface{}) {
		for _, segment := range event.(map[string]interface{})["segs"].([]interface{}) {
			result += segment.(map[string]interface{})["utf8"].(string) + " "
		}
	}
	result = strings.ReplaceAll(result, "\n", "")
	return result, nil
}

func getFullFileName(prefix string) (string, error) {
	pattern := prefix + "*"
	matches, err := filepath.Glob(pattern)
	if err != nil {
		return "", err
	}

	for _, match := range matches {
		absPath, err := filepath.Abs(match)
		if err != nil {
			continue // Skip files with errors
		}
		return absPath, nil
	}

	return "", errors.New("no file found")
}
