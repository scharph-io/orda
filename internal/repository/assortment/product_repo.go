package assortment

import (
	"context"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"gorm.io/gorm"
)

type ProductRepo struct {
	db *gorm.DB
}

func NewProductRepo(db *gorm.DB) *ProductRepo {
	return &ProductRepo{db}
}

var _ ports.IProductRepository = (*ProductRepo)(nil)

func (r *ProductRepo) Create(ctx context.Context, product domain.Product) (*domain.Product, error) {
	if err := r.db.Create(&product).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *ProductRepo) ReadById(ctx context.Context, id string) (*domain.Product, error) {
	var product domain.Product
	if err := r.db.Where("id = ?", id).Find(&product).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *ProductRepo) CreateMany(ctx context.Context, products []domain.Product) error {
	return r.db.WithContext(ctx).CreateInBatches(products, len(products)).Error
}

func (r *ProductRepo) Read(ctx context.Context) (domain.Products, error) {
	var products domain.Products
	if err := r.db.WithContext(ctx).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (r *ProductRepo) Update(ctx context.Context, product domain.Product) (*domain.Product, error) {
	if err := r.db.WithContext(ctx).Model(&product).Updates(product).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *ProductRepo) Delete(ctx context.Context, product domain.Product) error {
	if err := r.db.WithContext(ctx).Delete(&product).Error; err != nil {
		return err
	}
	return nil
}

func (r *ProductRepo) ReadByGroupID(ctx context.Context, groupID string) (domain.Products, error) {
	var products domain.Products
	if err := r.db.WithContext(ctx).Where("product_group_id = ?", groupID).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (r *ProductRepo) ReadByID(ctx context.Context, id string) (*domain.Product, error) {
	var product domain.Product
	if err := r.db.WithContext(ctx).Model(&domain.Product{}).Where("id = ?", id).Find(&product).Error; err != nil {
		return nil, err
	}
	return &product, nil
}
