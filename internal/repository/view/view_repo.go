package view

import (
	"context"
	"fmt"

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
	if err := r.db.Find(&views).Error; err != nil {
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

func (r *ViewRepo) SetRoles(ctx context.Context, id string, roleIds ...string) error {
	view, err := r.ReadByID(ctx, id)
	if err != nil {
		return err
	}
	var roles []domain.Role
	for _, roleId := range roleIds {
		var role domain.Role
		if err := r.db.Model(&domain.Role{}).Where("id = ?", roleId).First(&role).Error; err != nil {
			return err
		}
		roles = append(roles, role)
	}

	for _, role := range roles {
		fmt.Println(role.Name, role.ID)
	}

	return r.db.Model(view).Association("Roles").Replace(&roles)
}
