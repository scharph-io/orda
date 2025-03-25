package ports

import (
	"context"

	"github.com/gofiber/fiber/v2"
)

type OrderView struct {
	ViewResponse
}

type OrderProductsMap map[string][]ViewProductResponse

type IOrderService interface {
	GetOrderViewsForRole(ctx context.Context, roleid string) ([]*OrderView, error)
	GetOrderProducts(ctx context.Context, viewid string) (OrderProductsMap, error)
}

type IOrderHandlers interface {
	GetOrderViews(c *fiber.Ctx) error
	GetOrderProducts(c *fiber.Ctx) error
}
