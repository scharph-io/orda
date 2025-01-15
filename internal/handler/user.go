package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/service"
)

type UserHandler struct {
	UserService *service.UserService
}

func NewUserHandler(us *service.UserService) *UserHandler {
	return &UserHandler{UserService: us}
}

func (h *UserHandler) GetAllUsers(c *fiber.Ctx) error {
	res, err := h.UserService.GetAllUsers(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get users"})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *UserHandler) CreateUser(c *fiber.Ctx) error {
	req := service.UserRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user data"})
	}
	res, err := h.UserService.CreateUser(c.Context(), req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user"})
	}
	return c.Status(fiber.StatusCreated).JSON(res)
}

func (h *UserHandler) GetUserById(c *fiber.Ctx) error {
	return c.SendString("Get User by ID")
}

// func (h *UserHandler) UpdateUser(c *fiber.Ctx) error {
// 	req := service.UserRequest{}
// 	if err := c.BodyParser(&req); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user data"})
// 	}
// 	res, err := h.UserService.
// 	if err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user"})
// 	}
// 	return c.Status(fiber.StatusOK).JSON(res)
// }

func (h *UserHandler) DeleteUser(c *fiber.Ctx) error {
	id := c.Params("id")
	err := h.UserService.DeleteUser(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete user"})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "User deleted"})

}
