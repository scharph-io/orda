package repository

import (
	"context"

	"github.com/scharph/orda/internal/model"
)

type TransactionRepository interface {
	Create(ctx context.Context, transaction *model.Transaction) error
	GetAll(ctx context.Context) ([]model.Transaction, error)
	Delete(ctx context.Context, id uint) error
}

func NewTransactionRepository(r *Repository) TransactionRepository {
	return &transactionRepository{
		Repository: r,
	}
}

type transactionRepository struct {
	*Repository
}

// Create implements TransactionRepository.
func (t *transactionRepository) Create(ctx context.Context, transaction *model.Transaction) error {
	if err := t.DB(ctx).Create(transaction).Error; err != nil {
		return err
	}
	return nil
}

// Delete implements TransactionRepository.
func (t *transactionRepository) Delete(ctx context.Context, id uint) error {
	var transaction model.Transaction
	if err := t.DB(ctx).Where("id = ?", id).First(&transaction).Error; err != nil {
		return err
	}
	if err := t.DB(ctx).Delete(&transaction).Error; err != nil {
		return err
	}
	return nil
}

// GetAll implements TransactionRepository.
func (t *transactionRepository) GetAll(ctx context.Context) ([]model.Transaction, error) {
	panic("unimplemented")
}

func (r *transactionRepository) wherePaymentOption(opt string) (tx *transactionRepository) {
	panic("unimplemented")
}
