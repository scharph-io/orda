package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/scharph/orda/internal/accesscontrol"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/util"
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

// Login
func (h *AuthHandlers) Login(c *fiber.Ctx) error {
	var req ports.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request",
		})
	}

	user, err := h.userService.GetUserByUsername(c.Context(), req.Username)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	if !util.VerifyPassword(req.Password, user.Password) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	sess, err := h.sessionStore.Get(c)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Session error",
		})
	}

	// Regenerate session ID to prevent session fixation
	if err := sess.Regenerate(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to regenerate session",
		})
	}

	sess.Set("userid", user.Id)
	sess.Set("username", user.Username)
	sess.Set("roleid", user.RoleId)
	sess.Set("role", user.Role)

	sess.Save()

	return c.JSON(fiber.Map{
		"message": "Logged in successfully",
		"data":    user,
	})
}

func (h *AuthHandlers) Session(c *fiber.Ctx) error {
	sess, err := h.sessionStore.Get(c)
	if err != nil {
		return c.SendStatus(fiber.StatusNoContent)
	}

	userID := sess.Get("userid")
	if userID == nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"username": sess.Get("username"),
		"role":     sess.Get("role"),
		"roleid":   sess.Get("roleid"),
	})
}

func (h *AuthHandlers) Logout(c *fiber.Ctx) error {
	session, err := h.sessionStore.Get(c)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	if err := session.Destroy(); err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	c.ClearCookie("session_id")
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *AuthHandlers) RequireAuth(c *fiber.Ctx) error {
	sess, err := h.sessionStore.Get(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	userID := sess.Get("userid")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}
	c.Locals("userid", userID)
	return c.Next()
}

func (h *AuthHandlers) RequireRole(role string) fiber.Handler {
	return func(c *fiber.Ctx) error {

		userID := c.Locals("userid").(string)
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

		// fmt.Printf("User %s (%s) has required role %s\n", user.Username, user.Role, role)
		return c.Next()
	}
}

func (h *AuthHandlers) Policy(c *fiber.Ctx) error {
	return c.JSON(h.psyncInstance.GetPolicies())
}
