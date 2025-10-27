package ports

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
)

type TransactionDay struct {
	Day time.Time
	Qty int64
}

type TransactionDays []*TransactionDay

type ProductForDateRange struct {
	Product     string
	TotalQty    int64
	TotalAmount float64
}

type ProductsForDateRange []*ProductForDateRange

type ProductQtyForDateRange struct {
	ReportingDay time.Time
	TotalQty     int64
}

type ProductQuantitiesForDateRange []*ProductQtyForDateRange

type PaymentOptionForDateRange struct {
	PaymentOption string
	TotalAmount   float64
}

type PaymentOptionsForDateRange []*PaymentOptionForDateRange

type IStatisticsRepository interface {
	GetTransactionDays(ctx context.Context, year int) (TransactionDays, error)
	// GetProductsForDateRange(ctx context.Context, startDate, endDate time.Time) (ProductsForDateRange, error)
	// GetProductQtyForDateRange(ctx context.Context, productId string, startDate, endDate time.Time) (ProductQtyForDateRange, error)
	// GetPaymentOptionsForDateRange(ctx context.Context, startDate, endDate time.Time) (PaymentOptionsForDateRange, error)
}

type IStatisticsService interface {
	GetTransactionDays(ctx context.Context) (TransactionDays, error)
	GetProductsForDateRange(ctx context.Context, startDate, endDate time.Time) (ProductsForDateRange, error)
	GetProductQtyForDateRange(ctx context.Context, productId string, startDate, endDate time.Time) (ProductQtyForDateRange, error)
	GetPaymentOptionsForDateRange(ctx context.Context, startDate, endDate time.Time) (PaymentOptionsForDateRange, error)
}

type IStatisticsHandler interface {
	GetTransactionDays(c *fiber.Ctx) error
	GetProductsForDateRange(c *fiber.Ctx) error
	GetProductQtyForDateRange(c *fiber.Ctx) error
	GetPaymentOptionsForDateRange(c *fiber.Ctx) error
}
