package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/scharph/orda/internal/accesscontrol"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/util"
)

const (
	session_user_id = "session_user_id"
)

type AuthHandlers struct {
	userService   ports.IUserService
	sessionStore  session.Store
	psyncInstance *accesscontrol.PolicySync
}

func NewAuthHandlers(userService ports.IUserService, sessionStore session.Store, psyncInstance *accesscontrol.PolicySync) *AuthHandlers {
	return &AuthHandlers{userService, sessionStore, psyncInstance}
}

var _ ports.IAuthHandlers = (*AuthHandlers)(nil)

// Login get user and password
func (h *AuthHandlers) Login(c *fiber.Ctx) error {
	var req ports.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request",
		})
	}

	user, err := h.userService.GetUserByUsername(c.Context(), req.Username)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	if !util.VerifyPassword(req.Password, user.Password) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	sess, err := h.sessionStore.Get(c)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Session error",
		})
	}

	sess.Set("session_user_name", user.Username)
	sess.Set("session_user_role", user.Role)
	if err := sess.Save(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to save session",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Logged in successfully",
		"data":    user,
	})
}

func (h *AuthHandlers) Check(c *fiber.Ctx) error {
	sess, err := h.sessionStore.Get(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Session not found",
		})
	}

	return c.JSON(fiber.Map{
		"message":  "Session active",
		"username": sess.Get("session_user_name"),
		"role":     sess.Get("session_user_role"),
	})
}

func (h *AuthHandlers) Logout(c *fiber.Ctx) error {
	sess, err := h.sessionStore.Get(c)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Session error",
		})
	}

	if err := sess.Destroy(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to destroy session",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Logged out successfully",
	})
}

func (h *AuthHandlers) RequireAuth(c *fiber.Ctx) error {
	sess, err := h.sessionStore.Get(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	userID := sess.Get("session_user_id")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	// Add user to context
	c.Locals(session_user_id, userID)
	return c.Next()
}

func (h *AuthHandlers) RequireRole(role string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals(session_user_id).(string)
		user, err := h.userService.GetUserById(c.Context(), userID)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "User not found",
			})
		}
		// Check if user has required role
		if user.Role != role {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Insufficient permissions",
			})
		}
		return c.Next()
	}
}

func (h *AuthHandlers) Policy(c *fiber.Ctx) error {
	return c.JSON(h.psyncInstance.GetPolicies())
}
