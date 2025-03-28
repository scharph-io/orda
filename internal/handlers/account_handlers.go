package handlers

import (
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

	userID := c.Locals("userid").(string)
	res, err := h.service.Create(c.Context(), userID, req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to create account"})
	}
	return c.Status(fiber.StatusCreated).JSON(res)
}

func (h *AccountHandlers) CreateMany(c *fiber.Ctx) error {
	req := []ports.AccountRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user data"})
	}

	userID := c.Locals("userid").(string)
	res, err := h.service.Create(c.Context(), userID, req...)
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

func (h *AccountHandlers) Update(c *fiber.Ctx) error {
	req := ports.AccountRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user data"})
	}

	res, err := h.service.Update(c.Context(), req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update account"})
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

	var req ports.AccDepositRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request",
		})
	}

	if req.Amount <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid deposit amount"})
	}

	userID := c.Locals("userid").(string)

	res, err := h.service.DepositAmount(c.Context(), userID, id, req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to deposit to account"})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *AccountHandlers) DepositGroup(c *fiber.Ctx) error {
	id := c.Params("id")
	req := ports.AccDepositGroupRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid deposit data"})
	}

	userID := c.Locals("userid").(string)
	res, err := h.service.DepositAmountGroup(c.Context(), userID, id, req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to deposit to group"})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *AccountHandlers) GetHistory(c *fiber.Ctx) error {
	var history []*ports.AccountHistoryResponse
	var err error
	if account := c.Query("account"); account != "" {
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

func (h *AccountHandlers) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	res, err := h.service.Delete(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete account"})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}
