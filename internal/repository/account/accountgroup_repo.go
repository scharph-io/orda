package account

import (
	"context"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"gorm.io/gorm"
)

type AccountGroupRepository struct {
	db *gorm.DB
}

var _ ports.IAccountGroupRepository = (*AccountGroupRepository)(nil)

func NewAccountGroupRepo(db *gorm.DB) *AccountGroupRepository {
	return &AccountGroupRepository{db}
}

func (r *AccountGroupRepository) Create(ctx context.Context, req domain.AccountGroup) (*domain.AccountGroup, error) {
	if err := r.db.Create(&req).Error; err != nil {
		return nil, err
	}
	return &req, nil
}

func (r *AccountGroupRepository) Read(ctx context.Context) ([]domain.AccountGroup, error) {
	var accountGroups []domain.AccountGroup
	if err := r.db.Find(&accountGroups).Error; err != nil {
		return nil, err
	}
	return accountGroups, nil
}

func (r *AccountGroupRepository) ReadById(ctx context.Context, id string) (*domain.AccountGroup, error) {
	var accountGroup domain.AccountGroup
	if err := r.db.First(&accountGroup, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &accountGroup, nil
}

func (r *AccountGroupRepository) ReadByName(ctx context.Context, name string) (*domain.AccountGroup, error) {
	var accountGroup domain.AccountGroup
	if err := r.db.Model(&domain.AccountGroup{}).Where("name = ?", name).Find(&accountGroup).Error; err != nil {
		return nil, err
	}
	return &accountGroup, nil
}

func (r *AccountGroupRepository) Update(ctx context.Context, accountGroup domain.AccountGroup) (*domain.AccountGroup, error) {
	if err := r.db.Model(&accountGroup).Updates(accountGroup).Error; err != nil {
		return nil, err
	}
	return &accountGroup, nil
}

func (r *AccountGroupRepository) Delete(ctx context.Context, id string) (bool, error) {
	if err := r.db.Delete(&domain.AccountGroup{}, "id = ?", id).Error; err != nil {
		return false, err
	}
	return true, nil
}

func (r *AccountGroupRepository) GetAccountsByGroupId(ctx context.Context, id string) ([]domain.Account, error) {
	var accountGroup domain.AccountGroup
	if err := r.db.Model(&domain.AccountGroup{}).Where("id = ?", id).Preload("Accounts").Find(&accountGroup).Error; err != nil {
		return nil, err
	}
	return accountGroup.Accounts, nil
}
