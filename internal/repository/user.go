package repository

import (
	"context"

	"github.com/scharph/orda/internal/model"
	"gorm.io/gorm"
)

type UserRepo struct {
	db *gorm.DB
}

func NewUserRepo(db *gorm.DB) *UserRepo {
	return &UserRepo{db}
}

func (r *UserRepo) Create(ctx context.Context, user *model.User) (*model.User, error) {
	_, err := r.ReadByUsername(ctx, user.Username)
	if err == nil {
		return nil, errResourceAlreadyExists
	}

	res := r.db.WithContext(ctx).Create(&user)
	if res.Error != nil {
		return nil, res.Error
	}
	return user, nil
}

func (r *UserRepo) Read(ctx context.Context) (users []model.User, err error) {
	res := r.db.WithContext(ctx).Find(&users)
	if res.Error != nil {
		return nil, res.Error
	}
	return users, nil
}

func (r *UserRepo) ReadByUsername(ctx context.Context, username string) (user model.User, err error) {
	res := r.db.WithContext(ctx).Where("username = ?", username).First(&user)
	if res.Error != nil {
		return model.User{}, res.Error
	}
	return user, nil
}

func (r *UserRepo) Update(ctx context.Context, id string, user *model.User) (*model.User, error) {
	res := r.db.WithContext(ctx).Model(&model.User{}).Where("id = ?", id).Updates(&user)
	if res.Error != nil {
		return nil, res.Error
	}
	return user, nil
}

func (r *UserRepo) Delete(ctx context.Context, id string) (bool, error) {
	res := r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.User{})
	if res.Error != nil {
		return false, res.Error
	}
	return !(res.RowsAffected == 0), nil
}
