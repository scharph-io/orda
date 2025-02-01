package account

import (
	"fmt"

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

func (r *AccountHistoryRepository) Create(entry domain.AccountHistory) error {
	fmt.Printf("%s\n", entry.ToString())
	if err := r.db.Model(domain.AccountHistory{}).Create(&entry).Error; err != nil {
		return err
	}
	return nil
}

func (r *AccountHistoryRepository) ReadByAccountId(account_id string) ([]domain.AccountHistory, error) {
	var histories []domain.AccountHistory
	if err := r.db.
		Model(domain.AccountHistory{}).
		Preload("Account").
		Find(&histories, "account_id = ?", account_id).
		Error; err != nil {
		return nil, err
	}
	return histories, nil
}

func (r *AccountHistoryRepository) ReadByAccountGroupId(account_group_id string) ([]domain.AccountHistory, error) {
	var histories []domain.AccountHistory
	if err := r.db.
		Model(domain.AccountHistory{}).
		Find(&histories, "account_group_id = ?", account_group_id).
		Preload("AccountGroup").
		Error; err != nil {
		return nil, err
	}

	return histories, nil
}
