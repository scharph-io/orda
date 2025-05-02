package transaction

import (
	"context"
	"time"

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

func (r *TransactionRepository) Create(ctx context.Context, transaction *domain.Transaction) (*domain.Transaction, error) {
	if err := r.db.WithContext(ctx).Create(transaction).Error; err != nil {
		return nil, err
	}
	return transaction, nil
}

func (r *TransactionRepository) Read(ctx context.Context) ([]*domain.Transaction, error) {
	var t []*domain.Transaction
	if err := r.db.WithContext(ctx).Preload("Items").Preload("Account").Find(&t).Error; err != nil {
		return nil, err
	}
	return t, nil
}

func (r *TransactionRepository) ReadByID(ctx context.Context, id string) (*domain.Transaction, error) {
	var t domain.Transaction
	if err := r.db.WithContext(ctx).Model(&domain.Transaction{}).Where("id = ?", id).Preload("Items").Find(&t).Error; err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *TransactionRepository) ReadByDate(ctx context.Context, date string, payment_option ...uint8) ([]*domain.Transaction, error) {
	var t []*domain.Transaction
	var err error
	if len(payment_option) == 0 {
		err = r.db.WithContext(ctx).Model(&domain.Transaction{}).Where("DATE(created_at) = ?", date).Preload("Items").Preload("Account").Find(&t).Error
	} else {
		err = r.db.WithContext(ctx).Model(&domain.Transaction{}).Where("DATE(created_at) = ? AND payment_option = ?", date, payment_option[0]).Preload("Items").Preload("Account").Find(&t).Error
	}
	return t, err
}

func (r *TransactionRepository) ReadByDateRange(ctx context.Context, from, to time.Time, payment_option ...uint8) ([]*domain.Transaction, error) {
	var t []*domain.Transaction
	var err error
	if len(payment_option) == 0 {
		err = r.db.WithContext(ctx).Model(&domain.Transaction{}).Where("created_at BETWEEN ? AND ?", from, to).Preload("Items").Preload("Account").Find(&t).Error
	} else {
		err = r.db.WithContext(ctx).Model(&domain.Transaction{}).Where("created_at BETWEEN ? AND ? AND payment_option = ?", from, to, payment_option[0]).Preload("Items").Preload("Account").Find(&t).Error
	}
	return t, err
}

func (r *TransactionRepository) Update(ctx context.Context, t domain.Transaction) (*domain.Transaction, error) {
	if err := r.db.WithContext(ctx).Model(&t).Updates(t).Error; err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *TransactionRepository) Delete(ctx context.Context, t domain.Transaction) error {
	if err := r.db.WithContext(ctx).Delete(&t).Error; err != nil {
		return err
	}
	return nil
}

func (r *TransactionRepository) RunQuery(ctx context.Context, query string, args ...any) *gorm.DB {
	return r.db.WithContext(ctx).Raw(query, args...)
}

type TransactionItemRepository struct {
	db *gorm.DB
}

var _ ports.ITransactionItemRepository = (*TransactionItemRepository)(nil)

func NewTransactionItemRepository(db *gorm.DB) *TransactionItemRepository {
	return &TransactionItemRepository{db}
}

func (r *TransactionItemRepository) ReadByTransactionID(ctx context.Context, transactionID string) ([]*domain.TransactionItem, error) {
	var items []*domain.TransactionItem
	if err := r.db.WithContext(ctx).Where("transaction_id = ?", transactionID).Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}
