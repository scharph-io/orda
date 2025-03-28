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

func (h *OrdaHandlers) GetOrderViews(c *fiber.Ctx) error {
	sess, err := h.sessionStore.Get(c)
	if err != nil {
		return c.SendStatus(fiber.StatusNoContent)
	}

	role := sess.Get("roleid")
	if role == nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	views, err := h.ordaService.GetOrderViewsForRole(c.Context(), role.(string))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(views)

}

func (h *OrdaHandlers) GetOrderProducts(c *fiber.Ctx) error {
	products, err := h.ordaService.GetOrderProducts(c.Context(), c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(products)

}

func (h *OrdaHandlers) GetOrderViewProducts(c *fiber.Ctx) error {
	products, err := h.ordaService.GetOrderViewProducts(c.Context(), c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(products)
}
