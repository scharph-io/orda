package repository

import (
	"context"

	"github.com/scharph/orda/internal/model"
	"gorm.io/gorm"
)

type ViewRepo struct {
	db *gorm.DB
}

func NewViewRepo(db *gorm.DB) *ViewRepo {
	return &ViewRepo{db}
}

func (r *ViewRepo) Read(ctx context.Context) (views []model.View, err error) {
	res := r.db.WithContext(ctx).Find(&views)
	if res.Error != nil {
		return nil, res.Error
	}
	return views, nil
}

func (r *ViewRepo) ReadByViewID(ctx context.Context, viewID string) (view model.View, err error) {
	res := r.db.WithContext(ctx).Where("view_id = ?", viewID).First(&view)
	if res.Error != nil {
		return model.View{}, res.Error
	}
	return view, nil
}

func (r *ViewRepo) Update(ctx context.Context, id string, view *model.View) (*model.View, error) {
	res := r.db.WithContext(ctx).Model(&model.View{}).Where("id = ?", id).Updates(&view)
	if res.Error != nil {
		return nil, res.Error
	}
	return view, nil
}

func (r *ViewRepo) Delete(ctx context.Context, id string) (bool, error) {
	res := r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.View{})
	if res.Error != nil {
		return false, res.Error
	}
	return !(res.RowsAffected == 0), nil
}

func (r *ViewRepo) AddProduct(ctx context.Context, viewID string, product *model.Product) (bool, error) {

	if err := r.db.WithContext(ctx).Model(&model.View{}).Where("view_id = ?", viewID).Association("Products").Append(product); err != nil {
		return false, err
	}
	return true, nil
}
