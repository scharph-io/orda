package main

import (
	"fmt"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/accesscontrol"
	"github.com/scharph/orda/internal/build"
	"github.com/scharph/orda/internal/config"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/middleware"
	"github.com/scharph/orda/internal/router"
)

func main() {
	serverC := config.GetConfig().Server

	app := fiber.New(fiber.Config{
		AppName:               fmt.Sprintf("orda %s - %s", build.GetVersion(), build.GetTime()),
		DisableStartupMessage: true,
		ReadTimeout:           5 * time.Second,
		WriteTimeout:          5 * time.Second,
		IdleTimeout:           30 * time.Second,
	})

	loc, _ := time.LoadLocation(serverC.TZ)
	time.Local = loc

	database.Connect()
	middleware.AuthInit()
	accesscontrol.Init()

	log.Println("server running on port", serverC.Port)

	server := router.NewServer()
	server.SetupRoutes(app)
	log.Fatal(app.Listen(fmt.Sprintf(":%d", serverC.Port)))

	// https://github.com/gofiber/recipes/tree/master/auth-docker-postgres-jwt

}
