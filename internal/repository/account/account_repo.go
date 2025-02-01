package account

import (
	"context"
	"fmt"

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

func (r *AccountRepo) Create(ctx context.Context, acc domain.Account) (*domain.Account, error) {
	if err := r.db.Create(&acc).Error; err != nil {
		return nil, err
	}
	return &acc, nil
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
	if err := r.db.Model(&domain.Account{}).Where("id = ?", id).Find(&account).Error; err != nil {
		return nil, err
	}
	return &account, nil
}

func (r *AccountRepo) Update(ctx context.Context, account domain.Account) (*domain.Account, error) {
	fmt.Printf("[Repo] Deposit to %s \n", account.ToString())
	if err := r.db.Model(&account).Updates(account).Error; err != nil {
		return nil, err
	}
	return &account, nil
}

func (r *AccountRepo) UpdateMany(ctx context.Context, accounts []domain.Account) ([]domain.Account, error) {
	for _, acc := range accounts {
		if err := r.db.Model(&acc).
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
	if err := r.db.Delete(&domain.Account{}, "id = ?", id).Error; err != nil {
		return false, err
	}
	return true, nil
}
