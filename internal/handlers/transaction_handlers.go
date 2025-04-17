package handlers

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/service"
)

type TransactionHandlers struct {
	transactionService *service.TransactionService
}

func NewTransactionHandler(service *service.TransactionService) *TransactionHandlers {
	return &TransactionHandlers{service}
}

var _ ports.ITransactionHandlers = (*TransactionHandlers)(nil)

func (h *TransactionHandlers) Create(c *fiber.Ctx) error {
	req := ports.TransactionRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid data"})
	}
	var res *ports.TransactionResponse
	var err error
	if req.AccountID == "" {
		res, err = h.transactionService.Create(c.Context(), c.Locals("userid").(string), req)
	} else {
		res, err = h.transactionService.CreateWithAccount(c.Context(), c.Locals("userid").(string), req)
	}
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": fmt.Sprintf("Failed to create transaction: %s", err)})
	}
	return c.Status(fiber.StatusCreated).JSON(res)
}

func (h *TransactionHandlers) ReadById(c *fiber.Ctx) error {
	id := c.Params("id")
	res, err := h.transactionService.ReadByID(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get transaction"})
	}
	if res == nil {
		return c.Status(fiber.StatusNoContent).JSON([]string{})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *TransactionHandlers) Read(c *fiber.Ctx) error {

	date := c.Query("date", time.Now().Format("2006-01-02"))
	res, err := h.transactionService.ReadByDate(c.Context(), date)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get transactions"})
	}
	if res == nil {
		return c.Status(fiber.StatusOK).JSON([]string{})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *TransactionHandlers) ReadSummary(c *fiber.Ctx) error {
	layout := "2006-01-02 15:04:05"
	fromDateString := c.Query("from", time.Time{}.Format(layout))
	toDateString := c.Query("to", time.Now().Format(layout))

	from, err := time.Parse(layout, fromDateString)
	to, err := time.Parse(layout, toDateString)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid date format"})
	}

	if from.After(to) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid date range"})
	}

	resPaymentSummary, _ := h.transactionService.ReadPaymentSummary(c.Context(), from, to)
	if resPaymentSummary == nil {
		return c.Status(fiber.StatusOK).JSON([]string{})
	}
	resProductSummary, _ := h.transactionService.ReadProductSummary(c.Context(), from, to)
	if resProductSummary == nil {
		return c.Status(fiber.StatusOK).JSON([]string{})
	}

	resViewSummary, _ := h.transactionService.ReadViewSummary(c.Context(), from, to)
	if resViewSummary == nil {
		return c.Status(fiber.StatusOK).JSON([]string{})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"period": map[string]time.Time{
			"from": from,
			"to":   to,
		},
		"summary": map[string]any{
			"payments": resPaymentSummary,
			"products": resProductSummary,
			"views":    resViewSummary,
		},
	})
}

func (h *TransactionHandlers) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	err := h.transactionService.Delete(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to delete transaction"})
	}
	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{})
}
