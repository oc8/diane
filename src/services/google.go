package services

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/option"
	"google.golang.org/api/youtube/v3"
)

// The video ID of a video you own.
const videoId = "YOUR_VIDEO_ID"

// Name of the file to store the OAuth 2.0 token.
const tokenFile = "token.json"

// getClient uses a Context and Config to retrieve a Token
// then generate a Client. It returns the generated Client.
func getClient(ctx context.Context, config *oauth2.Config) *http.Client {
	// The file token.json stores the user's access and refresh tokens, and is
	// created automatically when the authorization flow completes for the first time.
	tok, err := tokenFromFile(tokenFile)
	if err != nil {
		tok = getTokenFromWeb(config)
		saveToken(tokenFile, tok)
	}
	return config.Client(ctx, tok)
}

// getTokenFromWeb uses Config to request a Token.
// It returns the retrieved Token.
func getTokenFromWeb(config *oauth2.Config) *oauth2.Token {
	authURL := config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	fmt.Printf("Go to the following link in your browser then type the "+
		"authorization code: \n%v\n", authURL)

	var authCode string
	if _, err := fmt.Scan(&authCode); err != nil {
		log.Fatalf("Unable to read authorization code: %v", err)
	}

	tok, err := config.Exchange(context.TODO(), authCode)
	if err != nil {
		log.Fatalf("Unable to retrieve token from web: %v", err)
	}
	return tok
}

// tokenFromFile retrieves a Token from a given file path.
// It returns the retrieved Token and any read error encountered.
func tokenFromFile(file string) (*oauth2.Token, error) {
	f, err := os.Open(file)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	tok := &oauth2.Token{}
	err = json.NewDecoder(f).Decode(tok)
	return tok, err
}

// saveToken uses a file path to create a file and store the
// token in it.
func saveToken(path string, token *oauth2.Token) {
	fmt.Printf("Saving credential file to: %s\n", path)
	f, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0600)
	if err != nil {
		log.Fatalf("Unable to cache oauth token: %v", err)
	}
	defer f.Close()
	json.NewEncoder(f).Encode(token)
}

func main() {
	if videoId == "YOUR_VIDEO_ID" {
		log.Fatalf("Please replace 'YOUR_VIDEO_ID' with a valid video ID.")
	}

	ctx := context.Background()

	// Read the client secret from the file.
	b, err := os.ReadFile("client_secret.json")
	if err != nil {
		log.Fatalf("Unable to read client secret file: %v", err)
	}

	// If modifying these scopes, delete your previously saved token.json.
	config, err := google.ConfigFromJSON(b, youtube.YoutubeForceSslScope)
	if err != nil {
		log.Fatalf("Unable to parse client secret file to config: %v", err)
	}
	client := getClient(ctx, config)

	// Create the YouTube service object.
	service, err := youtube.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		log.Fatalf("Error creating YouTube client: %v", err)
	}

	// --- 1. List Caption Tracks ---
	fmt.Printf("\nListing captions for video: %s\n", videoId)
	listCall := service.Captions.List([]string{"snippet"}, videoId)
	listResponse, err := listCall.Do()
	if err != nil {
		log.Fatalf("Error listing captions: %v", err)
	}

	if len(listResponse.Items) == 0 {
		fmt.Println("No caption tracks found for this video.")
	} else {
		fmt.Println("Found caption tracks:")
		for _, item := range listResponse.Items {
			fmt.Printf("  - ID: %s, Language: %s, Name: '%s'\n", item.Id, item.Snippet.Language, item.Snippet.Name)
		}

		// --- 2. Download a Caption Track (using the first one found) ---
		firstCaptionId := listResponse.Items[0].Id
		fmt.Printf("\nDownloading caption track with ID: %s\n", firstCaptionId)
		downloadCall := service.Captions.Download(firstCaptionId)
		downloadCall.Tfmt("srt") // Specify format: srt, vtt, etc.

		resp, err := downloadCall.Download()
		if err != nil {
			log.Fatalf("Error downloading caption: %v", err)
		}
		defer resp.Body.Close()

		// Read the content and save to a file
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Fatalf("Error reading downloaded content: %v", err)
		}

		fileName := fmt.Sprintf("%s.srt", firstCaptionId)
		err = os.WriteFile(fileName, body, 0644)
		if err != nil {
			log.Fatalf("Error saving caption file: %v", err)
		}
		fmt.Printf("Caption downloaded and saved to %s\n", fileName)
	}

	// --- 3. Upload a New Caption Track ---
	captionFilePath := "new_captions.srt"
	fmt.Printf("\nUploading new caption track from file: %s\n", captionFilePath)

	captionFile, err := os.Open(captionFilePath)
	if err != nil {
		log.Printf("Could not open caption file '%s' for upload. Skipping upload. Error: %v", captionFilePath, err)
		return // Exit if file doesn't exist
	}
	defer captionFile.Close()

	newCaption := &youtube.Caption{
		Snippet: &youtube.CaptionSnippet{
			VideoId:  videoId,
			Language: "en", // BCP-47 language code
			Name:     "English Captions (Go API Upload)",
		},
	}

	insertCall := service.Captions.Insert([]string{"snippet"}, newCaption)
	uploadResponse, err := insertCall.Media(captionFile).Do()
	if err != nil {
		log.Fatalf("Error uploading caption: %v", err)
	}

	fmt.Println("Upload successful!")
	fmt.Printf("  - New Caption ID: %s\n", uploadResponse.Id)
	fmt.Printf("  - Language: %s\n", uploadResponse.Snippet.Language)
}
