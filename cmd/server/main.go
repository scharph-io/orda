package main

import (
	"crypto/tls"
	"flag"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/golang-jwt/jwt/v5"
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

	isSsl := flag.Bool("ssl", false, "enable ssl")
	cert := flag.String("crt", "ssl.cert", "certificate file")
	key := flag.String("key", "ssl.key", "key file")
	port := flag.String("port", "3000", "port")

	flag.Parse()

	*port = fmt.Sprintf(":%s", *port)

	app := fiber.New(fiber.Config{
		CaseSensitive: true,
		StrictRouting: true,
		ServerHeader:  "Fiber",
		AppName:       "Orda Backend",
	})

	app.Use(cors.New())

	app.Use(logger.New())

	database.ConnectDB()
	router.SetupRouter(app)

	if *isSsl {
		cer, err := tls.LoadX509KeyPair(*cert, *key)
		if err != nil {
			log.Fatal(err)
		}

		config := &tls.Config{Certificates: []tls.Certificate{cer}}

		// Create custom listener
		ln, err := tls.Listen("tcp", *port, config)
		if err != nil {
			panic(err)
		}
		log.Fatal(app.Listener(ln))
		return
	}
	log.Fatal(app.Listen(*port))

	// https://github.com/gofiber/recipes/tree/master/auth-docker-postgres-jwt

}
