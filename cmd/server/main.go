package main

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/scharph/orda/web/client"
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
	Items      []Item `json:"items"`
	Total      int32  `json:"total"`
	AccountType uint8  `json:"accountType"`
	PaymentOption uint8   `json:"paymentOption"`
}

func login(c echo.Context) error {
	username := c.FormValue("username")
	password := c.FormValue("password")

	fmt.Println("username: ", username)

	isAdmin := false

	// Throws unauthorized error
	if username == "admin" && password == "secret" {
		isAdmin = true
	} else if username == "user" && password == "secret" {
		isAdmin = false
	} else {
		fmt.Println("username or password is wrong")
		return echo.ErrUnauthorized
	}

	// Set custom claims
	claims := &jwtCustomClaims{
		username,
		isAdmin,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 10)),
		},
	}

	// Create token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte("secret"))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"token": t,
	})
}

func accessible(c echo.Context) error {
	return c.String(http.StatusOK, "Accessible")
}

func restricted(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*jwtCustomClaims)
	name := claims.Name
	return c.JSON(http.StatusOK, "Welcome "+name+"!"+" You are admin: "+strconv.FormatBool(claims.Admin))
}

func handlePost(c echo.Context) error {

	u := new(CheckoutData)
	if err := c.Bind(u); err != nil {
		return err
	}

	fmt.Println("CheckoutData: ", u)

	cntItems := 0

	for _, v := range u.Items {
		cntItems += v.Qty
	}
	fmt.Printf("Successfully checked out %d items\nTotal %d\n", cntItems, u.Total)
	fmt.Printf("AccountType: %d\n", u.AccountType)
	fmt.Printf("PaymentOption: %d\n", u.PaymentOption)

	if cntItems == 10{
		return c.JSON(http.StatusForbidden, echo.Map{"success": false})

	}

	return c.JSON(http.StatusAccepted, echo.Map{"success": true})
	// return c.JSON(http.StatusOK, "Welcome "+name+"!"+" You are admin: "+strconv.FormatBool(claims.Admin))
}

func handleTranslations(c echo.Context) error {
	lang := c.Param("id")
	translations := map[string]map[string]string{
		"en": {
			"hello": "Hello",
		},
		"de": {
			"hello": "Hallo",
		},
	}
	return c.JSON(http.StatusOK, translations[lang])
}

func main() {

	fmt.Println("buildDate: ", date)
	fmt.Println("version: ", version)

	e := echo.New()

	e.Use(middleware.CORS())

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Login route
	e.POST("/api/auth", login)

	// Unauthenticated route
	e.GET("/access", accessible)

	// Restricted group
	r := e.Group("/restricted")

	// Configure middleware with the custom claims type
	config := echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(jwtCustomClaims)
		},
		SigningKey: []byte("secret"),
	}
	r.Use(echojwt.WithConfig(config))
	r.GET("", restricted)
	r.POST("", handlePost)

	r.GET("/translations/:id", handleTranslations)

	var contentHandler = echo.WrapHandler(http.FileServer(http.FS(&client.Assets)))
	var contentRewrite = middleware.Rewrite(map[string]string{"/*": "/dist/client/browser/$1"})
	e.GET("/*", contentHandler, contentRewrite)

	e.Logger.Fatal(e.Start(":8080"))
}
