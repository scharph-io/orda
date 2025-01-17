package handlers

import (
	"github.com/gofiber/fiber/v2"
)

// Login get user and password
func Login(c *fiber.Ctx) error {

	return c.JSON(fiber.Map{"token": ""})
}
