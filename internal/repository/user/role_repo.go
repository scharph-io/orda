package user

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
	if err := r.db.WithContext(ctx).Create(&role).Error; err != nil {
		return nil, err
	}
	return role, nil
}

func (r *RoleRepo) Update(ctx context.Context, id string, role *domain.Role) (*domain.Role, error) {
	if err := r.db.WithContext(ctx).Model(&domain.Role{}).Where("id = ?", id).Updates(&role).Error; err != nil {
		return nil, err
	}
	return role, nil
}

func (r *RoleRepo) Delete(ctx context.Context, id string) (bool, error) {
	if err := r.db.WithContext(ctx).Model(&domain.ViewRole{}).Delete(&domain.ViewRole{}, "role_id = ?", id).Error; err != nil {
		return false, err
	}
	if err := r.db.WithContext(ctx).Unscoped().Delete(&domain.Role{}, "id = ?", id).Error; err != nil {
		return false, err
	}
	return true, nil
}

func (r *RoleRepo) ReadById(ctx context.Context, id string) (*domain.Role, error) {
	var role domain.Role
	if err := r.db.Model(&domain.Role{}).Preload("Users").Where("id = ?", id).Find(&role).Error; err != nil {
		return nil, err
	}
	return &role, nil
}

func (r *RoleRepo) ReadByName(ctx context.Context, name string) (*domain.Role, error) {
	role := &domain.Role{}
	res := r.db.WithContext(ctx).Where("name = ?", name).First(&role)
	if res.Error != nil {
		return nil, res.Error
	}
	return role, nil
}

func (r *RoleRepo) Read(ctx context.Context) ([]*domain.Role, error) {
	var roles []*domain.Role
	res := r.db.WithContext(ctx).Find(&roles)
	if res.Error != nil {
		return nil, res.Error
	}
	return roles, nil
}
