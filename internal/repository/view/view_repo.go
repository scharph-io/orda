package view

import (
	"context"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"gorm.io/gorm"
)

type ViewRepo struct {
	db *gorm.DB
}

func NewViewRepository(db *gorm.DB) *ViewRepo {
	return &ViewRepo{db}
}

var _ ports.IViewRepository = (*ViewRepo)(nil)

func (r *ViewRepo) Create(ctx context.Context, view domain.View) (*domain.View, error) {
	if err := r.db.Create(&view).Error; err != nil {
		return nil, err
	}
	return &view, nil
}

func (r *ViewRepo) Read(ctx context.Context) ([]domain.View, error) {
	var views []domain.View
	if err := r.db.Find(&views).Error; err != nil {
		return nil, err
	}
	return views, nil
}

func (r *ViewRepo) ReadByID(ctx context.Context, id string) (*domain.View, error) {
	var view domain.View
	if err := r.db.Model(&domain.View{}).Where("id = ?", id).Find(&view).Error; err != nil {
		return nil, err
	}
	return &view, nil
}

func (r *ViewRepo) Update(ctx context.Context, view domain.View) (*domain.View, error) {
	if err := r.db.Model(&view).Updates(view).Error; err != nil {
		return nil, err
	}
	return &view, nil
}

func (r *ViewRepo) Delete(ctx context.Context, view domain.View) error {
	return r.db.Delete(&view).Error
}

func (r *ViewRepo) AppendProduct(ctx context.Context, id string, product domain.Product) error {
	return r.db.Model(&domain.View{}).Association("Products").Append(&product)
}

func (r *ViewRepo) RemoveProduct(ctx context.Context, id, productId string) error {
	return r.db.Model(&domain.View{}).Association("Products").Delete(&domain.Product{Base: domain.Base{ID: productId}})
}
