package handlers

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/scharph/orda/internal/accesscontrol"
	"github.com/scharph/orda/internal/config"
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

	sess.Set(config.Session_userid, user.Id)
	sess.Set(config.Session_username, user.Username)
	sess.Set(config.Session_userrole, user.Role)

	if err := sess.Save(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to save session",
		})
	}

	out, _ := json.Marshal(map[string]interface{}{
		"user": user.Username,
		"role": user.Role,
	})
	c.Cookie(cookieConfig(string(out)))

	return c.JSON(fiber.Map{
		"message": "Logged in successfully",
	})
}

func (h *AuthHandlers) Session(c *fiber.Ctx) error {
	sess, err := h.sessionStore.Get(c)
	if err != nil {
		return c.SendStatus(fiber.StatusNoContent)
	}

	userID := sess.Get(config.Session_userid)
	if userID == nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	out, _ := json.Marshal(map[string]interface{}{
		"user": sess.Get(config.Session_username),
		"role": sess.Get(config.Session_userrole),
	})
	c.Cookie(cookieConfig(string(out)))

	return c.SendStatus(fiber.StatusOK)
}

func (h *AuthHandlers) Logout(c *fiber.Ctx) error {
	session, err := h.sessionStore.Get(c)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	// Revoke users authentication
	if err := session.Destroy(); err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	c.ClearCookie()
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *AuthHandlers) RequireAuth(c *fiber.Ctx) error {
	sess, err := h.sessionStore.Get(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	userID := sess.Get(config.Session_userid)
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	// Add user to context
	c.Locals(config.Session_userid, userID)
	return c.Next()
}

func (h *AuthHandlers) RequireRole(role string) fiber.Handler {
	return func(c *fiber.Ctx) error {

		userID := c.Locals(config.Session_userid).(string)
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

		fmt.Printf("User %s (%s) has required role %s\n", user.Username, user.Role, role)
		return c.Next()
	}
}

func (h *AuthHandlers) Policy(c *fiber.Ctx) error {
	return c.JSON(h.psyncInstance.GetPolicies())
}

func cookieConfig(value string) *fiber.Cookie {
	return &fiber.Cookie{
		Name:     config.Session_cookie,
		Secure:   config.GetConfig().Server.SSL,
		Value:    value,
		SameSite: config.Cookie_sameSite,
		Expires:  time.Now().Add(time.Minute * 1),
	}
}
