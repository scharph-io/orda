package ports

import (
	"context"

	"github.com/scharph/orda/internal/domain"
)

type IProductGroupRepository interface {
	Create(ctx context.Context, productGroup domain.ProductGroup) (*domain.ProductGroup, error)
	Read(ctx context.Context) ([]domain.ProductGroup, error)
	Update(ctx context.Context, productGroup domain.ProductGroup) (*domain.ProductGroup, error)
	Delete(ctx context.Context, productGroup domain.ProductGroup) error
}

type IProductRepository interface {
	Create(ctx context.Context, product domain.Product) (*domain.Product, error)
	CreateMany(ctx context.Context, products []*domain.Product) error
	ReadByGroupID(ctx context.Context, groupID string) (domain.Products, error)
	Update(ctx context.Context, product domain.Product) (*domain.Product, error)
	Delete(ctx context.Context, product domain.Product) error
}
