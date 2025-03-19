package ports

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/domain"
)

type ViewRequest struct {
	Name    string   `json:"name" validate:"required"`
	Roles   []string `json:"roles" validate:"required"`
	Deposit uint     `json:"deposit"`
}

type ViewResponse struct {
	Id            string                 `json:"id"`
	Name          string                 `json:"name"`
	Roles         []*RoleResponse        `json:"roles,omitzero"`
	Products      []*ViewProductResponse `json:"products,omitzero"`
	RolesCount    int                    `json:"roles_count"`
	ProductsCount int                    `json:"products_count"`
	Deposit       uint                   `json:"deposit"`
}

// add assortment to views
type ViewProductRequest struct {
	ProductID string `json:"product_id" validate:"required"`
	Color     string `json:"color,omitempty" validate:"iscolor"`
	Position  int8   `json:"position,omitempty" validate:"gte=0,lte=130"`
}

// add views to assortment
type ProductViewRequest struct {
	ViewID   string `json:"view_id" validate:"required"`
	Color    string `json:"color,omitempty" validate:"iscolor"`
	Position int8   `json:"position,omitempty" validate:"gte=0,lte=130"`
}

type ViewProductResponse struct {
	ProductResponse
	Position int8   `json:"position"`
	Color    string `json:"color,omitempty"`
}

type IViewRepository interface {
	Create(ctx context.Context, view domain.View) (*domain.View, error)
	Read(ctx context.Context) ([]*domain.View, error)
	ReadByID(ctx context.Context, id string) (*domain.View, error)
	ReadByRoleId(ctx context.Context, roleId string) ([]*domain.View, error)
	Update(ctx context.Context, view domain.View) (*domain.View, error)
	Delete(ctx context.Context, view domain.View) error

	// Roles
	ReplaceRoles(ctx context.Context, v *domain.View, role_ids ...string) error
	GetViewRoles(ctx context.Context, v *domain.View) ([]*domain.Role, error)

	// Products
	AppendViewProducts(ctx context.Context, v *domain.View, vps ...*domain.ViewProduct) error
	ReplaceViewProducts(ctx context.Context, v *domain.View, ps ...*domain.ViewProduct) error
	RemoveViewProducts(ctx context.Context, v *domain.View, productIds ...string) error
}

type IViewProductRepository interface {
	ReadByViewID(ctx context.Context, viewId string) ([]*domain.ViewProduct, error)
	Update(ctx context.Context, viewProduct domain.ViewProduct) (*domain.ViewProduct, error)
}

type IViewService interface {
	Create(ctx context.Context, view ViewRequest) (*ViewResponse, error)
	ReadMany(ctx context.Context) ([]*ViewResponse, error)
	ReadOne(ctx context.Context, id string) (*ViewResponse, error)
	Update(ctx context.Context, id string, view ViewRequest) (*ViewResponse, error)
	Delete(ctx context.Context, id string) error

	// Roles
	SetRoles(ctx context.Context, id string, roleIds ...string) error
	GetRoles(ctx context.Context, id string) ([]*RoleResponse, error)
	RemoveRoles(ctx context.Context, id string, roleIds ...string) error

	// Products
	GetProducts(ctx context.Context, id string) ([]*ViewProductResponse, error)
	SetProducts(ctx context.Context, id string, products ...*ViewProductRequest) error
	AddProducts(ctx context.Context, id string, products ...*ViewProductRequest) error
	RemoveProducts(ctx context.Context, id string, productsIds ...string) error
}

type IViewHandlers interface {
	Create(c *fiber.Ctx) error
	ReadMany(c *fiber.Ctx) error
	ReadOne(c *fiber.Ctx) error
	Update(c *fiber.Ctx) error
	Delete(c *fiber.Ctx) error
	SetRoles(c *fiber.Ctx) error
	GetRoles(c *fiber.Ctx) error
	RemoveRoles(c *fiber.Ctx) error
	GetProducts(c *fiber.Ctx) error
	SetOrAddProducts(c *fiber.Ctx) error
	RemoveProducts(c *fiber.Ctx) error
}
