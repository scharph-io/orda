package ports

import (
	"context"

	"github.com/gofiber/fiber/v2"
)

type OrderView struct {
	ViewResponse
}

type OrderProductsMap map[string][]ViewProductResponse
type OrderDepositMap map[string]ViewProductResponse

type OrderViewProducts struct {
	ProductGroupsMap OrderProductsMap `json:"products"`
	GroupDepositMap  OrderDepositMap  `json:"deposits"`
}

type IOrderService interface {
	GetOrderViewsForRole(ctx context.Context, roleid string) ([]*OrderView, error)
	GetOrderProducts(ctx context.Context, viewid string) (OrderProductsMap, error)
	GetOrderViewProducts(ctx context.Context, viewid string) (*OrderViewProducts, error)
}

type IOrderHandlers interface {
	GetOrderViews(c *fiber.Ctx) error
	GetOrderProducts(c *fiber.Ctx) error
	GetOrderViewProducts(c *fiber.Ctx) error
}
