package repository

import (
	"context"

	"github.com/scharph/orda/internal/model"
	"gorm.io/gorm"
)

type RoleRepo struct {
	db *gorm.DB
}

func NewRoleRepo(db *gorm.DB) *RoleRepo {
	return &RoleRepo{db}
}

func (r *RoleRepo) Create(ctx context.Context, role *model.Role) (*model.Role, error) {
	res := r.db.WithContext(ctx).Create(&role)
	if res.Error != nil {
		return nil, res.Error
	}
	return role, nil
}

func (r *RoleRepo) Update(ctx context.Context, role *model.Role) (*model.Role, error) {
	res := r.db.WithContext(ctx).Save(&role)
	if res.Error != nil {
		return nil, res.Error
	}
	return role, nil
}

func (r *RoleRepo) Delete(ctx context.Context, role *model.Role) error {
	res := r.db.WithContext(ctx).Delete(&role)
	if res.Error != nil {
		return res.Error
	}
	return nil
}

func (r *RoleRepo) FindByID(ctx context.Context, id uint) (*model.Role, error) {
	role := &model.Role{}
	res := r.db.WithContext(ctx).First(&role, id)
	if res.Error != nil {
		return nil, res.Error
	}
	return role, nil
}

func (r *RoleRepo) FindByName(ctx context.Context, name string) (*model.Role, error) {
	role := &model.Role{}
	res := r.db.WithContext(ctx).Where("name = ?", name).First(&role)
	if res.Error != nil {
		return nil, res.Error
	}
	return role, nil
}

func (r *RoleRepo) FindAll(ctx context.Context) ([]model.Role, error) {
	var roles []model.Role
	res := r.db.WithContext(ctx).Find(&roles)
	if res.Error != nil {
		return nil, res.Error
	}
	return roles, nil
}
