package router

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/scharph/orda/internal/handler"
	"github.com/scharph/orda/internal/middleware"
	"github.com/scharph/orda/web/client"
)

func SetupRoutes(app *fiber.App) {
	app.Use("/", filesystem.New(filesystem.Config{
		Root:       http.FS(client.Assets),
		PathPrefix: "dist/client/browser",
		Browse:     true,
		Index:      "index.html",
	}))

	app.Use(cors.New())

	api := app.Group("/api", logger.New())
	// api.Use(jwtware.New(jwtware.Config{
	// 	SigningKey: jwtware.SigningKey{
	// 		JWTAlg: jwtware.RS256,
	// 		Key:    middleware.Secret_key,
	// 	},
	// }))

	api.Get("/", handler.Hello)

	// Auth
	auth := api.Group("/auth")
	auth.Post("/login", handler.Login)

	// Products
	product := api.Group("/article")
	product.Get("/", handler.GetAllArticles)
	product.Post("/", middleware.Protected(), handler.CreateArticle)

}
