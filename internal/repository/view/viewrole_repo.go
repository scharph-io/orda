package view

import (
	"context"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"gorm.io/gorm"
)

type ViewRoleRepository struct {
	db *gorm.DB
}

var _ ports.IViewRoleRepository = (*ViewRoleRepository)(nil)

func NewViewRoleRepo(db *gorm.DB) *ViewRoleRepository {
	return &ViewRoleRepository{db: db}
}

func (r *ViewRoleRepository) Create(ctx context.Context, viewRole domain.ViewRole) (*domain.ViewRole, error) {
	err := r.db.Create(&viewRole).Error
	if err != nil {
		return nil, err
	}
	return &viewRole, nil
}

func (r *ViewRoleRepository) Read(ctx context.Context) ([]*domain.ViewRole, error) {
	var viewRoles []*domain.ViewRole
	err := r.db.Find(&viewRoles).Error
	if err != nil {
		return nil, err
	}
	return viewRoles, nil
}

func (r *ViewRoleRepository) ReadByViewID(ctx context.Context, view_id string) ([]*domain.ViewRole, error) {
	var viewRoles []*domain.ViewRole
	err := r.db.Where("view_id = ?", view_id).Preload("Role").Find(&viewRoles).Error
	if err != nil {
		return nil, err
	}
	return viewRoles, nil
}

func (r *ViewRoleRepository) ReadByRoleID(ctx context.Context, role_id string) ([]*domain.ViewRole, error) {
	var viewRoles []*domain.ViewRole
	err := r.db.Where("role_id = ?", role_id).Preload("View").Find(&viewRoles).Error
	if err != nil {
		return nil, err
	}
	return viewRoles, nil
}

func (r *ViewRoleRepository) ReadByViewIDAndRoleID(ctx context.Context, view_id string, role_id string) ([]*domain.ViewRole, error) {
	var viewRoles []*domain.ViewRole
	err := r.db.Where("view_id = ? AND role_id = ?", view_id, role_id).Find(&viewRoles).Error
	if err != nil {
		return nil, err
	}
	return viewRoles, nil
}

func (r *ViewRoleRepository) Delete(ctx context.Context, viewRole domain.ViewRole) error {
	err := r.db.Delete(&viewRole).Error
	if err != nil {
		return err
	}
	return nil
}
