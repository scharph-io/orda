package handlers

import (
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/ports"
)

type StatisticsHandler struct {
	statisticsService ports.IStatisticsService
}

var _ ports.IStatisticsHandlers = (*StatisticsHandler)(nil)

func NewStatisticsHandler(statisticsService ports.IStatisticsService) *StatisticsHandler {
	return &StatisticsHandler{
		statisticsService: statisticsService,
	}
}

func (h *StatisticsHandler) GetTransactionDays(c *fiber.Ctx) error {
	current := time.Now().Year()
	year := c.QueryInt("year", current)
	if year > time.Now().Year() {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "failed to get transaction days",
			"error":   "year cannot be in the future",
		})
	}
	transactionDays, err := h.statisticsService.GetTransactionDays(c.Context(), year)
	if err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"message": "failed to get transaction days",
			"error":   err,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": transactionDays,
		"year": year,
	})
}

func (h *StatisticsHandler) GetProductsForDateRange(c *fiber.Ctx) error {
	const layout = time.RFC3339

	now := time.Now()
	fromDateString := c.Query("from", (now.AddDate(-1, 0, 0)).Format(layout))
	toDateString := c.Query("to", now.Format(layout))

	fromDate, err := time.Parse(layout, fromDateString)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": fmt.Sprintf("cannot parse 'from' date: '%s'", fromDateString),
		})
	}

	toDate, err := time.Parse(layout, toDateString)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": fmt.Sprintf("cannot parse 'to' date: '%s'", toDateString),
		})
	}

	if fromDate.After(toDate) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": fmt.Sprintf("invalid date range: '%s' to '%s', 'from' must be before 'to'", fromDateString, toDateString),
		})
	}

	x, err := h.statisticsService.GetProductsForDateRange(c.Context(), fromDate, toDate)
	if err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"message": fmt.Sprintf("failed to get products for date range: '%s' to '%s'", fromDateString, toDateString),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": x,
		"from": fromDate,
		"to":   toDate,
	})
}

func (h *StatisticsHandler) GetProductQtyForDateRange(c *fiber.Ctx) error {
	const layout = time.RFC3339

	now := time.Now()
	fromDateString := c.Query("from", (now.AddDate(-1, 0, 0)).Format(layout))
	toDateString := c.Query("to", now.Format(layout))

	productID := c.Params("id")

	fromDate, err := time.Parse(layout, fromDateString)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": fmt.Sprintf("cannot parse 'from' date: '%s'", fromDateString),
		})
	}

	toDate, err := time.Parse(layout, toDateString)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": fmt.Sprintf("cannot parse 'to' date: '%s'", toDateString),
		})
	}

	if fromDate.After(toDate) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": fmt.Sprintf("invalid date range: '%s' to '%s', 'from' must be before 'to'", fromDateString, toDateString),
		})
	}

	x, err := h.statisticsService.GetProductsQtyDatasets(c.Context(), fromDate, toDate, productID)
	if err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"message": fmt.Sprintf("failed to get product quantities for date range: '%s' to '%s'", fromDateString, toDateString),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": x,
		"from": fromDate,
		"to":   toDate,
	})
}

func (h *StatisticsHandler) GetProductsQtyForDateRange(c *fiber.Ctx) error {
	const layout = time.RFC3339

	now := time.Now()
	fromDateString := c.Query("from", (now.AddDate(-1, 0, 0)).Format(layout))
	toDateString := c.Query("to", now.Format(layout))

	fromDate, err := time.Parse(layout, fromDateString)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": fmt.Sprintf("cannot parse 'from' date: '%s'", fromDateString),
		})
	}

	toDate, err := time.Parse(layout, toDateString)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": fmt.Sprintf("cannot parse 'to' date: '%s'", toDateString),
		})
	}

	if fromDate.After(toDate) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": fmt.Sprintf("invalid date range: '%s' to '%s', 'from' must be before 'to'", fromDateString, toDateString),
		})
	}

	x, err := h.statisticsService.GetProductsQtyDatasets(c.Context(), fromDate, toDate, strings.Split(c.Query("ids"), ",")...)
	if err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"message": fmt.Sprintf("failed to get product quantities for date range: '%s' to '%s'", fromDateString, toDateString),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": x,
		"from": fromDate,
		"to":   toDate,
	})

}

func (h *StatisticsHandler) GetPaymentOptionsForDateRange(c *fiber.Ctx) error {
	const layout = time.RFC3339

	now := time.Now()
	fromDateString := c.Query("from", (now.AddDate(-1, 0, 0)).Format(layout))
	toDateString := c.Query("to", now.Format(layout))

	fromDate, err := time.Parse(layout, fromDateString)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": fmt.Sprintf("cannot parse 'from' date: '%s'", fromDateString),
		})
	}

	toDate, err := time.Parse(layout, toDateString)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": fmt.Sprintf("cannot parse 'to' date: '%s'", toDateString),
		})
	}

	if fromDate.After(toDate) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": fmt.Sprintf("invalid date range: '%s' to '%s', 'from' must be before 'to'", fromDateString, toDateString),
		})
	}

	x, err := h.statisticsService.GetPaymentOptionsForDateRange(c.Context(), fromDate, toDate)
	if err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"message": fmt.Sprintf("failed to get payment options for date range: '%s' to '%s'", fromDateString, toDateString),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": x,
		"from": fromDate,
		"to":   toDate,
	})
}
