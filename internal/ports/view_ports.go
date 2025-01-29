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
	AddRoles(ctx context.Context, id, roleIds []string) error
	RemoveRoles(ctx context.Context, id, roleIds []string) error
}

type IViewProductRepository interface {
	ReadByViewID(ctx context.Context, viewID string) ([]*domain.ViewProduct, error)
	Update(ctx context.Context, viewProduct domain.ViewProduct) (*domain.ViewProduct, error)
	AppendProducts(ctx context.Context, viewId string, products ...*domain.ViewProduct) error
	RemoveProduct(ctx context.Context, viewId, productId string) error
}
