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

func (r *ViewRepo) Read(ctx context.Context) ([]*domain.View, error) {
	var views []*domain.View
	if err := r.db.Preload("Roles").Find(&views).Error; err != nil {
		return nil, err
	}
	return views, nil
}

func (r *ViewRepo) ReadByID(ctx context.Context, id string) (*domain.View, error) {
	var view domain.View
	if err := r.db.Model(&domain.View{}).
		Where("id = ?", id).
		Preload("Products").
		Preload("Roles").
		Find(&view).Error; err != nil {
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

func (r *ViewRepo) ReplaceRoles(ctx context.Context, view *domain.View, role_ids ...string) error {
	var roles []*domain.Role
	for _, roleId := range role_ids {
		var role domain.Role
		if err := r.db.Model(&role).Where("id = ?", roleId).Find(&role).Error; err != nil {
			return err
		}
		roles = append(roles, &role)
	}
	return r.db.Model(&view).Association("Roles").Replace(roles)
}

func (r *ViewRepo) ReplaceProducts(ctx context.Context, view *domain.View, products ...*domain.ViewProduct) error {
	return r.db.Model(&view).Association("Products").Replace(&products)
}

func (r *ViewRepo) AppendProducts(ctx context.Context, view *domain.View, products ...*domain.ViewProduct) error {
	return r.db.Model(view).Association("Products").Append(&products)
}

func (r *ViewRepo) RemoveProduct(ctx context.Context, view *domain.View, vp *domain.ViewProduct) error {
	return r.db.Model(&view).Association("Products").Delete(vp)
}
