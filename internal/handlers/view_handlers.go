package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/ports"
)

type ViewHandlers struct {
	viewService ports.IViewService
}

func NewViewHandlers(service ports.IViewService) *ViewHandlers {
	return &ViewHandlers{service}
}

var _ ports.IViewHandlers = (*ViewHandlers)(nil)

func (h *ViewHandlers) Create(c *fiber.Ctx) error {
	req := ports.ViewRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid data"})
	}

	res, err := h.viewService.Create(c.Context(), req)
	if err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to create view"})
	}

	return c.Status(fiber.StatusCreated).JSON(res)
}

func (h *ViewHandlers) ReadMany(c *fiber.Ctx) error {
	res, err := h.viewService.ReadMany(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get views"})
	}
	if res == nil {
		return c.Status(fiber.StatusNoContent).JSON([]string{})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *ViewHandlers) ReadOne(c *fiber.Ctx) error {
	id := c.Params("id")
	res, err := h.viewService.ReadOne(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get view"})
	}
	if res == nil {
		return c.Status(fiber.StatusNoContent).JSON([]string{})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *ViewHandlers) Update(c *fiber.Ctx) error {
	req := ports.ViewRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid data"})
	}
	id := c.Params("id")
	res, err := h.viewService.Update(c.Context(), id, req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to update view"})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *ViewHandlers) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	err := h.viewService.Delete(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to delete view"})
	}
	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{})
}

func (h *ViewHandlers) SetRoles(c *fiber.Ctx) error {
	id := c.Params("id")
	roles := []string{}
	if err := c.BodyParser(&roles); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid data"})
	}
	err := h.viewService.SetRoles(c.Context(), id, roles...)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to add roles"})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Roles updated successfully"})
}

func (h *ViewHandlers) GetRoles(c *fiber.Ctx) error {
	id := c.Params("id")
	roles, err := h.viewService.GetRoles(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to get roles"})
	}
	return c.Status(fiber.StatusOK).JSON(roles)
}

func (h *ViewHandlers) RemoveRoles(c *fiber.Ctx) error {
	id := c.Params("id")
	roles := []string{}
	if err := c.BodyParser(&roles); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid data"})
	}
	err := h.viewService.RemoveRoles(c.Context(), id, roles...)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to remove roles"})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{})
}

func (h *ViewHandlers) SetOrAddProducts(c *fiber.Ctx) error {
	id := c.Params("id")
	overwrite := c.QueryBool("overwrite", false)
	req := []*ports.ViewProductRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid data"})
	}
	if overwrite {
		err := h.viewService.SetProducts(c.Context(), id, req...)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to set products"})
		}
	} else {
		err := h.viewService.AddProducts(c.Context(), id, req...)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to add products"})
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": fmt.Sprintf("%d Products updated successfully", len(req)),
	})
}

func (h *ViewHandlers) RemoveProducts(c *fiber.Ctx) error {
	id := c.Params("id")
	productIds := []string{}
	if err := c.BodyParser(&productIds); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid data"})
	}
	err := h.viewService.RemoveProducts(c.Context(), id, productIds...)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to remove products"})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{})
}
