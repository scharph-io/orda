package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
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
		panic("Error loading .env file")
	}

	app := fiber.New()
	app.Use(cors.New())

	database.ConnectDB()

	router.SetupRoutes(app)
	log.Fatal(app.Listen(":8080"))

	// https://github.com/gofiber/recipes/tree/master/auth-docker-postgres-jwt

}
