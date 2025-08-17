package jobs

import "slices"

func IsSupportedLanguage(lang string) bool {
	supportedLanguages := []string{"en", "de", "es", "fr", "it"}
	return slices.Contains(supportedLanguages, lang)
}

func GetLang(lang string) string {
	if IsSupportedLanguage(lang) {
		return lang
	}
	return "en"
}
