package assortment

import (
	"context"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"gorm.io/gorm"
)

type ProductGroupRepo struct {
	db *gorm.DB
}

func NewProductGroupRepo(db *gorm.DB) *ProductGroupRepo {
	return &ProductGroupRepo{db}
}

var _ ports.IProductGroupRepository = (*ProductGroupRepo)(nil)

func (r *ProductGroupRepo) Create(ctx context.Context, productGroup domain.ProductGroup) (*domain.ProductGroup, error) {
	if err := r.db.WithContext(ctx).Create(&productGroup).Error; err != nil {
		return nil, err
	}
	return &productGroup, nil
}

func (r *ProductGroupRepo) Read(ctx context.Context) ([]*domain.ProductGroup, error) {
	var productGroups []*domain.ProductGroup
	if err := r.db.WithContext(ctx).Find(&productGroups).Error; err != nil {
		return nil, err
	}
	return productGroups, nil
}

func (r *ProductGroupRepo) ReadByID(ctx context.Context, id string) (*domain.ProductGroup, error) {
	var productGroup domain.ProductGroup
	if err := r.db.WithContext(ctx).Model(&domain.ProductGroup{}).Where("id = ?", id).Find(&productGroup).Error; err != nil {
		return nil, err
	}
	return &productGroup, nil
}

func (r *ProductGroupRepo) Update(ctx context.Context, productGroup domain.ProductGroup) (*domain.ProductGroup, error) {
	if err := r.db.WithContext(ctx).Model(&productGroup).Updates(productGroup).Error; err != nil {
		return nil, err
	}
	return &productGroup, nil
}

func (r *ProductGroupRepo) Delete(ctx context.Context, productGroup domain.ProductGroup) error {
	if err := r.db.WithContext(ctx).Delete(&productGroup).Error; err != nil {
		return err
	}
	return nil
}

func (r *ProductGroupRepo) AppendProducts(ctx context.Context, group *domain.ProductGroup, products ...*domain.Product) error {
	return r.db.WithContext(ctx).Model(&group).Association("Products").Append(products)

}

func (r *ProductGroupRepo) RemoveProducts(ctx context.Context, group *domain.ProductGroup, products ...*domain.Product) error {
	return r.db.WithContext(ctx).Model(&group).Association("Products").Delete(products)
}

func (r *ProductGroupRepo) ReadProducts(ctx context.Context, group *domain.ProductGroup) (domain.Products, error) {
	var products domain.Products
	if err := r.db.WithContext(ctx).Model(&group).Association("Products").Find(&products, "Products.deposit IS NULL OR Products.deposit = 0"); err != nil {
		return nil, err
	}
	return products, nil
}
