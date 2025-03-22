package ports

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/domain"
)

type ItemRequest struct {
	Id       string `json:"id,omitzero"`
	Quantity int8   `json:"qty"`
	Price    int32  `json:"price,omitzero"`
}

type Item struct {
	TransactionID string `json:"transaction_id,omitempty"`
	ProductID     string `json:"product_id"` // Needed for request
	Quantity      int    `json:"qty"`        // Needed for request
	Price         int32  `json:"price,omitempty"`
}

type TransactionRequest struct {
	Items         []ItemRequest        `json:"items"`
	Deposits      []ItemRequest        `json:"deposits"`
	AccountID     *string              `json:"account_id,omitempty"`
	PaymentOption domain.PaymentOption `json:"payment_option"`
}

type TransactionResponse struct {
	TransactionID string `json:"transaction_id"`
	ItemsLength   int    `json:"items_length"`
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
	Create(ctx context.Context, userid string, t TransactionRequest) (*TransactionResponse, error)
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
