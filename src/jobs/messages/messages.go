package jobs_messages

import (
	"fmt"
	"log"
	"math/rand/v2"

	"github.com/kataras/i18n"
)

type LocalizedMessage struct {
	Key         string
	ConditionFn func(data any) bool
	Count       int // if > 0 this assume that the message is a multiple choice and will be selected randomly
}

func CountLocalizedMessages(I18n *i18n.I18n, pool []LocalizedMessage) {
	for i := range pool {
		msg := &pool[i]
		count := 0
		for j := 1; ; j++ {
			numberedKey := fmt.Sprintf("%s.%d", msg.Key, j)

			translated := I18n.Tr("en", numberedKey, nil)

			if translated == numberedKey || translated == "" {
				break
			}
			count++
		}
		msg.Count = count

		if msg.Count == 0 {
			baseTranslated := I18n.Tr("en", msg.Key, nil)
			if baseTranslated != msg.Key && baseTranslated != "" {
				msg.Count = 1
			}
		}
	}
}

func ChooseLocalizedMessage(pool []LocalizedMessage, data any) LocalizedMessage {
	var candidates []LocalizedMessage

	for _, msg := range pool {
		if msg.ConditionFn == nil || msg.ConditionFn(data) {
			candidates = append(candidates, msg)
		}
	}
	if len(candidates) == 0 {
		panic("no matching message found")
	}

	return candidates[rand.IntN(len(candidates))]
}

func GetPoolMessageText(lang string, I18n *i18n.I18n, pool []LocalizedMessage, data any) string {
	message := ChooseLocalizedMessage(pool, data)

	if message.Count > 0 {
		message.Key += fmt.Sprintf(".%d", rand.IntN(message.Count)+1)
	}

	body := I18n.Tr(lang, message.Key, data)
	if body == "" {
		log.Printf("Warning: No translation found for key '%s' in language '%s'", message.Key, lang)
	}
	return body
}

func GetMessageText(lang string, I18n *i18n.I18n, key string, data any) string {
	message := I18n.Tr(lang, key, data)
	if message == "" {
		log.Printf("Warning: No translation found for key '%s' in language '%s'", key, lang)
	}
	return message
}
