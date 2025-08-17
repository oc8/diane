package services

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/abadojack/whatlanggo"
)

var commonLangs = "eng+fra"

func OCRImageBuffer(data []byte) (string, error) {
	tempDir, err := os.MkdirTemp("", "ocrimg")
	if err != nil {
		return "", fmt.Errorf("create temp dir: %w", err)
	}
	defer os.RemoveAll(tempDir)

	imgPath := filepath.Join(tempDir, "input.png")
	if err := os.WriteFile(imgPath, data, 0600); err != nil {
		return "", fmt.Errorf("write temp image: %w", err)
	}

	cmd := exec.Command("tesseract", imgPath, "stdout", "-l", commonLangs, "--psm", "1")
	var outBuf, errBuf bytes.Buffer
	cmd.Stdout = &outBuf
	cmd.Stderr = &errBuf

	if err := cmd.Run(); err != nil {
		return "", fmt.Errorf("tesseract failed: %s: %w", errBuf.String(), err)
	}

	text := outBuf.String()

	info := whatlanggo.Detect(text)
	langCode := langToTesseract(info.Lang.Iso6391())

	if info.IsReliable() && langCode != "" {
		cmd = exec.Command("tesseract", imgPath, "stdout", "-l", langCode, "--psm", "1")
		outBuf.Reset()
		errBuf.Reset()
		cmd.Stdout = &outBuf
		cmd.Stderr = &errBuf

		if err := cmd.Run(); err != nil {
			return "", fmt.Errorf("tesseract failed: %s: %w", errBuf.String(), err)
		}

		text = outBuf.String()
	}

	return text, nil
}

func OCRPDFBuffer(data []byte) (string, error) {
	tempDir, err := os.MkdirTemp("", "ocrpdf")
	if err != nil {
		return "", fmt.Errorf("create temp dir: %w", err)
	}
	defer os.RemoveAll(tempDir)

	pdfPath := filepath.Join(tempDir, "input.pdf")
	if err := os.WriteFile(pdfPath, data, 0600); err != nil {
		return "", fmt.Errorf("write temp PDF: %w", err)
	}

	cmd := exec.Command("pdftoppm", "-png", pdfPath, filepath.Join(tempDir, "page"))
	var errBuf bytes.Buffer
	cmd.Stderr = &errBuf
	if err := cmd.Run(); err != nil {
		return "", fmt.Errorf("pdftoppm failed: %s: %w", errBuf.String(), err)
	}

	files, err := filepath.Glob(filepath.Join(tempDir, "page*.png"))
	if err != nil {
		return "", fmt.Errorf("find converted pages: %w", err)
	}

	var out strings.Builder
	for _, img := range files {
		cmd := exec.Command("tesseract", img, "stdout", "-l", commonLangs, "--psm", "1")
		var outBuf bytes.Buffer
		errBuf.Reset()
		cmd.Stdout = &outBuf
		cmd.Stderr = &errBuf

		if err := cmd.Run(); err != nil {
			return "", fmt.Errorf("tesseract failed: %s: %s: %w", img, errBuf.String(), err)
		}

		out.WriteString(outBuf.String() + "\n")
	}

	return out.String(), nil
}

func langToTesseract(code string) string {
	switch code {
	case "en":
		return "eng"
	case "fr":
		return "fra"
	case "es":
		return "spa"
	case "de":
		return "deu"
	case "it":
		return "ita"
	case "pt":
		return "por"
	default:
		return ""
	}
}
