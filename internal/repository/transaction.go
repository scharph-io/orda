package repository

import (
	"context"

	"github.com/scharph/orda/internal/model"
	"gorm.io/gorm"
)

type TransactionRepo struct {
	db *gorm.DB
}

func NewTransactionRepo(db *gorm.DB) *TransactionRepo {
	return &TransactionRepo{db}
}

func (t *TransactionRepo) Create(ctx context.Context, transaction *model.Transaction) (*model.Transaction, error) {
	res := t.db.WithContext(ctx).Create(&transaction)
	if res.Error != nil {
		return nil, res.Error
	}
	return transaction, nil
}

func (t *TransactionRepo) Read(ctx context.Context) (transactions []model.Transaction, err error) {
	res := t.db.WithContext(ctx).Find(&transactions)
	if res.Error != nil {
		return nil, res.Error
	}
	return transactions, nil
}

func (t *TransactionRepo) ReadByTransactionNr(ctx context.Context, transactionNr string) (transaction model.Transaction, err error) {
	res := t.db.WithContext(ctx).Where("transaction_nr = ?", transactionNr).First(&transaction)
	if res.Error != nil {
		return model.Transaction{}, res.Error
	}
	return transaction, nil
}

func (t *TransactionRepo) Update(ctx context.Context, id string, transaction *model.Transaction) (*model.Transaction, error) {
	res := t.db.WithContext(ctx).Model(&model.Transaction{}).Where("id = ?", id).Updates(&transaction)
	if res.Error != nil {
		return nil, res.Error
	}
	return transaction, nil
}

func (t *TransactionRepo) Delete(ctx context.Context, id string) (bool, error) {
	res := t.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Transaction{})
	if res.Error != nil {
		return false, res.Error
	}
	return !(res.RowsAffected == 0), nil
}
