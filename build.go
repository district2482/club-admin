package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"html/template"
	"log"
	"os"
	"path/filepath"
	"strings"
)

var (
	outDir       = flag.String("outDir", "build", "the output directory")
	templatesDir = flag.String("templatesDir", "templates", "the templates directory")
)

func main() {
	initOutputDir()

	manifest, err := parseManifest(filepath.Join(*outDir, "asset-manifest.json"))
	if err != nil {
		log.Fatalf("could not read asset manifest due: %v", err)
	}

	jsFiles := Filter(manifest.Entrypoints, func(val string) bool {
		return strings.HasSuffix(val, ".js")
	})

	cssFiles := Filter(manifest.Entrypoints, func(val string) bool {
		return strings.HasSuffix(val, ".css")
	})

	err = generateIndexPageFromTemplate(jsFiles, cssFiles)
	if err != nil {
		log.Fatalf("index page cannot be generated")
	}

	fmt.Println("Build completed successfully.")
}

func initOutputDir() {
	if _, err := os.Stat(*outDir); os.IsNotExist(err) {
		os.Mkdir(*outDir, os.ModeDir)
	}
}

func generateIndexPageFromTemplate(jsFiles []string, cssFiles []string) error {
	template, err := template.ParseFiles(filepath.Join(*templatesDir, "index.html.tpl"))
	if err != nil {
		return fmt.Errorf("could not parse index template due: %v", err)
	}

	out, err := os.OpenFile(filepath.Join(*outDir, "index.html"), os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0755)
	if err != nil {
		return fmt.Errorf("could not open index.html for writing")
	}

	data := struct {
		CSSFiles []string
		JSFiles  []string
	}{
		CSSFiles: cssFiles,
		JSFiles:  jsFiles,
	}

	err = template.Execute(out, data)
	if err != nil {
		return fmt.Errorf("template error during evaluation: %v", err)
	}

	return nil
}

type manifest struct {
	Entrypoints []string `json:"entrypoints"`
}

func parseManifest(path string) (*manifest, error) {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return nil, err
	}

	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}

	m := new(manifest)
	err = json.NewDecoder(f).Decode(m)
	if err != nil {
		return nil, fmt.Errorf("could not decode manifest due :%v", err)
	}

	return m, nil
}

// Filter is filtering the provided array using the specified conditional rule.
func Filter(arr []string, cond func(string) bool) []string {
	result := []string{}
	for i := range arr {
		if cond(arr[i]) {
			result = append(result, arr[i])
		}
	}
	return result
}
