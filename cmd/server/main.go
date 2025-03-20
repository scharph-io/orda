package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/accesscontrol"
	"github.com/scharph/orda/internal/config"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/middleware"
	"github.com/scharph/orda/internal/router"
)

var (
	version string
	date    string
)

func main() {
	serverC := config.GetConfig().Server

	app := fiber.New(fiber.Config{
		AppName: fmt.Sprintf("orda %s", version),
	})

	database.Connect()
	middleware.AuthInit()
	accesscontrol.Init()

	log.Println("server running on port", serverC.Port)

	server := router.NewServer()
	server.SetupRoutes(app)
	log.Fatal(app.Listen(fmt.Sprintf(":%d", serverC.Port)))

	// https://github.com/gofiber/recipes/tree/master/auth-docker-postgres-jwt

}
