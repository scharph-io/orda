package ports

import (
	"context"

	"github.com/scharph/orda/internal/domain"
)

type IViewRepository interface {
	Create(ctx context.Context, view domain.View) (*domain.View, error)
	Read(ctx context.Context) ([]*domain.View, error)
	ReadByID(ctx context.Context, id string) (*domain.View, error)
	Update(ctx context.Context, view domain.View) (*domain.View, error)
	Delete(ctx context.Context, view domain.View) error
	AppendProduct(ctx context.Context, id string, productId domain.ViewProduct) error
	RemoveProduct(ctx context.Context, id, productId string) error
}

type IViewProductRepository interface {
	ReadByViewID(ctx context.Context, viewID string) ([]*domain.ViewProduct, error)
	Update(ctx context.Context, viewProduct domain.ViewProduct) (*domain.ViewProduct, error)
	Delete(ctx context.Context, viewProduct domain.ViewProduct) error
}
