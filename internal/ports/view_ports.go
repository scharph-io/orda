package ports

import "github.com/scharph/orda/internal/domain"

type IViewRepository interface {
	Create(view domain.View) (*domain.View, error)
	Read() ([]domain.View, error)
	ReadByID(id string) (*domain.View, error)
	Update(view domain.View) (*domain.View, error)
	Delete(view domain.View) error
}

type IViewProductRepository interface {
	Create(viewProduct domain.ViewProduct) (*domain.ViewProduct, error)
	ReadByID(viewID string, productID string) (*domain.ViewProduct, error)
	Update(viewProduct domain.ViewProduct) (*domain.ViewProduct, error)
	Delete(viewProduct domain.ViewProduct) error
}
