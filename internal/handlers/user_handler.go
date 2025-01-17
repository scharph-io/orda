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

	if req.Role == "admin" {
		return c.Status(fiber.StatusMethodNotAllowed).JSON(fiber.Map{"error": "admin can not be created"})
	} else if req.Role == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid role"})
	} else if req.Role != "user" {
		// TODO: add more roles via database
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid role"})
	}

	fmt.Printf("TODO: remove visible password from logs '%s'\n", req.Password)

	if req.Username == "admin" {
		return c.Status(fiber.StatusMethodNotAllowed).JSON(fiber.Map{"error": "admin can not be created"})
	}

	res, err := h.service.CreateUser(c.Context(), req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user"})
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
	current, _ := h.service.GetUserById(c.Context(), req.Id)
	// Prevent username "admin" to be updated
	if current.Username == "admin" && req.Username != "admin" {
		return c.Status(fiber.StatusMethodNotAllowed).JSON(fiber.Map{"error": "admin can not be updated"})
	}
	res, err := h.service.UpdateUser(c.Context(), req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to update user"})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *UserHandlers) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	u, _ := h.service.GetUserById(c.Context(), id)
	if u.Username == "admin" {
		return c.Status(fiber.StatusMethodNotAllowed).JSON(fiber.Map{"error": "admin can not be deleted"})
	}

	err := h.service.DeleteUser(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to delete user"})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "User deleted"})
}
