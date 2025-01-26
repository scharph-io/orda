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

func NewViewItemRepo(db *gorm.DB) *ViewProductRepo {
	return &ViewProductRepo{db}
}

var _ ports.IViewProductRepository = (*ViewProductRepo)(nil)

func (r *ViewProductRepo) Create(ctx context.Context, viewProduct domain.ViewProduct) (*domain.ViewProduct, error) {
	if err := r.db.Create(&viewProduct).Error; err != nil {
		return nil, err
	}
	return &viewProduct, nil
}

func (r *ViewProductRepo) ReadByViewID(ctx context.Context, viewID string) ([]*domain.ViewProduct, error) {
	var viewProducts []*domain.ViewProduct
	if err := r.db.Model(&domain.ViewProduct{}).Where("view_id = ?", viewID).Find(&viewProducts).Error; err != nil {
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

func (r *ViewProductRepo) Delete(ctx context.Context, viewProduct domain.ViewProduct) error {
	return r.db.Delete(&viewProduct).Error
}
