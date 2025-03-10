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

	fmt.Println(req)
	res, err := h.viewService.CreateView(c.Context(), req)
	if err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to create view"})
	}

	return c.Status(fiber.StatusCreated).JSON(res)
}

func (h *ViewHandlers) Read(c *fiber.Ctx) error {
	res, err := h.viewService.ReadViews(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get views"})
	}
	if res == nil {
		return c.Status(fiber.StatusNoContent).JSON([]string{})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *ViewHandlers) ReadByID(c *fiber.Ctx) error {
	id := c.Params("id")
	res, err := h.viewService.ReadView(c.Context(), id)
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
	res, err := h.viewService.UpdateView(c.Context(), id, req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to update view"})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *ViewHandlers) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	err := h.viewService.DeleteView(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to delete view"})
	}
	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{})
}

func (h *ViewHandlers) SetRoles(c *fiber.Ctx) error {
	id := c.Params("id")
	roleIds := c.Query("roles")
	err := h.viewService.SetRoles(c.Context(), id, roleIds)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to add roles"})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{})
}

func (h *ViewHandlers) AddProducts(c *fiber.Ctx) error {
	id := c.Params("id")
	req := []*ports.ViewProductRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid data"})
	}
	err := h.viewService.AddProducts(c.Context(), id, req...)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to add products"})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{})
}

func (h *ViewHandlers) RemoveProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	productId := c.Query("product_id")
	err := h.viewService.RemoveProduct(c.Context(), id, productId)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to remove product"})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{})
}
