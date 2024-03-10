package handler

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/scharph/orda/internal/middleware"
)

// Login get user and password
func Login(c *fiber.Ctx) error {
	type LoginInput struct {
		Identity string `json:"identity"`
		Password string `json:"password"`
	}
	var input LoginInput
	if err := c.BodyParser(&input); err != nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}
	identity := input.Identity
	pass := input.Password
	isAdmin := false

	fmt.Println("identity: ", identity)
	fmt.Println("pass: ", pass)

	if identity == "admin" && pass == "secret" {
		isAdmin = true
	} else if identity == "user" && pass == "secret" {
		isAdmin = false
	} else {
		fmt.Println("username or password is wrong")
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	claims := jwt.MapClaims{
		"name":  identity,
		"admin": isAdmin,
		"exp":   time.Now().Add(time.Hour * 72).Unix(),
	}

	// Create token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	t, err := token.SignedString([]byte(middleware.Secret_key))
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.JSON(fiber.Map{"token": t})
}
