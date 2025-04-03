package ports

import (
	"context"
	"fmt"

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
	AccountID     string               `json:"account_id,omitempty"`
	PaymentOption domain.PaymentOption `json:"payment_option"`
}

func (t *TransactionRequest) CalculateTotal() int32 {
	total := int32(0)
	for _, item := range t.Items {
		total += item.Price * int32(item.Quantity)
	}
	return total
}

func (tr *TransactionRequest) PrintDetails() {
	fmt.Println("##### Transaction Request:")
	fmt.Printf("AccountID: %s\n", tr.AccountID)
	fmt.Printf("PaymentOption: %d\n", tr.PaymentOption)
	fmt.Println("Items:")
	for _, item := range tr.Items {
		fmt.Printf(" - ItemID: %s, Quantity: %d\n", item.Id, item.Quantity)
	}

	fmt.Println("##############")
}

type TransactionResponse struct {
	TransactionID string               `json:"transaction_id"`
	CreatedAt     string               `json:"created_at"`
	ItemsLength   int                  `json:"items_length"`
	PaymentOption domain.PaymentOption `json:"payment_option"`
	Total         int32                `json:"total"`
	AccountId     string               `json:"account_id,omitempty"`
}

type TransactionSummaryResponse struct {
	Totals map[uint8]int32 `json:"totals"`
}

type ITransactionRepository interface {
	Create(ctx context.Context, transaction *domain.Transaction) (*domain.Transaction, error)
	Read(ctx context.Context) ([]*domain.Transaction, error)
	ReadByDate(ctx context.Context, date string, payment_option ...uint8) ([]*domain.Transaction, error)
	ReadSummaryByDate(ctx context.Context, date string, payment_option ...uint8) (int32, error)

	ReadByID(ctx context.Context, id string) (*domain.Transaction, error)
	Update(ctx context.Context, transaction domain.Transaction) (*domain.Transaction, error)
	Delete(ctx context.Context, transaction domain.Transaction) error
}

type ITransactionItemRepository interface {
	ReadByTransactionID(ctx context.Context, transactionID string) ([]*domain.TransactionItem, error)
}

type ITransactionService interface {
	Create(ctx context.Context, userid string, t TransactionRequest) (*TransactionResponse, error)
	CreateWithAccount(ctx context.Context, userid string, t TransactionRequest) (*TransactionResponse, error)
	Read(ctx context.Context) ([]*TransactionResponse, error)
	ReadByID(ctx context.Context, id string) (*TransactionResponse, error)
	ReadByDate(ctx context.Context, date string) ([]*TransactionResponse, error)
	ReadSummaryByDate(ctx context.Context, date string) (*TransactionSummaryResponse, error)
	ReadItemsByTransactionID(ctx context.Context, transactionID string) ([]*TransactionResponse, error)
	Update(ctx context.Context, t TransactionRequest) (*TransactionResponse, error)
	Delete(ctx context.Context, id string) error
}

type ITransactionHandlers interface {
	Create(c *fiber.Ctx) error
	ReadById(c *fiber.Ctx) error
	Read(c *fiber.Ctx) error
	ReadSummary(c *fiber.Ctx) error
	Delete(c *fiber.Ctx) error
}
