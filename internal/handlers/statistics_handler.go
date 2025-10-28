package handlers

import (
	"errors"
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
	transactionDays, err := h.statisticsService.GetTransactionDays(c.Context(), year)
	if err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"message": errors.Join(errors.New("Failed to get Transaction days"), err),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": transactionDays,
		"year": year,
	})
}
