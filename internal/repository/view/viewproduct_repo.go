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
	if err := r.db.WithContext(ctx).Model(&domain.ViewProduct{}).Where("view_id = ?", view_id).Preload("Product").Find(&viewProducts).Error; err != nil {
		return nil, err
	}
	return viewProducts, nil
}

func (r *ViewProductRepo) Update(ctx context.Context, viewProduct domain.ViewProduct) (*domain.ViewProduct, error) {
	if err := r.db.WithContext(ctx).Model(&viewProduct).Updates(viewProduct).Error; err != nil {
		return nil, err
	}
	return &viewProduct, nil
}
