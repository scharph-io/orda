package account

import (
	"context"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"gorm.io/gorm"
)

type AccountRepo struct {
	db *gorm.DB
}

func NewAccountRepo(db *gorm.DB) *AccountRepo {
	return &AccountRepo{db}
}

var _ ports.IAccountRepository = (*AccountRepo)(nil)

func (r *AccountRepo) Create(ctx context.Context, acc ...domain.Account) ([]domain.Account, error) {
	if err := r.db.Create(&acc).Error; err != nil {
		return nil, err
	}
	return acc, nil
}

func (r *AccountRepo) Read(ctx context.Context) ([]domain.Account, error) {
	var accounts []domain.Account
	if err := r.db.Find(&accounts).Error; err != nil {
		return nil, err
	}
	return accounts, nil
}

func (r *AccountRepo) ReadById(ctx context.Context, id string) (*domain.Account, error) {
	var account domain.Account
	if err := r.db.Find(&account, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &account, nil
}

func (r *AccountRepo) Update(ctx context.Context, account domain.Account) (*domain.Account, error) {
	res := r.db.WithContext(ctx).Model(&account).Updates(map[string]interface{}{
		"last_deposit":      account.LastDeposit,
		"main_balance":      account.MainBalance,
		"credit_balance":    account.CreditBalance,
		"last_balance":      account.LastBalance,
		"last_deposit_type": account.LastDepositType,
		"last_deposit_time": account.LastDepositTime,
	})
	if res.Error != nil {
		return nil, res.Error
	}
	return &account, nil
}

func (r *AccountRepo) UpdateMany(ctx context.Context, accounts []domain.Account) ([]domain.Account, error) {
	for _, acc := range accounts {
		if err := r.db.WithContext(ctx).Model(&acc).
			Updates(domain.Account{
				LastDeposit:     acc.LastDeposit,
				MainBalance:     acc.MainBalance,
				CreditBalance:   acc.CreditBalance,
				LastBalance:     acc.LastBalance,
				LastDepositType: acc.LastDepositType,
				LastDepositTime: acc.LastDepositTime,
			}).Error; err != nil {
			return nil, err
		}
	}
	return accounts, nil
}

func (r *AccountRepo) Delete(ctx context.Context, id string) (bool, error) {
	if err := r.db.WithContext(ctx).Delete(&domain.Account{}, "id = ?", id).Error; err != nil {
		return false, err
	}
	return true, nil
}
