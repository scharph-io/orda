package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"github.com/scharph/orda/internal/casbin"
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
	e, err := casbin.Enforcer()

	if err != nil {
		log.Fatal(err)
	}

	// ***

	e.LoadPolicy()

	e.AddRoleForUser("alice", "admin")
	e.AddRoleForUser("bob", "user")

	e.AddPolicy("user", "assortment", "read")
	e.AddPolicy("admin", "assortment", "write")

	fmt.Println(e.GetAllRoles())

	// e.AddPermission

	// e.AddPermissionForUser("alice", "assortment", "read")

	x, err := e.Enforce("bob", "assortment", "write")

	if err != nil {
		log.Fatal(err)
	}

	log.Println("Enforce:", x)

	// ***

	port := config.Config("PORT")
	if port == "" {
		port = "8080"
	}

	if tz := os.Getenv("TZ"); tz != "" {
		var err error
		log.Printf("setting time zone from ENV to '%s'", tz)
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
