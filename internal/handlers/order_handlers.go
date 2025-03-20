package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/scharph/orda/internal/ports"
)

type OrdaHandlers struct {
	ordaService  ports.IOrderService
	sessionStore session.Store
}

func NewOrderHandlers(ordaService ports.IOrderService, sessionStore session.Store) *OrdaHandlers {
	return &OrdaHandlers{
		ordaService:  ordaService,
		sessionStore: sessionStore,
	}
}

var _ ports.IOrderHandlers = (*OrdaHandlers)(nil)

func (h *OrdaHandlers) GetViews(c *fiber.Ctx) error {
	sess, err := h.sessionStore.Get(c)
	if err != nil {
		return c.SendStatus(fiber.StatusNoContent)
	}

	role := sess.Get("roleid")
	if role == nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	views, err := h.ordaService.GetViewsForRole(c.Context(), role.(string))
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(views)

}
