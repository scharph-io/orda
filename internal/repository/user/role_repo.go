package user

import (
	"context"
	"errors"
	"fmt"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/repository"
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
	if role == nil {
		return nil, errors.New("role cannot be nil")
	}

	// Validate required fields
	if err := r.validateRole(role); err != nil {
		return nil, fmt.Errorf("validation failed: %w", err)
	}

	// Use transaction to ensure atomicity
	var createdRole *domain.Role
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Check if role with same name already exists
		var existingRole domain.Role
		result := tx.Where("name = ?", role.Name).First(&existingRole)

		if result.Error == nil {
			return repository.ErrResourceAlreadyExists
		}

		if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return fmt.Errorf("failed to check existing role: %w", result.Error)
		}

		// Create the role
		if err := tx.Create(role).Error; err != nil {
			return fmt.Errorf("failed to create role: %w", err)
		}

		createdRole = role
		return nil
	})

	if err != nil {
		return nil, err
	}

	return createdRole, nil
}

func (r *RoleRepo) Update(ctx context.Context, id string, role *domain.Role) (*domain.Role, error) {
	if id == "" {
		return nil, errors.New("id cannot be empty")
	}

	if role == nil {
		return nil, errors.New("role cannot be nil")
	}

	// Validate role data
	if err := r.validateRoleForUpdate(role); err != nil {
		return nil, fmt.Errorf("validation failed: %w", err)
	}

	var updatedRole *domain.Role
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Check if role exists
		var existingRole domain.Role
		if err := tx.First(&existingRole, "id = ?", id).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return fmt.Errorf("role with id '%s' not found", id)
			}
			return fmt.Errorf("failed to check existing role: %w", err)
		}

		// Check for name conflicts (if name is being changed)
		if role.Name != "" && role.Name != existingRole.Name {
			var conflictRole domain.Role
			result := tx.Where("name = ? AND id != ?", role.Name, id).First(&conflictRole)
			if result.Error == nil {
				return repository.ErrResourceAlreadyExists
			}
			if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
				return fmt.Errorf("failed to check name conflict: %w", result.Error)
			}
		}

		// Set the ID to ensure we're updating the correct record
		role.ID = id

		// Update the role
		result := tx.Model(&existingRole).Updates(role)
		if result.Error != nil {
			return fmt.Errorf("failed to update role: %w", result.Error)
		}

		if result.RowsAffected == 0 {
			return fmt.Errorf("no rows affected during update")
		}

		// Reload the updated role with users
		if err := tx.Preload("Users").First(&existingRole, "id = ?", id).Error; err != nil {
			return fmt.Errorf("failed to reload updated role: %w", err)
		}

		updatedRole = &existingRole
		return nil
	})

	if err != nil {
		return nil, err
	}

	return updatedRole, nil
}

func (r *RoleRepo) Delete(ctx context.Context, id string) (bool, error) {
	if id == "" {
		return false, errors.New("id cannot be empty")
	}

	var deleted bool
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Check if role exists
		var role domain.Role
		if err := tx.Preload("Users").First(&role, "id = ?", id).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return fmt.Errorf("role with id '%s' not found", id)
			}
			return fmt.Errorf("failed to check existing role: %w", err)
		}

		// Check if role has users assigned
		if len(role.Users) > 0 {
			return fmt.Errorf("cannot delete role '%s' as it has %d users assigned", role.Name, len(role.Users))
		}

		// Delete associated ViewRole records first
		if err := tx.Where("role_id = ?", id).Delete(&domain.ViewRole{}).Error; err != nil {
			return fmt.Errorf("failed to delete associated view roles: %w", err)
		}

		// Delete the role (soft delete)
		result := tx.Delete(&role)
		if result.Error != nil {
			return fmt.Errorf("failed to delete role: %w", result.Error)
		}

		deleted = result.RowsAffected > 0
		return nil
	})

	if err != nil {
		return false, err
	}

	return deleted, nil
}

func (r *RoleRepo) ReadById(ctx context.Context, id string) (*domain.Role, error) {
	if id == "" {
		return nil, errors.New("id cannot be empty")
	}

	var role domain.Role
	result := r.db.WithContext(ctx).Preload("Users").Where("id = ?", id).First(&role)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("role with id '%s' not found", id)
	}

	if result.Error != nil {
		return nil, fmt.Errorf("failed to retrieve role by id: %w", result.Error)
	}

	return &role, nil
}

func (r *RoleRepo) ReadByName(ctx context.Context, name string) (*domain.Role, error) {
	if name == "" {
		return nil, errors.New("name cannot be empty")
	}

	var role domain.Role
	result := r.db.WithContext(ctx).Preload("Users").Where("name = ?", name).First(&role)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("role with name '%s' not found", name)
	}

	if result.Error != nil {
		return nil, fmt.Errorf("failed to retrieve role by name: %w", result.Error)
	}

	return &role, nil
}

func (r *RoleRepo) Read(ctx context.Context) ([]*domain.Role, error) {
	var roles []*domain.Role
	result := r.db.WithContext(ctx).Preload("Users").Find(&roles)

	if result.Error != nil {
		return nil, fmt.Errorf("failed to retrieve roles: %w", result.Error)
	}

	return roles, nil
}

// HardDelete permanently deletes a role and reassigns users to a default role
func (r *RoleRepo) HardDelete(ctx context.Context, id string, defaultRoleId string) (bool, error) {
	if id == "" {
		return false, errors.New("id cannot be empty")
	}

	if defaultRoleId == "" {
		return false, errors.New("default role ID cannot be empty")
	}

	if id == defaultRoleId {
		return false, errors.New("cannot delete role and assign users to the same role")
	}

	var deleted bool
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Check if role exists
		var role domain.Role
		if err := tx.Preload("Users").First(&role, "id = ?", id).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return fmt.Errorf("role with id '%s' not found", id)
			}
			return fmt.Errorf("failed to check existing role: %w", err)
		}

		// Verify default role exists
		var defaultRole domain.Role
		if err := tx.First(&defaultRole, "id = ?", defaultRoleId).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return fmt.Errorf("default role with id '%s' not found", defaultRoleId)
			}
			return fmt.Errorf("failed to verify default role: %w", err)
		}

		// Reassign users to default role
		if len(role.Users) > 0 {
			if err := tx.Model(&domain.User{}).Where("role_id = ?", id).Update("role_id", defaultRoleId).Error; err != nil {
				return fmt.Errorf("failed to reassign users to default role: %w", err)
			}
		}

		// Delete associated ViewRole records
		if err := tx.Where("role_id = ?", id).Delete(&domain.ViewRole{}).Error; err != nil {
			return fmt.Errorf("failed to delete associated view roles: %w", err)
		}

		// Hard delete the role
		result := tx.Unscoped().Delete(&role)
		if result.Error != nil {
			return fmt.Errorf("failed to delete role: %w", result.Error)
		}

		deleted = result.RowsAffected > 0
		return nil
	})

	if err != nil {
		return false, err
	}

	return deleted, nil
}

// validateRole validates role data for creation
func (r *RoleRepo) validateRole(role *domain.Role) error {
	if role.Name == "" {
		return errors.New("role name is required")
	}

	if len(role.Name) < 2 {
		return errors.New("role name must be at least 2 characters")
	}

	if len(role.Name) > 50 {
		return errors.New("role name must not exceed 50 characters")
	}

	return nil
}

// validateRoleForUpdate validates role data for updates (allows partial updates)
func (r *RoleRepo) validateRoleForUpdate(role *domain.Role) error {
	if role.Name != "" {
		if len(role.Name) < 2 {
			return errors.New("role name must be at least 2 characters")
		}

		if len(role.Name) > 50 {
			return errors.New("role name must not exceed 50 characters")
		}
	}

	return nil
}
