package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/ports"
)

type RoleHandlers struct {
	roleService ports.IRoleService
}

var _ ports.IRoleHandlers = (*RoleHandlers)(nil)

func NewRoleHandlers(roleService ports.IRoleService) *RoleHandlers {
	return &RoleHandlers{roleService}
}

func (h *RoleHandlers) Create(c *fiber.Ctx) error {
	req := ports.RoleRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid role data"})
	}

	res, err := h.roleService.Create(c.Context(), req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(res)
}

func (h *RoleHandlers) GetAll(c *fiber.Ctx) error {
	res, err := h.roleService.GetAll(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get roles"})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *RoleHandlers) GetOne(c *fiber.Ctx) error {
	id := c.Params("id")
	res, err := h.roleService.GetById(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to get role"})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *RoleHandlers) Update(c *fiber.Ctx) error {
	req := ports.RoleRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid role data"})
	}

	req.Id = c.Params("id")

	role, err := h.roleService.GetById(c.Context(), req.Id)
	if role.Name == "admin" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot update admin role"})
	}

	res, err := h.roleService.Update(c.Context(), req.Id, req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *RoleHandlers) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	role, err := h.roleService.GetById(c.Context(), id)
	if role.Name == "admin" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot update admin role"})
	}
	res, err := h.roleService.Delete(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": fmt.Sprintf("Failed to delete role: %s", err)})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": res})
}
