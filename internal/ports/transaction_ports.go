package ports

import "github.com/scharph/orda/internal/domain"

type ITransactionRepository interface {
	Create(transaction domain.Transaction) (*domain.Transaction, error)
	Read() ([]domain.Transaction, error)
	ReadByID(id string) (*domain.Transaction, error)
	Update(transaction domain.Transaction) (*domain.Transaction, error)
	Delete(transaction domain.Transaction) error
}

type ITransactionItemRepository interface {
	// Create(transactionItem domain.TransactionItem) (*domain.TransactionItem, error)
	// CreateMany(transactionItems []domain.TransactionItem) ([]domain.TransactionItem, error)
	ReadByTransactionID(transactionID string) ([]domain.TransactionItem, error)
}
