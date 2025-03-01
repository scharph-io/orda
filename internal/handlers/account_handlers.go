package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/ports"
)

type AccountHandlers struct {
	service ports.IAccountService
}

var _ ports.IAccountHandlers = (*AccountHandlers)(nil)

func NewAccountHandlers(service ports.IAccountService) *AccountHandlers {
	return &AccountHandlers{service}
}

func (h *AccountHandlers) CreateGroup(c *fiber.Ctx) error {

	req := ports.AccountGroupRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user data"})
	}

	res, err := h.service.CreateGroup(c.Context(), req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to create group"})

	}
	return c.Status(fiber.StatusCreated).JSON(res)

}

func (h *AccountHandlers) Create(c *fiber.Ctx) error {
	req := ports.AccountRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user data"})
	}
	res, err := h.service.Create(c.Context(), req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to create account"})
	}
	return c.Status(fiber.StatusCreated).JSON(res)
}

func (h *AccountHandlers) GetAll(c *fiber.Ctx) error {
	res, err := h.service.GetAll(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get accounts"})
	}
	if res == nil {
		return c.Status(fiber.StatusNoContent).JSON([]string{})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

// GetById implements ports.IAccountHandlers.
func (h *AccountHandlers) GetById(c *fiber.Ctx) error {
	res, err := h.service.GetById(c.Context(), c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get account"})
	}
	if res == nil {
		return c.Status(fiber.StatusNoContent).JSON([]string{})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *AccountHandlers) GetAllGroups(c *fiber.Ctx) error {
	res, err := h.service.GetAllGroups(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get groups"})
	}
	if res == nil {
		return c.Status(fiber.StatusNoContent).JSON([]string{})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *AccountHandlers) GetGroupAccounts(c *fiber.Ctx) error {
	id := c.Params("id")
	res, err := h.service.GetGroupAccounts(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get group accounts"})
	}
	if res == nil {
		return c.Status(fiber.StatusNoContent).JSON([]string{})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *AccountHandlers) Deposit(c *fiber.Ctx) error {
	id := c.Params("id")
	req := &ports.DepositRequest{}
	if err := c.BodyParser(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid deposit data"})
	}
	res, err := h.service.DepositAmount(c.Context(), id, *req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to deposit to account"})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *AccountHandlers) DepositGroup(c *fiber.Ctx) error {
	id := c.Params("id")
	req := ports.DepositGroupRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid deposit data"})
	}
	res, err := h.service.DepositAmountGroup(c.Context(), id, req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to deposit to group"})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *AccountHandlers) GetHistory(c *fiber.Ctx) error {
	var history []ports.AccountHistoryResponse
	var err error
	if account := c.Query("account"); account != "" {

		fmt.Println(account)
		history, err = h.service.GetAccountHistory(c.Context(), account)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get account history"})
		}
	} else if group := c.Query("group"); group != "" {
		history, err = h.service.GetAccountGroupHistory(c.Context(), group)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get group history"})
		}
	}
	return c.Status(fiber.StatusOK).JSON(history)
}

func (h *AccountHandlers) DeleteGroup(c *fiber.Ctx) error {
	id := c.Params("id")
	res, err := h.service.DeleteGroup(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete group"})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *AccountHandlers) DeleteAccount(c *fiber.Ctx) error {
	id := c.Params("id")
	res, err := h.service.DeleteAccount(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete account"})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}
