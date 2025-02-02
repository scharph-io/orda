package ports

import fiber "github.com/gofiber/fiber/v2"

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type IAuthHandlers interface {
	Login(c *fiber.Ctx) error
	Logout(c *fiber.Ctx) error
	RequireAuth(c *fiber.Ctx) error
	RequireRole(role string) fiber.Handler
	Policy(c *fiber.Ctx) error
	Check(c *fiber.Ctx) error
}
