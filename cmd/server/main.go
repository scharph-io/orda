package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"github.com/scharph/orda/internal/config"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/router"
)

var (
	version string
	date    string
)

func main() {

	if err := godotenv.Load(".env"); err != nil {
		fmt.Println("INFO: No .env file found")
	}

	app := fiber.New()
	database.ConnectDB()

	port := config.Config("PORT")
	if port == "" {
		port = "8080"
	}

	if tz := os.Getenv("TZ"); tz != "" {
		var err error
		log.Printf("setting time zone from ev to '%s'", tz)
		time.Local, err = time.LoadLocation(tz)
		if err != nil {
			log.Printf("error loading location '%s': %v\n", tz, err)
		}
	}

	log.Println("server running on port", port)
	router.SetupRoutes(app)
	log.Fatal(app.Listen(fmt.Sprintf(":%s", port)))

	// https://github.com/gofiber/recipes/tree/master/auth-docker-postgres-jwt

}
