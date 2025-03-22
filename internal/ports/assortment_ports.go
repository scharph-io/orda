package ports

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/domain"
)

type ProductGroupRequest struct {
	Name    string `json:"name"`
	Desc    string `json:"desc"`
	Deposit uint   `json:"deposit"`
}

type ProductGroupResponse struct {
	ID       string           `json:"id"`
	Name     string           `json:"name"`
	Desc     string           `json:"desc"`
	Products []ProductRequest `json:"products,omitempty"`
	Deposit  uint             `json:"deposit"`
}

type ProductRequest struct {
	ID     string `json:"id,omitempty"`
	Name   string `json:"name"`
	Desc   string `json:"desc"`
	Price  int32  `json:"price"`
	Active bool   `json:"active"`
}

type ProductResponse struct {
	ID      string `json:"id,omitempty"`
	Name    string `json:"name"`
	Desc    string `json:"desc"`
	Price   int32  `json:"price"`
	Active  bool   `json:"active,omitzero"`
	GroupId string `json:"group_id,omitzero"`
}

type IProductGroupRepository interface {
	Create(ctx context.Context, productGroup domain.ProductGroup) (*domain.ProductGroup, error)
	Read(ctx context.Context) ([]*domain.ProductGroup, error)
	ReadByID(ctx context.Context, id string) (*domain.ProductGroup, error)
	Update(ctx context.Context, productGroup domain.ProductGroup) (*domain.ProductGroup, error)
	Delete(ctx context.Context, productGroup domain.ProductGroup) error
	AppendProducts(ctx context.Context, group *domain.ProductGroup, products ...*domain.Product) error
	RemoveProducts(ctx context.Context, group *domain.ProductGroup, products ...*domain.Product) error
	ReadProducts(ctx context.Context, group *domain.ProductGroup) (domain.Products, error)
}

type IProductRepository interface {
	Read(ctx context.Context) ([]*domain.Product, error)
	ReadById(ctx context.Context, id string) (*domain.Product, error)
	ReadByIds(ctx context.Context, ids ...string) (domain.Products, error)
	ReadByGroupId(ctx context.Context, id string) (domain.Products, error)
	Update(ctx context.Context, p domain.Product) (*domain.Product, error)
	Delete(ctx context.Context, p domain.Product) error

	// Views
	GetProductViews(ctx context.Context, p *domain.Product) ([]*domain.ViewProduct, error)
	AppendProductViews(ctx context.Context, p *domain.Product, vps ...*domain.ViewProduct) error
	ReplaceProductViews(ctx context.Context, p *domain.Product, vps ...*domain.ViewProduct) error
	RemoveProductViews(ctx context.Context, id string, viewIds ...string) error
}

type IAssortmentService interface {
	// Product Groups
	CreateProductGroup(ctx context.Context, productGroup ProductGroupRequest) (*ProductGroupResponse, error)
	ReadProductGroups(ctx context.Context) ([]ProductGroupResponse, error)
	ReadProductGroup(ctx context.Context, id string) (*ProductGroupResponse, error)
	UpdateProductGroup(ctx context.Context, id string, productGroup ProductGroupRequest) (*ProductGroupResponse, error)
	DeleteProductGroup(ctx context.Context, id string) error

	// Products
	ReadProducts(ctx context.Context) ([]*ProductResponse, error)
	ReadProductById(ctx context.Context, id string) (*ProductResponse, error)
	ReadProductsGroupById(ctx context.Context, id string) ([]*ProductResponse, error)
	AddProductsToGroup(ctx context.Context, id string, products ...ProductRequest) error
	RemoveProduct(ctx context.Context, id string) error
	UpdateProduct(ctx context.Context, product ProductRequest) (*ProductResponse, error)
	ToggleProduct(ctx context.Context, productID string) error

	// Views
	SetProductViews(ctx context.Context, id string, views ...*ViewProductRequest) error
	AddProductViews(ctx context.Context, id string, views ...*ViewProductRequest) error
	RemoveProductViews(ctx context.Context, id string, viewsIds ...string) error
}

type IAssortmentHandlers interface {
	// Product Group
	CreateGroup(c *fiber.Ctx) error
	ReadGroups(c *fiber.Ctx) error
	ReadGroup(c *fiber.Ctx) error
	UpdateGroup(c *fiber.Ctx) error
	DeleteGroup(c *fiber.Ctx) error

	// Products
	ReadProducts(c *fiber.Ctx) error
	AddProducts(c *fiber.Ctx) error
	RemoveProduct(c *fiber.Ctx) error
	ReadProductById(c *fiber.Ctx) error
	UpdateProduct(c *fiber.Ctx) error
	ToggleProduct(c *fiber.Ctx) error

	// Views
	SetOrAddViews(c *fiber.Ctx) error
	RemoveViews(c *fiber.Ctx) error
}
