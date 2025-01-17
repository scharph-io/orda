package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/service"
)

type ViewHandler struct {
	ViewService *service.ViewService
}

func NewViewHandler(service *service.ViewService) *ViewHandler {
	return &ViewHandler{service}
}

func (h *ViewHandler) CreateView(c *fiber.Ctx) error {
	var view service.ViewRequest
	if err := c.BodyParser(&view); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}

	createdView, err := h.ViewService.CreateView(c.Context(), &view)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(createdView)
}

func (h *ViewHandler) GetViews(c *fiber.Ctx) error {
	views, err := h.ViewService.GetViews(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(views)
}

func (h *ViewHandler) GetViewById(c *fiber.Ctx) error {
	id := c.Params("id")
	view, err := h.ViewService.GetViewByIdDetail(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(view)
}

func (h *ViewHandler) UpdateView(c *fiber.Ctx) error {
	id := c.Params("id")
	var view service.ViewRequest
	if err := c.BodyParser(&view); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}

	updatedView, err := h.ViewService.UpdateView(c.Context(), id, &view)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(updatedView)
}

func (h *ViewHandler) DeleteView(c *fiber.Ctx) error {
	id := c.Params("id")
	res, err := h.ViewService.DeleteView(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}
	if res {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "View deleted"})
	} else {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "View not found"})
	}
}

func (h *ViewHandler) AddProducts(c *fiber.Ctx) error {
	id := c.Params("id")
	view, err := h.ViewService.GetViewById(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}
	var viewProducts []service.ViewProductRequest
	if err := c.BodyParser(&viewProducts); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}
	err = h.ViewService.AddProducts(c.Context(), id, &viewProducts)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": fmt.Sprintf("%d products added to view '%s'", len(viewProducts), view.Name)})
}

func (h *ViewHandler) RemoveProducts(c *fiber.Ctx) error {
	id := c.Params("id")
	view, err := h.ViewService.GetViewById(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}

	var viewProducts []service.ViewProductRequest
	if err := c.BodyParser(&viewProducts); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}

	err = h.ViewService.RemoveProducts(c.Context(), view.Id, &viewProducts)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": fmt.Sprintf("%d products removed from view '%s'", len(viewProducts), view.Name)})

}
