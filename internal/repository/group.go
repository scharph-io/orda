package repository

// import (
// 	"context"
// 	"fmt"

// 	model "github.com/scharph/orda/internal/domain"
// 	"gorm.io/gorm"
// )

// type AccountGroupRepo struct {
// 	db *gorm.DB
// }

// func NewGroupRepo(db *gorm.DB) *AccountGroupRepo {
// 	return &AccountGroupRepo{db}
// }

// func (g *AccountGroupRepo) Create(ctx context.Context, group *model.AccountGroupRepo) (*model.Group, error) {
// 	res := g.db.WithContext(ctx).Create(&group)
// 	if res.Error != nil {
// 		return nil, res.Error
// 	}
// 	return group, nil
// }

// func (g *GroupRepo) Read(ctx context.Context) (groups []model.Group, err error) {
// 	res := g.db.WithContext(ctx).Find(&groups)
// 	if res.Error != nil {
// 		return nil, res.Error
// 	}
// 	return groups, nil
// }

// func (g *GroupRepo) ReadById(ctx context.Context, id string) (group model.Group, err error) {
// 	res := g.db.WithContext(ctx).Where("id = ?", id).Preload("Products").First(&group)
// 	if res.Error != nil {
// 		return model.Group{}, res.Error
// 	}
// 	return group, nil
// }

// func (g *GroupRepo) Update(ctx context.Context, id string, new *model.Group) (*model.Group, error) {
// 	var group model.Group
// 	if res := g.db.WithContext(ctx).Model(&model.Group{}).Where("id = ?", id).Find(&group); res.Error != nil {
// 		return nil, res.Error
// 	}

// 	group.Deposit = new.Deposit
// 	group.Desc = new.Desc
// 	group.Name = new.Name

// 	res := g.db.WithContext(ctx).Save(&group)
// 	if res.Error != nil {
// 		return nil, res.Error
// 	}

// 	if res.RowsAffected == 0 {
// 		return nil, fmt.Errorf("group not found")
// 	}
// 	return &group, nil
// }

// func (g *GroupRepo) Delete(ctx context.Context, id string) (bool, error) {
// 	res := g.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Group{})
// 	if res.Error != nil {
// 		return false, res.Error
// 	}
// 	return !(res.RowsAffected == 0), nil
// }
