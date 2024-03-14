package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"github.com/scharph/orda/internal/config"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/router"
)

var (
	version string
	date    string
)

// jwtCustomClaims are custom claims extending default ones.
// See https://github.com/golang-jwt/jwt for more examples
type jwtCustomClaims struct {
	Name  string `json:"name"`
	Admin bool   `json:"admin"`
	jwt.RegisteredClaims
}

type Item struct {
	UUID  string `json:"uuid"`
	Name  string `json:"name"`
	Desc  string `json:"desc"`
	Price int32  `json:"price"`
	Qty   int    `json:"quantity"`
}

type CheckoutData struct {
	Items         []Item `json:"items"`
	Total         int32  `json:"total"`
	AccountType   uint8  `json:"accountType"`
	PaymentOption uint8  `json:"paymentOption"`
}

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
	fmt.Println("Server running on port", port)
	router.SetupRoutes(app)
	log.Fatal(app.Listen(fmt.Sprintf("%s:%s", config.Config("HOST"), config.Config("PORT"))))

	// https://github.com/gofiber/recipes/tree/master/auth-docker-postgres-jwt

}
