package repository

import (
	"context"

	"github.com/scharph/orda/internal/model"
	"gorm.io/gorm"
)

type ViewProductRepo struct {
	db *gorm.DB
}

func NewViewProductRepo(db *gorm.DB) *ViewProductRepo {
	return &ViewProductRepo{db}
}

func (r *ViewProductRepo) Read(ctx context.Context) (viewProducts []model.ViewProduct, err error) {
	res := r.db.WithContext(ctx).Model(&model.ViewProduct{}).Preload("Product").Preload("View").Find(&viewProducts)
	if res.Error != nil {
		return nil, res.Error
	}
	return viewProducts, nil
}

func (r *ViewProductRepo) ReadByViewId(ctx context.Context, id string) (products []model.ViewProduct, err error) {
	res := r.db.WithContext(ctx).Model(&model.ViewProduct{}).Where("view_id = ?", id).Preload("Product").Find(&products)
	if res.Error != nil {
		return nil, res.Error
	}
	return products, nil
}

func (r *ViewProductRepo) ReadByProductId(ctx context.Context, id string) (views []model.ViewProduct, err error) {
	res := r.db.WithContext(ctx).Model(&model.ViewProduct{}).Where("product_id = ?", id).Preload("View").Find(&views)
	if res.Error != nil {
		return nil, res.Error
	}
	return views, nil
}