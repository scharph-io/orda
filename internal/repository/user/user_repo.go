package user

import (
	"context"

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
	_, err := r.ReadByUsername(ctx, user.Username)
	if err == nil {
		return nil, repository.ErrResourceAlreadyExists
	}
	res := r.db.WithContext(ctx).Create(&user)
	if res.Error != nil {
		return nil, res.Error
	}
	return user, nil
}

func (r *UserRepo) Read(ctx context.Context) (users []domain.User, err error) {
	res := r.db.WithContext(ctx).Preload("Role").Find(&users)
	if res.Error != nil {
		return nil, res.Error
	}
	return users, nil
}

func (r *UserRepo) ReadByUsername(ctx context.Context, username string) (user domain.User, err error) {
	res := r.db.WithContext(ctx).Where("username = ?", username).Preload("Role").First(&user)
	if res.Error != nil {
		return domain.User{}, res.Error
	}
	return user, nil
}

func (r *UserRepo) ReadById(ctx context.Context, id string) (user domain.User, err error) {
	res := r.db.WithContext(ctx).Where("id = ?", id).Preload("Role").First(&user)
	if res.Error != nil {
		return domain.User{}, res.Error
	}
	return user, nil
}

func (r *UserRepo) Update(ctx context.Context, id string, user *domain.User) (*domain.User, error) {
	user.ID = id
	res := r.db.WithContext(ctx).Model(&user).Updates(&user)
	if res.Error != nil {
		return nil, res.Error
	}
	return user, nil
}

func (r *UserRepo) Delete(ctx context.Context, id string) (bool, error) {
	res := r.db.WithContext(ctx).Where("id = ?", id).Unscoped().Delete(&domain.User{})
	if res.Error != nil {
		return false, res.Error
	}
	return !(res.RowsAffected == 0), nil
}
