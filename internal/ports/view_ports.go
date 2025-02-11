package ports

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/domain"
)

type ViewRequest struct {
	Name string `json:"name" validate:"required"`
}

type ViewProductRequest struct {
	ProductID string `json:"product_id" validate:"required"`
	Color     string `json:"color,omitempty" validate:"iscolor"`
	Position  int8   `json:"position,omitempty" validate:"gte=0,lte=130"`
}

type ViewProductResponse struct {
	ProductResponse
	Position int8   `json:"position"`
	Color    string `json:"color,omitempty"`
}

type ViewResponse struct {
	ID         string                 `json:"id"`
	Name       string                 `json:"name"`
	Assortment []*ViewProductResponse `json:"assortment,omitempty"`
}

type IViewRepository interface {
	Create(ctx context.Context, view domain.View) (*domain.View, error)
	Read(ctx context.Context) ([]*domain.View, error)
	ReadByID(ctx context.Context, id string) (*domain.View, error)
	Update(ctx context.Context, view domain.View) (*domain.View, error)
	Delete(ctx context.Context, view domain.View) error
	AddRoles(ctx context.Context, id string, roleIds ...string) error
	RemoveRoles(ctx context.Context, id string, roleIds []string) error
}

type IViewProductRepository interface {
	ReadByViewID(ctx context.Context, viewID string) ([]*domain.ViewProduct, error)
	Update(ctx context.Context, viewProduct domain.ViewProduct) (*domain.ViewProduct, error)
	AppendProducts(ctx context.Context, viewId string, products ...*domain.ViewProduct) error
	RemoveProduct(ctx context.Context, viewId, productId string) error
}

type IViewService interface {
	CreateView(ctx context.Context, view ViewRequest) (*ViewResponse, error)
	ReadViews(ctx context.Context) ([]*ViewResponse, error)
	ReadView(ctx context.Context, id string) (*ViewResponse, error)
	UpdateView(ctx context.Context, id string, view ViewRequest) (*ViewResponse, error)
	DeleteView(ctx context.Context, id string) error
	AddRoles(ctx context.Context, id string, roleIds ...string) error
	RemoveRole(ctx context.Context, id string, roleId string) error
	AddProducts(ctx context.Context, viewId string, products ...*ViewProductRequest) error
	RemoveProduct(ctx context.Context, viewId, viewProductId string) error
}

type IViewHandlers interface {
	Create(c *fiber.Ctx) error
	Read(c *fiber.Ctx) error
	ReadByID(c *fiber.Ctx) error
	Update(c *fiber.Ctx) error
	Delete(c *fiber.Ctx) error
	AddRoles(c *fiber.Ctx) error
	RemoveRole(c *fiber.Ctx) error
	AddProducts(c *fiber.Ctx) error
	RemoveProduct(c *fiber.Ctx) error
}
