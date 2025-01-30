package ports

import (
	"context"

	"github.com/scharph/orda/internal/domain"
)

type Item struct {
	TransactionID string `json:"transaction_id,omitempty"`
	ProductID     string `json:"product_id"` // Needed for request
	Quantity      int    `json:"qty"`        // Needed for request
	Price         int    `json:"price,omitempty"`
}

type TransactionRequest struct {
	Items         []Item               `json:"items"`
	AccountID     string               `json:"account_id"`
	UserID        string               `json:"user_id"`
	PaymentOption domain.PaymentOption `json:"payment_option"`
	AccountType   domain.AccountType   `json:"account_type"`
}

type TransactionResponse struct {
	TransactionID string `json:"transaction_id"`
	Items         []Item `json:"items"`
	Account       string `json:"account_id,omitempty"`
	User          string `json:"user_id"`
	PaymentOption int    `json:"payment_option"`
	AccountType   int    `json:"account_type"`
	Total         int    `json:"total"`
}

type ITransactionRepository interface {
	Create(ctx context.Context, transaction *domain.Transaction) (*domain.Transaction, error)
	Read(ctx context.Context) ([]*domain.Transaction, error)
	ReadByID(ctx context.Context, id string) (*domain.Transaction, error)
	Update(ctx context.Context, transaction domain.Transaction) (*domain.Transaction, error)
	Delete(ctx context.Context, transaction domain.Transaction) error
}

type ITransactionItemRepository interface {
	ReadByTransactionID(ctx context.Context, transactionID string) ([]*domain.TransactionItem, error)
}

type ITransactionService interface {
	Create(ctx context.Context, transaction domain.Transaction) (*domain.Transaction, error)
	Read(ctx context.Context) ([]*domain.Transaction, error)
	ReadByID(ctx context.Context, id string) (*domain.Transaction, error)
	ReadItemsByTransactionID(ctx context.Context, transactionID string) ([]*domain.TransactionItem, error)
	Update(ctx context.Context, transaction domain.Transaction) (*domain.Transaction, error)
	Delete(ctx context.Context, id string) error
}
