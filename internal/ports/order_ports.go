package ports

import (
	"context"

	"github.com/gofiber/fiber/v2"
)

type OrderView struct {
	Id       string                 `json:"id"`
	Name     string                 `json:"name"`
	Products []*ViewProductResponse `json:"products,omitzero"`
	Deposit  uint                   `json:"deposit"`
}

type IOrderService interface {
	GetViewsForRole(ctx context.Context, role string) ([]*OrderView, error)
}

type IOrderHandlers interface {
	GetViews(c *fiber.Ctx) error
}
