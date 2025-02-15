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
	Deposit  uint             `json:"deposit"`
	Products []ProductRequest `json:"products,omitempty"`
}

type ProductRequest struct {
	ID     string `json:"id,omitempty"`
	Name   string `json:"name"`
	Desc   string `json:"desc"`
	Price  int32  `json:"price"`
	Active bool   `json:"active"`
}

type ProductResponse struct {
	ID     string `json:"id,omitempty"`
	Name   string `json:"name"`
	Desc   string `json:"desc"`
	Price  int32  `json:"price"`
	Active bool   `json:"active"`
}

type IProductGroupRepository interface {
	Create(ctx context.Context, productGroup domain.ProductGroup) (*domain.ProductGroup, error)
	Read(ctx context.Context) ([]*domain.ProductGroup, error)
	ReadByID(ctx context.Context, id string) (*domain.ProductGroup, error)
	Update(ctx context.Context, productGroup domain.ProductGroup) (*domain.ProductGroup, error)
	Delete(ctx context.Context, productGroup domain.ProductGroup) error
}

type IProductRepository interface {
	Create(ctx context.Context, product domain.Product) (*domain.Product, error)
	CreateMany(ctx context.Context, products []domain.Product) error
	ReadById(ctx context.Context, id string) (*domain.Product, error)
	ReadByIds(ctx context.Context, ids []string) (domain.Products, error)
	ReadByGroupID(ctx context.Context, groupID string) (domain.Products, error)
	Update(ctx context.Context, product domain.Product) (*domain.Product, error)
	Delete(ctx context.Context, product domain.Product) error
}

type IAssortmentService interface {
	CreateProductGroup(ctx context.Context, productGroup ProductGroupRequest) (*ProductGroupResponse, error)
	ReadProductGroups(ctx context.Context) ([]ProductGroupResponse, error)
	ReadProductGroup(ctx context.Context, id string) (*ProductGroupResponse, error)
	UpdateProductGroup(ctx context.Context, id string, productGroup ProductGroupRequest) (*ProductGroupResponse, error)
	DeleteProductGroup(ctx context.Context, id string) error
	ReadProductsGroupById(ctx context.Context, id string) ([]ProductResponse, error)
	AddProduct(ctx context.Context, groupID string, product ProductRequest) error
	AddProducts(ctx context.Context, groupID string, products []ProductRequest) error
	RemoveProduct(ctx context.Context, groupID, productID string) error
	UpdateProduct(ctx context.Context, product ProductRequest) (*ProductResponse, error)
	ToggleProduct(ctx context.Context, productID string) error
}

type IAssortmentHandlers interface {
	CreateGroup(c *fiber.Ctx) error
	ReadGroups(c *fiber.Ctx) error
	ReadGroup(c *fiber.Ctx) error
	UpdateGroup(c *fiber.Ctx) error
	DeleteGroup(c *fiber.Ctx) error
	ReadProducts(c *fiber.Ctx) error
	AddProducts(c *fiber.Ctx) error
	RemoveProduct(c *fiber.Ctx) error
	UpdateProduct(c *fiber.Ctx) error
	ToggleProduct(c *fiber.Ctx) error
}
