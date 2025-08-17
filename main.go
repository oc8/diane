package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"text/template"

	"github.com/gertd/go-pluralize"
	"github.com/ipinfo/go/v2/ipinfo"
	"github.com/joho/godotenv"
	"github.com/kataras/i18n"
	"github.com/oc8/pb-learn-with-ai/src/jobs"
	jobs_handlers "github.com/oc8/pb-learn-with-ai/src/jobs/handlers"
	"github.com/oc8/pb-learn-with-ai/src/routes"
	"github.com/oc8/pb-learn-with-ai/src/senders"
	"github.com/oc8/pb-learn-with-ai/src/services/fcm"

	// "github.com/oc8/pb-learn-with-ai/src/services/global"
	"github.com/oc8/pb-learn-with-ai/src/utils"
	"github.com/oc8/pb-learn-with-ai/src/validators"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/ghupdate"
	"github.com/pocketbase/pocketbase/plugins/jsvm"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/hook"
	"github.com/stripe/stripe-go/v82"
)

var pluralizeClient = pluralize.NewClient()

func getFuncs(current *i18n.Locale) template.FuncMap {
	return template.FuncMap{
		"plural": func(word string, count int) string {
			return pluralizeClient.Pluralize(word, count, true)
		},
	}
}

func main() {
	isDev := os.Getenv("DEV_MODE") == "true"
	if isDev {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	// log.SetFlags(log.LstdFlags | log.Lshortfile)
	// logger.Info("=== Starting PocketBase application ===")
	// logger.Info("Go version:", os.Getenv("GO_VERSION"))
	// logger.Info("Working directory:", os.Getenv("PWD"))

	app := pocketbase.New()
	logger := app.Logger()
	logger.Info("=== Starting PocketBase application ===")
	logger.Info("Go version:", "version", os.Getenv("GO_VERSION"))
	logger.Info("Working directory:", "directory", os.Getenv("PWD"))
	logger.Info("=== PocketBase app created ===")

	// Load i18n locales
	logger.Info("Loading i18n locales...")
	I18n, err := i18n.New(i18n.Glob("./locales/*", i18n.LoaderConfig{
		Funcs: getFuncs,
	}), "de-DE", "en-US", "es-ES", "fr-FR", "it-IT")

	if err != nil {
		logger.Error("failed to create i18n instance: %v", err)
	}
	logger.Info("i18n locales loaded")

	// Instantiate FCM client
	credsPath := os.Getenv("FCM_CREDENTIALS_PATH")
	logger.Info("FCM credentials path:", "path", credsPath)

	client, err := fcm.CreateFCMClient(credsPath)
	if err != nil {
		logger.Error("Failed to create FCM client:", "error", err)
		logger.Info("Continuing without FCM support...")
		client = nil
	}

	// Stripe
	apiKey := os.Getenv("STRIPE_SECRET_KEY")
	if apiKey == "" {
		logger.Error("STRIPE_SECRET_KEY environment variable is not set")
		return
	}
	sc := stripe.NewClient(apiKey)

	// IPLoc client
	token := os.Getenv("IP_LOC_TOKEN")
	if token == "" {
		logger.Error("IP_LOC_TOKEN environment variable is not set")
		return
	}
	ipLocClient := ipinfo.NewClient(nil, nil, token)

	// ---------------------------------------------------------------
	// Optional plugin flags:
	// ---------------------------------------------------------------

	var hooksDir string
	app.RootCmd.PersistentFlags().StringVar(
		&hooksDir,
		"hooksDir",
		"",
		"the directory with the JS app hooks",
	)

	var hooksWatch bool
	app.RootCmd.PersistentFlags().BoolVar(
		&hooksWatch,
		"hooksWatch",
		true,
		"auto restart the app on pb_hooks file change; it has no effect on Windows",
	)

	var hooksPool int
	app.RootCmd.PersistentFlags().IntVar(
		&hooksPool,
		"hooksPool",
		15,
		"the total prewarm goja.Runtime instances for the JS app hooks execution",
	)

	var migrationsDir string
	app.RootCmd.PersistentFlags().StringVar(
		&migrationsDir,
		"migrationsDir",
		"",
		"the directory with the user defined migrations",
	)

	var automigrate bool
	app.RootCmd.PersistentFlags().BoolVar(
		&automigrate,
		"automigrate",
		true,
		"enable/disable auto migrations",
	)

	var publicDir string
	app.RootCmd.PersistentFlags().StringVar(
		&publicDir,
		"publicDir",
		defaultPublicDir(),
		"the directory to serve static files",
	)

	var indexFallback bool
	app.RootCmd.PersistentFlags().BoolVar(
		&indexFallback,
		"indexFallback",
		true,
		"fallback the request to index.html on missing static path, e.g. when pretty urls are used with SPA",
	)

	app.RootCmd.ParseFlags(os.Args[1:])

	app.OnRecordCreate("decks").BindFunc(func(e *core.RecordEvent) error {
		newSlug, err := utils.GenerateUniqueSlug(app, "deck")
		if err != nil {
			logger.Error("Error generating slug for deck:", "name", e.Record.GetString("name"), "error", err)
			return err
		}
		e.Record.Set("slug", newSlug)
		return e.Next()
	})

	app.OnRecordUpdate("decks").BindFunc(func(e *core.RecordEvent) error {
		record, err := e.App.FindRecordById("decks", e.Record.GetString("id"))
		if err != nil {
			logger.Error("Error finding deck by ID:", "id", e.Record.GetString("id"), "error", err)
			return err
		}

		logger.Info("Updating slug for deck:", "name", record.GetString("name"), "id", record.GetString("id"))

		// newDeckName := e.Record.GetString("name")

		if e.Record.GetString("name") != "" || record.GetString("slug") != "" {
			return e.Next()
		}

		newSlug, err := utils.GenerateUniqueSlug(app, e.Record.GetString("name"))
		if err != nil {
			logger.Error("Error generating slug for deck:", "name", e.Record.GetString("name"), "error", err)
			return err
		}
		e.Record.Set("slug", newSlug)

		return e.Next()
	})

	// ---------------------------------------------------------------
	// Plugins and hooks:
	// ---------------------------------------------------------------

	// load jsvm (pb_hooks and pb_migrations)
	logger.Info("Registering jsvm plugin...")
	jsvm.MustRegister(app, jsvm.Config{
		MigrationsDir: migrationsDir,
		HooksDir:      hooksDir,
		HooksWatch:    hooksWatch,
		HooksPoolSize: hooksPool,
	})
	logger.Info("jsvm plugin registered")

	// migrate command (with js templates)
	logger.Info("Registering migrate command...")
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		TemplateLang: migratecmd.TemplateLangJS,
		Automigrate:  automigrate,
		Dir:          migrationsDir,
	})
	logger.Info("migrate command registered")

	// GitHub selfupdate
	logger.Info("Registering GitHub selfupdate...")
	ghupdate.MustRegister(app, app.RootCmd, ghupdate.Config{})
	logger.Info("GitHub selfupdate registered")

	// Config custom routes
	logger.Info("Configuring custom routes...")
	// globalService := global.NewService(app)
	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		routes.RegisterOCRRoutes(se, app)
		// routes.RegisterFSRSRoutes(se, app)
		routes.RegisterAIChatRoutes(se, app)
		routes.RegisterPushTokenRoutes(se, app, client)
		routes.RegisterQuizRoutes(se, app)
		routes.RegisterDeckRoutes(se, app)
		routes.RegisterCardRoutes(se, app)
		routes.RegisterBillingRoutes(se, app, sc, ipLocClient)

		return se.Next()
	})
	logger.Info("Custom routes configured")

	logger.Info("Binding validators...")
	validators.BindValidators(app)
	logger.Info("Validators bound")

	// Config senders
	logger.Info("Configuring senders...")
	emailSender := &senders.EmailSender{
		App: app,
	}
	pushSender := &senders.PushNotificationSender{
		FCMClient: client,
	}

	logger.Info("Registering jobs...")

	jobs.NewJob("reviewReminder", "0 */1 * * *", app).
		Handler(jobs_handlers.ReviewReminderJobHandler).
		WithFcmClient(client).
		WithI18n(I18n).
		AddSender(emailSender).
		AddSender(pushSender).
		BuildAndRegister()

	// jobs.NewJob("migration", "0 4 * * *", app).
	// 	Handler(jobs_handlers.MigrationJobHandler).
	// 	BuildAndRegister()
	// jobs.NewJob("clean decks", "0 3 * * *", app).
	// 	Handler(jobs_handlers.CleanDecksJobHandler).
	// 	BuildAndRegister()

	logger.Info("Jobs registered")

	// static route to serves files from the provided public dir
	// (if publicDir exists and the route path is not already defined)
	logger.Info("Setting up static file serving...")
	app.OnServe().Bind(&hook.Handler[*core.ServeEvent]{
		Func: func(e *core.ServeEvent) error {
			if !e.Router.HasRoute(http.MethodGet, "/{path...}") {
				e.Router.GET("/{path...}", apis.Static(os.DirFS(publicDir), indexFallback))
			}

			return e.Next()
		},
		Priority: 999, // execute as latest as possible to allow users to provide their own route
	})
	logger.Info("Static file serving configured")

	logger.Info("Starting PocketBase server...")
	if err := app.Start(); err != nil {
		logger.Error("Failed to start PocketBase server", "error", err)
	}
	logger.Info("PocketBase server started successfully")
}

// the default pb_public dir location is relative to the executable
func defaultPublicDir() string {
	if strings.HasPrefix(os.Args[0], os.TempDir()) {
		// most likely ran with go run
		return "./pb_public"
	}

	return filepath.Join(os.Args[0], "../pb_public")
}
