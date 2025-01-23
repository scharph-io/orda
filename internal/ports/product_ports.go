package ports

import "github.com/scharph/orda/internal/domain"

type IProductGroupRepository interface {
	Create(productGroup domain.ProductGroup) (*domain.ProductGroup, error)
	Read() ([]domain.ProductGroup, error)
	Update(productGroup domain.ProductGroup) (*domain.ProductGroup, error)
	Delete(productGroup domain.ProductGroup) error
}

type IProductRepository interface {
	Create(product domain.Product) (*domain.Product, error)
	Read() ([]domain.Product, error)
	Update(product domain.Product) (*domain.Product, error)
	Delete(product domain.Product) error
}
