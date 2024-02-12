package main

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/scharph/orda/web/client"
)

func main() {
	app := fiber.New()

	app.Use("/", filesystem.New(filesystem.Config{
        Root: http.FS(client.Assets),
        PathPrefix: "dist/client/browser",
        Browse: true,
		Index: "index.html",
    }))

    app.Get("/", func(c *fiber.Ctx) error {
        return c.SendString("Hello, World!")
    })

    app.Listen(":8080")
}
