package transaction

import (
	"context"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"gorm.io/gorm"
)

type TransactionRepository struct {
	db *gorm.DB
}

var _ ports.ITransactionRepository = (*TransactionRepository)(nil)

func NewTransactionRepository(db *gorm.DB) *TransactionRepository {
	return &TransactionRepository{db}
}

func (r *TransactionRepository) Create(ctx context.Context, transaction domain.Transaction) (*domain.Transaction, error) {
	if err := r.db.WithContext(ctx).Create(&transaction).Error; err != nil {
		return nil, err
	}
	return &transaction, nil
}

func (r *TransactionRepository) Read(ctx context.Context) ([]domain.Transaction, error) {
	var transactions []domain.Transaction
	if err := r.db.WithContext(ctx).Find(&transactions).Error; err != nil {
		return nil, err
	}
	return transactions, nil
}

func (r *TransactionRepository) ReadByID(ctx context.Context, id string) (*domain.Transaction, error) {
	var transaction domain.Transaction
	if err := r.db.WithContext(ctx).Model(&domain.Transaction{}).Where("id = ?", id).Preload("Items").Find(&transaction).Error; err != nil {
		return nil, err
	}
	return &transaction, nil
}

func (r *TransactionRepository) Update(ctx context.Context, transaction domain.Transaction) (*domain.Transaction, error) {
	if err := r.db.WithContext(ctx).Model(&transaction).Updates(transaction).Error; err != nil {
		return nil, err
	}
	return &transaction, nil
}

func (r *TransactionRepository) Delete(ctx context.Context, transaction domain.Transaction) error {
	if err := r.db.WithContext(ctx).Delete(&transaction).Error; err != nil {
		return err
	}
	return nil
}

type TransactionItemRepository struct {
	db *gorm.DB
}

var _ ports.ITransactionItemRepository = (*TransactionItemRepository)(nil)

func NewTransactionItemRepository(db *gorm.DB) *TransactionItemRepository {
	return &TransactionItemRepository{db}
}

func (r *TransactionItemRepository) ReadByTransactionID(ctx context.Context, transactionID string) ([]*domain.TransactionItem, error) {
	var transactionItems []*domain.TransactionItem
	if err := r.db.WithContext(ctx).Where("transaction_id = ?", transactionID).Find(&transactionItems).Error; err != nil {
		return nil, err
	}
	return transactionItems, nil
}
