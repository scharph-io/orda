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

type UserRepo struct {
	db *gorm.DB
}

var _ ports.IUserRepository = (*UserRepo)(nil)

func NewUserRepo(db *gorm.DB) *UserRepo {
	return &UserRepo{db}
}

func (r *UserRepo) Create(ctx context.Context, user *domain.User) (*domain.User, error) {
	if user == nil {
		return nil, errors.New("user cannot be nil")
	}

	// Validate required fields
	if err := r.validateUser(user); err != nil {
		return nil, fmt.Errorf("validation failed: %w", err)
	}

	// Use transaction to ensure atomicity
	var createdUser *domain.User
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Check if user already exists within the transaction
		var existingUser domain.User
		result := tx.Where("username = ?", user.Username).First(&existingUser)

		if result.Error == nil {
			return repository.ErrResourceAlreadyExists
		}

		if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return fmt.Errorf("failed to check existing user: %w", result.Error)
		}

		// Verify role exists
		var role domain.Role
		if err := tx.First(&role, "id = ?", user.RoleId).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return fmt.Errorf("role with id %s not found", user.RoleId)
			}
			return fmt.Errorf("failed to verify role: %w", err)
		}

		// Create the user
		if err := tx.Create(user).Error; err != nil {
			return fmt.Errorf("failed to create user: %w", err)
		}

		createdUser = user
		return nil
	})

	if err != nil {
		return nil, err
	}

	return createdUser, nil
}

func (r *UserRepo) Read(ctx context.Context) (users []domain.User, err error) {
	res := r.db.WithContext(ctx).Preload("Role").Find(&users)
	if res.Error != nil {
		return nil, fmt.Errorf("failed to retrieve users: %w", res.Error)
	}
	return users, nil
}

func (r *UserRepo) ReadByUsername(ctx context.Context, username string) (user domain.User, err error) {
	if username == "" {
		return domain.User{}, errors.New("username cannot be empty")
	}

	res := r.db.WithContext(ctx).Where("username = ?", username).Preload("Role").First(&user)
	if errors.Is(res.Error, gorm.ErrRecordNotFound) {
		return domain.User{}, fmt.Errorf("user with username '%s' not found", username)
	}
	if res.Error != nil {
		return domain.User{}, fmt.Errorf("failed to retrieve user by username: %w", res.Error)
	}
	return user, nil
}

func (r *UserRepo) ReadById(ctx context.Context, id string) (user domain.User, err error) {
	if id == "" {
		return domain.User{}, errors.New("id cannot be empty")
	}

	res := r.db.WithContext(ctx).Where("id = ?", id).Preload("Role").First(&user)
	if errors.Is(res.Error, gorm.ErrRecordNotFound) {
		return domain.User{}, fmt.Errorf("user with id '%s' not found", id)
	}
	if res.Error != nil {
		return domain.User{}, fmt.Errorf("failed to retrieve user by id: %w", res.Error)
	}
	return user, nil
}

func (r *UserRepo) Update(ctx context.Context, id string, user *domain.User) (*domain.User, error) {
	if id == "" {
		return nil, errors.New("id cannot be empty")
	}

	if user == nil {
		return nil, errors.New("user cannot be nil")
	}

	// Validate user data for updates (allows partial updates)
	if err := r.validateUserForUpdate(user); err != nil {
		return nil, fmt.Errorf("validation failed: %w", err)
	}

	var updatedUser *domain.User
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Check if user exists
		var existingUser domain.User
		if err := tx.First(&existingUser, "id = ?", id).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return fmt.Errorf("user with id '%s' not found", id)
			}
			return fmt.Errorf("failed to check existing user: %w", err)
		}

		// Check for username conflicts (if username is being changed)
		if user.Username != "" && user.Username != existingUser.Username {
			var conflictUser domain.User
			result := tx.Where("username = ? AND id != ?", user.Username, id).First(&conflictUser)
			if result.Error == nil {
				return repository.ErrResourceAlreadyExists
			}
			if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
				return fmt.Errorf("failed to check username conflict: %w", result.Error)
			}
		}

		// Verify role exists if role is being updated
		if user.RoleId != "" {
			var role domain.Role
			if err := tx.First(&role, "id = ?", user.RoleId).Error; err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return fmt.Errorf("role with id %s not found", user.RoleId)
				}
				return fmt.Errorf("failed to verify role: %w", err)
			}
		}

		// Set the ID to ensure we're updating the correct record
		user.ID = id

		// Update the user
		result := tx.Model(&existingUser).Updates(user)
		if result.Error != nil {
			return fmt.Errorf("failed to update user: %w", result.Error)
		}

		if result.RowsAffected == 0 {
			return fmt.Errorf("no rows affected during update")
		}

		// Reload the updated user with role
		if err := tx.Preload("Role").First(&existingUser, "id = ?", id).Error; err != nil {
			return fmt.Errorf("failed to reload updated user: %w", err)
		}

		updatedUser = &existingUser
		return nil
	})

	if err != nil {
		return nil, err
	}

	return updatedUser, nil
}

func (r *UserRepo) Delete(ctx context.Context, id string) (bool, error) {
	if id == "" {
		return false, errors.New("id cannot be empty")
	}

	var deleted bool
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Check if user exists
		var user domain.User
		if err := tx.First(&user, "id = ?", id).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return fmt.Errorf("user with id '%s' not found", id)
			}
			return fmt.Errorf("failed to check existing user: %w", err)
		}

		// Soft delete the user
		result := tx.Delete(&user)
		if result.Error != nil {
			return fmt.Errorf("failed to delete user: %w", result.Error)
		}

		deleted = result.RowsAffected > 0
		return nil
	})

	if err != nil {
		return false, err
	}

	return deleted, nil
}

// HardDelete permanently deletes a user (for admin operations)
func (r *UserRepo) HardDelete(ctx context.Context, id string) (bool, error) {
	if id == "" {
		return false, errors.New("id cannot be empty")
	}

	result := r.db.WithContext(ctx).Unscoped().Delete(&domain.User{}, "id = ?", id)
	if result.Error != nil {
		return false, fmt.Errorf("failed to hard delete user: %w", result.Error)
	}

	return result.RowsAffected > 0, nil
}

// validateUser validates user data for creation
func (r *UserRepo) validateUser(user *domain.User) error {
	if user.Username == "" {
		return errors.New("username is required")
	}

	if len(user.Username) < 3 || len(user.Username) > 50 {
		return errors.New("username must be between 3 and 50 characters")
	}

	if user.Password == "" {
		return errors.New("password is required")
	}

	if len(user.Password) < 6 {
		return errors.New("password must be at least 6 characters")
	}

	if user.RoleId == "" {
		return errors.New("role ID is required")
	}

	return nil
}

// validateUserForUpdate validates user data for updates (allows partial updates)
func (r *UserRepo) validateUserForUpdate(user *domain.User) error {
	if user.Username != "" {
		if len(user.Username) < 3 || len(user.Username) > 50 {
			return errors.New("username must be between 3 and 50 characters")
		}
	}

	if user.Password != "" {
		if len(user.Password) < 6 {
			return errors.New("password must be at least 6 characters")
		}
	}

	return nil
}
