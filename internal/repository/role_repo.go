package repository

import (
	"context"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"gorm.io/gorm"
)

type RoleRepo struct {
	db *gorm.DB
}

var _ ports.IRoleRepository = (*RoleRepo)(nil)

func NewRoleRepo(db *gorm.DB) *RoleRepo {
	return &RoleRepo{db}
}

func (r *RoleRepo) Create(ctx context.Context, role *domain.Role) (*domain.Role, error) {
	res := r.db.WithContext(ctx).Create(&role)
	if res.Error != nil {
		return nil, res.Error
	}
	return role, nil
}

func (r *RoleRepo) Update(ctx context.Context, id string, role *domain.Role) (*domain.Role, error) {
	res := r.db.WithContext(ctx).Model(&domain.Role{}).Where("id = ?", id).Updates(&role)
	if res.Error != nil {
		return nil, res.Error
	}
	return role, nil
}

func (r *RoleRepo) Delete(ctx context.Context, id string) (bool, error) {
	res := r.db.WithContext(ctx).Where("id = ?", id).Delete(&domain.Role{})
	if res.Error != nil {
		return false, res.Error
	}
	return !(res.RowsAffected == 0), nil
}

func (r *RoleRepo) ReadById(ctx context.Context, id string) (*domain.Role, error) {
	role := &domain.Role{}
	res := r.db.WithContext(ctx).First(&role, id)
	if res.Error != nil {
		return nil, res.Error
	}
	return role, nil
}

func (r *RoleRepo) ReadByName(ctx context.Context, name string) (*domain.Role, error) {
	role := &domain.Role{}
	res := r.db.WithContext(ctx).Where("name = ?", name).First(&role)
	if res.Error != nil {
		return nil, res.Error
	}
	return role, nil
}

func (r *RoleRepo) Read(ctx context.Context) ([]domain.Role, error) {
	var roles []domain.Role
	res := r.db.WithContext(ctx).Find(&roles)
	if res.Error != nil {
		return nil, res.Error
	}
	return roles, nil
}
