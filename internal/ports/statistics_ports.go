package ports

import (
	"context"
	"errors"
	"time"

	"github.com/gofiber/fiber/v2"
)

var (
	ErrInvalidYear = errors.New("invalid year")
)

type TransactionCntDate struct {
	Date time.Time `json:"date"`
	Qty  int64     `json:"qty"`
}

type TransactionCntDates []*TransactionCntDate

type ProductForDateRange struct {
	Product     string  `json:"product"`
	Desc        string  `json:"desc"`
	TotalQty    int64   `json:"total_qty"`
	TotalAmount float64 `json:"total_amount"`
}

type ProductsForDateRange []*ProductForDateRange

type ProductQuantitiesDataset struct {
	ProductId string   `json:"product_id"`
	Dataset   []*int32 `json:"dataset"`
}

type ProductQuantitiesDatasets struct {
	Dates    []*time.Time                `json:"dates"`
	Datasets []*ProductQuantitiesDataset `json:"datasets"`
}

type PaymentOptionForDateRange struct {
	PaymentOption     uint    `json:"payment_option"`
	Transactions      int32   `json:"transactions"`
	TotalAmount       float64 `json:"total_amount"`
	TotalCreditAmount float64 `json:"total_credit_amount"`
}

type PaymentOptionsForDateRange []*PaymentOptionForDateRange

type IStatisticsRepository interface {
	GetTransactionCntDates(ctx context.Context, year int) (TransactionCntDates, error)
	GetTransactionDates(ctx context.Context, startDate, endDate *time.Time) ([]*time.Time, error)

	GetProductsForDateRange(ctx context.Context, startDate, endDate time.Time) (ProductsForDateRange, error)
	GetProductQtyForDateRange(ctx context.Context, startDate, endDate time.Time, productId string) ([]*int32, error)
	ProductsExists(ctx context.Context, productIds []string) (bool, error)
	GetPaymentOptionsForDateRange(ctx context.Context, startDate, endDate time.Time) (PaymentOptionsForDateRange, error)
}

type IStatisticsService interface {
	GetTransactionCntDates(ctx context.Context, year int) (TransactionCntDates, error)
	GetTransactionDates(ctx context.Context, startDate, endDate *time.Time) ([]*time.Time, error)

	GetProductsForDateRange(ctx context.Context, startDate, endDate time.Time) (ProductsForDateRange, error)
	GetProductsQtyDatasets(ctx context.Context, startDate, endDate time.Time, productIds ...string) (*ProductQuantitiesDatasets, error)
	GetPaymentOptionsForDateRange(ctx context.Context, startDate, endDate time.Time) (map[int]*PaymentOptionForDateRange, error)
}

type IStatisticsHandlers interface {
	GetTransactionCntDates(c *fiber.Ctx) error
	GetTransactionDates(c *fiber.Ctx) error

	GetProductsForDateRange(c *fiber.Ctx) error
	GetProductQtyForDateRange(c *fiber.Ctx) error
	GetProductsQtyForDateRange(c *fiber.Ctx) error
	GetPaymentOptionsForDateRange(c *fiber.Ctx) error
}
