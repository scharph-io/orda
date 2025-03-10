package view

import (
	"context"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"gorm.io/gorm"
)

type ViewProductRepo struct {
	db *gorm.DB
}

func NewViewProductRepo(db *gorm.DB) *ViewProductRepo {
	return &ViewProductRepo{db}
}

var _ ports.IViewProductRepository = (*ViewProductRepo)(nil)

func (r *ViewProductRepo) ReadByViewID(ctx context.Context, view_id string) ([]*domain.ViewProduct, error) {
	var viewProducts []*domain.ViewProduct
	if err := r.db.Model(&domain.ViewProduct{}).Where("view_id = ?", view_id).Preload("Product").Find(&viewProducts).Error; err != nil {
		return nil, err
	}
	return viewProducts, nil
}

func (r *ViewProductRepo) Update(ctx context.Context, viewProduct domain.ViewProduct) (*domain.ViewProduct, error) {
	if err := r.db.Model(&viewProduct).Updates(viewProduct).Error; err != nil {
		return nil, err
	}
	return &viewProduct, nil
}

func (r *ViewProductRepo) AppendProducts(ctx context.Context, view_id string, products ...*domain.ViewProduct) error {
	return nil
	// for i := range products {
	// 	// uuid := uuid.MustParse(viewId)
	// 	// if products[i].ViewID == len(uuid) {
	// 	// 	products[i].ViewID = uuid.MustParse(viewId)
	// 	// }
	// }
	// return r.db.Model(domain.ViewProduct{}).Create(products).Error
}

func (r *ViewProductRepo) RemoveProduct(ctx context.Context, view_id, product_id string) error {
	return r.db.Model(domain.ViewProduct{}).Delete(&domain.ViewProduct{ViewID: view_id, ProductID: product_id}).Error
}
