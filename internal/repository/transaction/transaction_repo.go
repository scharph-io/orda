package transaction

import (
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

func (r *TransactionRepository) Create(transaction domain.Transaction) (*domain.Transaction, error) {
	if err := r.db.Create(&transaction).Error; err != nil {
		return nil, err
	}
	return &transaction, nil
}

func (r *TransactionRepository) Read() ([]domain.Transaction, error) {
	var transactions []domain.Transaction
	if err := r.db.Find(&transactions).Error; err != nil {
		return nil, err
	}
	return transactions, nil
}

func (r *TransactionRepository) ReadByID(id string) (*domain.Transaction, error) {
	var transaction domain.Transaction
	if err := r.db.Model(&domain.Transaction{}).Where("id = ?", id).Preload("Items").Find(&transaction).Error; err != nil {
		return nil, err
	}
	return &transaction, nil
}

func (r *TransactionRepository) Update(transaction domain.Transaction) (*domain.Transaction, error) {
	if err := r.db.Model(&transaction).Updates(transaction).Error; err != nil {
		return nil, err
	}
	return &transaction, nil
}

func (r *TransactionRepository) Delete(transaction domain.Transaction) error {
	if err := r.db.Delete(&transaction).Error; err != nil {
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

// func (r *TransactionItemRepository) Create(transactionItem domain.TransactionItem) (*domain.TransactionItem, error) {
// 	if err := r.db.Create(&transactionItem).Error; err != nil {
// 		return nil, err
// 	}
// 	return &transactionItem, nil
// }

// func (r *TransactionItemRepository) CreateMany(transactionItems []domain.TransactionItem) ([]domain.TransactionItem, error) {
// 	for _, transactionItem := range transactionItems {
// 		if err := r.db.Create(&transactionItem).Error; err != nil {
// 			return nil, err
// 		}
// 	}
// 	return transactionItems, nil
// }

func (r *TransactionItemRepository) ReadByTransactionID(transactionID string) ([]domain.TransactionItem, error) {
	var transactionItems []domain.TransactionItem
	if err := r.db.Where("transaction_id = ?", transactionID).Find(&transactionItems).Error; err != nil {
		return nil, err
	}
	return transactionItems, nil
}
