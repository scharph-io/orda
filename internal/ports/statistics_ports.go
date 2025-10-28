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

type TransactionDay struct {
	Day time.Time `json:"day"`
	Qty int64     `json:"qty"`
}

type TransactionDays []*TransactionDay

type ProductForDateRange struct {
	Product     string  `json:"product"`
	TotalQty    int64   `json:"total_qty"`
	TotalAmount float64 `json:"total_amount"`
}

type ProductsForDateRange []*ProductForDateRange

type ProductQtyForDateRange struct {
	ReportingDay time.Time `json:"reporting_day"`
	TotalQty     int64     `json:"total_qty"`
}

type ProductQuantitiesForDateRange []*ProductQtyForDateRange

type PaymentOptionForDateRange struct {
	PaymentOption string  `json:"payment_option"`
	TotalAmount   float64 `json:"total_amount"`
}

type PaymentOptionsForDateRange []*PaymentOptionForDateRange

type IStatisticsRepository interface {
	GetTransactionDays(ctx context.Context, year int) (TransactionDays, error)
	// GetProductsForDateRange(ctx context.Context, startDate, endDate time.Time) (ProductsForDateRange, error)
	// GetProductQtyForDateRange(ctx context.Context, productId string, startDate, endDate time.Time) (ProductQtyForDateRange, error)
	// GetPaymentOptionsForDateRange(ctx context.Context, startDate, endDate time.Time) (PaymentOptionsForDateRange, error)
}

type IStatisticsService interface {
	GetTransactionDays(ctx context.Context, year int) (TransactionDays, error)
	// GetProductsForDateRange(ctx context.Context, startDate, endDate time.Time) (ProductsForDateRange, error)
	// GetProductQtyForDateRange(ctx context.Context, productId string, startDate, endDate time.Time) (ProductQtyForDateRange, error)
	// GetPaymentOptionsForDateRange(ctx context.Context, startDate, endDate time.Time) (PaymentOptionsForDateRange, error)
}

type IStatisticsHandlers interface {
	GetTransactionDays(c *fiber.Ctx) error
	// GetProductsForDateRange(c *fiber.Ctx) error
	// GetProductQtyForDateRange(c *fiber.Ctx) error
	// GetPaymentOptionsForDateRange(c *fiber.Ctx) error
}
