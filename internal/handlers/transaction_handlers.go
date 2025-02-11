package handlers

import (
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
	res, err := h.transactionService.Create(c.Context(), req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to create transaction"})
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

func (h *TransactionHandlers) ReadLimit(c *fiber.Ctx) error {
	res, err := h.transactionService.Read(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get transactions"})
	}
	if res == nil {
		return c.Status(fiber.StatusNoContent).JSON([]string{})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

// func (h *TransactionHandlers) Update(c *fiber.Ctx) error {
// 	req := ports.TransactionRequest{}
// 	if err := c.BodyParser(&req); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid data"})
// 	}
// 	id := c.Params("id")
// 	res, err := h.transactionService.Update(c.Context(), id, req)
// 	if err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to update transaction"})
// 	}
// 	return c.Status(fiber.StatusOK).JSON(res)
// }
//

func (h *TransactionHandlers) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	err := h.transactionService.Delete(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to delete transaction"})
	}
	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{})
}
