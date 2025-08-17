package routes

import (
	"io"
	"net/http"
	"path/filepath"

	"github.com/oc8/pb-learn-with-ai/src/services"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func RegisterOCRRoutes(se *core.ServeEvent, app *pocketbase.PocketBase) {
	se.Router.POST("/ocr/process", func(e *core.RequestEvent) error {
		form, err := e.Request.MultipartReader()
		if err != nil {
			return apis.NewApiError(http.StatusBadRequest, "Invalid form data", err)
		}

		var fileContent []byte
		var fileName string

		for {
			part, err := form.NextPart()
			if err != nil {
				break
			}
			if part.FormName() == "file" {
				fileName = part.FileName()
				fileContent, err = io.ReadAll(part)
				if err != nil {
					return apis.NewApiError(http.StatusInternalServerError, "Failed to read file content", err)
				}
				break
			}
		}

		if len(fileContent) == 0 {
			return apis.NewApiError(http.StatusBadRequest, "File is empty", nil)
		}

		ext := filepath.Ext(fileName)
		var text string

		switch ext {
		case ".pdf":
			text, err = services.OCRPDFBuffer(fileContent)
		default:
			text, err = services.OCRImageBuffer(fileContent)
		}

		if err != nil {
			return apis.NewApiError(http.StatusInternalServerError, "Failed to perform ocr", err)
		}

		return e.JSON(http.StatusOK, map[string]string{"text": text})
	})
}
