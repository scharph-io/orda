package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/ports"
)

type UserHandlers struct {
	service ports.IUserService
}

var _ ports.IUserHandlers = (*UserHandlers)(nil)

func NewUserHandlers(service ports.IUserService) *UserHandlers {
	return &UserHandlers{service}
}

func (h *UserHandlers) GetAll(c *fiber.Ctx) error {
	res, err := h.service.GetAllUsers(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get users"})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *UserHandlers) Register(c *fiber.Ctx) error {
	req := ports.UserRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user data"})
	}

	fmt.Printf("TODO: remove visible password from logs '%v'\n", req)

	fmt.Printf("Try to create user: %+v\n", req)

	res, err := h.service.Create(c.Context(), req)
	if err != nil {
		fmt.Printf("Failed to create user: %s\n", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": fmt.Sprintf("Failed to create user: %s", err)})
	}
	return c.Status(fiber.StatusCreated).JSON(res)
}

func (h *UserHandlers) GetOne(c *fiber.Ctx) error {
	id := c.Params("id")
	res, err := h.service.GetUserById(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to get user"})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *UserHandlers) Update(c *fiber.Ctx) error {
	req := ports.UserRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user data"})
	}
	req.Id = c.Params("id")

	fmt.Printf("Try to update user: %+v\n", req)
	res, err := h.service.Update(c.Context(), req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": fmt.Sprintf("Failed to update user: %s", err)})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *UserHandlers) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	err := h.service.Delete(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": fmt.Sprintf("Failed to delete user: %s", err)})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "User deleted"})
}
