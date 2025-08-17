package prompts

import (
	"github.com/oc8/pb-learn-with-ai/src/types"
	"google.golang.org/genai"
)

// Builder handles system prompt construction
type Builder struct{}

// NewBuilder creates a new prompt builder
func NewBuilder() *Builder {
	return &Builder{}
}

// BuildPromptAndSchema builds the system prompt and response schema based on modes
func (b *Builder) BuildPromptAndSchema(modes []string, cards []types.Card, user *types.User, language string) (string, genai.Schema) {
	systemPrompt := `You are Diane, an agent embedded in a flashcard app.`

	responseSchema := genai.Schema{
		Type: "object",
		Properties: map[string]*genai.Schema{
			"message": &genai.Schema{
				Type: "string",
			},
		},
		Required: []string{"message"},
	}

	// Configure response schema based on modes
	if contains(modes, "discussion") {
		systemPrompt += b.buildDiscussionPrompt()
	}

	if contains(modes, "reflection") {
		systemPrompt += b.buildReflectionPrompt()
	}

	if contains(modes, "flashcard") {
		deckSchema := b.buildFlashcardSchema(modes, cards)
		systemPrompt += b.buildFlashcardPrompt(modes, cards)
		responseSchema.Properties["deck"] = deckSchema
	}

	if contains(modes, "quiz") {
		systemPrompt += b.buildQuizPrompt()
	}

	if contains(modes, "summary") {
		deckSchema := b.buildSummarySchema()
		systemPrompt += b.buildSummaryPrompt()
		responseSchema.Properties["deck"] = deckSchema
	}

	if contains(modes, "now") {
		systemPrompt += `Directly do it now.`
		responseSchema.Required = append(responseSchema.Required, "deck")
	}

	// Add language instruction
	if user != nil {
		systemPrompt += "\nRespond in " + user.Language
	} else if language != "" {
		systemPrompt += "\nRespond in " + language
	} else {
		systemPrompt += "\nRespond in the same language as the last message"
	}

	return systemPrompt, responseSchema
}

func (b *Builder) buildDiscussionPrompt() string {
	return `
If the user ask you questions about space repetition, flashcards, or retention, explain why is the best way to learn.

You are in discussion mode.
If the user send you sources or if is related to flashcards, quiz or summary, suggest to switch to another mode.
`
}

func (b *Builder) buildReflectionPrompt() string {
	return `Instead of providing a direct answer, guide the user through a process of discovery. Ask thoughtful questions that lead them toward understanding the problem. Provide frameworks, resources, or thinking strategies that enable them to reach their own conclusions. When appropriate, offer partial hints or suggest approaches without revealing complete solutions. Encourage critical thinking and independent problem-solving while remaining supportive throughout their learning journey.`
}

func (b *Builder) buildFlashcardPrompt(modes []string, cards []types.Card) string {
	// if !contains(modes, "now") {
	prompt := `At first try to understand explicitly what the user want to learn.`
	// , remove all stop words and useless words (no "what is", "how to", etc.) (bad: "what is 1+1", good: "1+1", bad: "Meaning 'Bonjour' ?", good: "Bonjour")
	if len(cards) == 0 {
		prompt += `
Then when you have a clear idea of what the user want to learn, suggest flashcards for it.
When you suggest flashcards:
Always ask if the flashcards meet the user's expectations and if the level is appropriate.
`
	} else {
		prompt += `
If the user ask you some modification on the current deck, you can use actions to add, update or remove flashcards.
`
	}
	prompt += `
Flashcards should be:
- short question (q)
- answer (a) short and concise
- with html formatting for the answer if is needed (for example: <b>bold</b> or <i>italic</i>, tables, etc.)
`
	// if len(cards) == 0 && !contains(modes, "now") {
	// 	prompt += `REMINDER: Wait to know the user's level before suggesting flashcards!`
	// }
	return prompt
	// }
	// return ""
}

func (b *Builder) buildFlashcardSchema(modes []string, cards []types.Card) *genai.Schema {
	if len(cards) == 0 {
		return &genai.Schema{
			Type: "object",
			Properties: map[string]*genai.Schema{
				"name": &genai.Schema{
					Type: "string",
				},
				"flashcards": &genai.Schema{
					Type: "array",
					Items: &genai.Schema{
						Type: "object",
						Properties: map[string]*genai.Schema{
							"q": &genai.Schema{
								Type:        "string",
								Description: "The question of the flashcard",
							},
							"a": &genai.Schema{
								Type:        "string",
								Description: "The answer of the flashcard",
							},
						},
						Required: []string{"q", "a"},
					},
				},
			},
			Required: []string{"name", "flashcards"},
		}
	}

	return &genai.Schema{
		Type: "object",
		Properties: map[string]*genai.Schema{
			"flashcards": &genai.Schema{
				Type: "array",
				Items: &genai.Schema{
					Type: "object",
					Properties: map[string]*genai.Schema{
						"q": &genai.Schema{
							Type:        "string",
							Description: "The question of the flashcard",
						},
						"a": &genai.Schema{
							Type:        "string",
							Description: "The answer of the flashcard",
						},
						"action": &genai.Schema{
							Type:        "string",
							Description: "The action to take with the flashcard ('add', 'update', 'remove')",
						},
						"id": &genai.Schema{
							Type:        "string",
							Description: "The ID of the flashcard if it exists",
						},
					},
					Required: []string{"action", "q", "a"},
				},
			},
		},
		Required: []string{"flashcards"},
	}
}

func (b *Builder) buildQuizPrompt() string {
	return `
Fill the choices field for each card with 3 false answers.
The false answers must seem true.
Do not include the correct answer in the choices.`
}

func (b *Builder) buildSummaryPrompt() string {
	return `
Guidelines for creating high-quality summaries:
1. Identify and include ALL the main ideas and essential points from the original text
2. Maintain the original meaning and intent of the content
3. Organize information in a logical and coherent structure with clear sections
4. Provide a comprehensive summary that captures both high-level concepts and important details
5. Use html formatting to improve readability:
   - Use headers (<h2> and <h3>) for section titles
   - Use <b>bold</b> for important terms or concepts
   - Use <i>italics</i> for emphasis
   - Use bullet points or numbered lists for related items
   - Use blockquotes (<blockquote>) for important quotes or takeaways
6. Avoid adding your own opinions or information not present in the original text
7. Preserve the tone of the original content when appropriate
8. Aim for a detailed summary that is approximately 30-40 pourcent of the length of the original text

Text can be an external source (e.g. a file, an image, a video, a website, etc.)
`
}

func (b *Builder) buildSummarySchema() *genai.Schema {
	return &genai.Schema{
		Type: "object",
		Properties: map[string]*genai.Schema{
			"name": &genai.Schema{
				Type: "string",
			},
			"summary": &genai.Schema{
				Type: "string",
			},
		},
		Required: []string{"name", "summary"},
	}
}

// contains checks if a slice contains a string
func contains(slice []string, s string) bool {
	for _, item := range slice {
		if item == s {
			return true
		}
	}
	return false
}
