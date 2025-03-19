package account

import (
	"context"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"gorm.io/gorm"
)

type AccountHistoryRepository struct {
	db *gorm.DB
}

var _ ports.IAccountHistoryRepository = (*AccountHistoryRepository)(nil)

func NewAccountHistoryRepo(db *gorm.DB) *AccountHistoryRepository {
	return &AccountHistoryRepository{db}
}

func (r *AccountHistoryRepository) Create(ctx context.Context, logs ...domain.AccountHistory) ([]domain.AccountHistory, error) {
	if err := r.db.Create(&logs).Error; err != nil {
		return nil, err
	}
	return logs, nil
}

func (r *AccountHistoryRepository) ReadByAccountId(ctx context.Context, account_id string) ([]*domain.AccountHistory, error) {
	var logs []*domain.AccountHistory
	if err := r.db.
		Model(domain.AccountHistory{}).
		Preload("Account").
		Find(&logs, "account_id = ?", account_id).
		Error; err != nil {
		return nil, err
	}
	return logs, nil
}

func (r *AccountHistoryRepository) ReadByAccountGroupId(ctx context.Context, account_group_id string) ([]*domain.AccountHistory, error) {
	var logs []*domain.AccountHistory
	if err := r.db.
		WithContext(ctx).
		Model(domain.AccountHistory{}).
		Find(&logs, "account_group_id = ?", account_group_id).
		Preload("AccountGroup").
		Error; err != nil {
		return nil, err
	}

	return logs, nil
}
