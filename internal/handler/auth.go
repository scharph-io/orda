package handler

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/middleware"
	"github.com/scharph/orda/internal/model"
	"github.com/scharph/orda/internal/util"
	"gorm.io/gorm"
)

func getUserByUsername(u string) (*model.User, error) {
	db := database.DB
	var user model.User
	if err := db.Where(&model.User{Username: u}).Find(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

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

	user, err := getUserByUsername(identity)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "Error on username", "errors": err.Error()})
	}

	if !util.CheckPasswordHash(pass, user.Password) {
		fmt.Println("password is wrong")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "Invalid credentials", "data": nil})
	}

	claims := jwt.MapClaims{
		"name":  user.Username,
		"admin": strings.Contains(user.Roles, "admin"),
		"roles": user.Roles,
		"exp":   time.Now().Add(time.Hour * 72).Unix(),
	}

	// Create token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	t, err := token.SignedString([]byte(middleware.Secret_key))
	if err != nil {
		fmt.Println("Error in creating token")
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.JSON(fiber.Map{"token": t})
}
