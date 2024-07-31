package repository

import (
	"context"

	"github.com/scharph/orda/internal/model"
	"gorm.io/gorm"
)

type GroupRepo struct {
	db *gorm.DB
}

func NewGroupRepo(db *gorm.DB) *GroupRepo {
	return &GroupRepo{db}
}

func (g *GroupRepo) Create(ctx context.Context, group *model.Group) (*model.Group, error) {
	res := g.db.WithContext(ctx).Create(&group)
	if res.Error != nil {
		return nil, res.Error
	}
	return group, nil
}

func (g *GroupRepo) Read(ctx context.Context) (groups []model.Group, err error) {
	res := g.db.WithContext(ctx).Find(&groups)
	if res.Error != nil {
		return nil, res.Error
	}
	return groups, nil
}

func (g *GroupRepo) Update(ctx context.Context, id string, group *model.Group) (*model.Group, error) {
	res := g.db.WithContext(ctx).Model(&model.Group{}).Where("id = ?", id).Updates(&group)
	if res.Error != nil {
		return nil, res.Error
	}
	return group, nil
}

func (g *GroupRepo) Delete(ctx context.Context, id string) (bool, error) {
	res := g.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Group{})
	if res.Error != nil {
		return false, res.Error
	}
	return !(res.RowsAffected == 0), nil
}
