package ports

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/domain"
)

type Item struct {
	TransactionID string `json:"transaction_id,omitempty"`
	ProductID     string `json:"product_id"` // Needed for request
	Quantity      int    `json:"qty"`        // Needed for request
	Price         int32  `json:"price,omitempty"`
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
	// Items         []Item `json:"items"`
	ItemsLength   int    `json:"items_length"`
	Account       string `json:"account_id,omitempty"`
	User          string `json:"user_id,omitempty"`
	PaymentOption int    `json:"payment_option,omitempty"`
	AccountType   int    `json:"account_type,omitempty"`
	Total         int32  `json:"total"`
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
	Create(ctx context.Context, t TransactionRequest) (*TransactionResponse, error)
	Read(ctx context.Context) ([]*TransactionResponse, error)
	ReadByID(ctx context.Context, id string) (*TransactionResponse, error)
	ReadItemsByTransactionID(ctx context.Context, transactionID string) ([]*TransactionResponse, error)
	Update(ctx context.Context, t TransactionRequest) (*TransactionResponse, error)
	Delete(ctx context.Context, id string) error
}

type ITransactionHandlers interface {
	Create(c *fiber.Ctx) error
	ReadById(c *fiber.Ctx) error
	ReadLimit(c *fiber.Ctx) error
	Delete(c *fiber.Ctx) error
}
