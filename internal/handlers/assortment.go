package handlers

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/service"
)

type AssortmentHandler struct {
	assortmentService *service.AssortmentService
}

func NewAssortmentHandler(service *service.AssortmentService) *AssortmentHandler {
	return &AssortmentHandler{service}
}

func (h *AssortmentHandler) GetGroups(c *fiber.Ctx) error {
	groups, err := h.assortmentService.GetGroups(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(groups)
}

func (h *AssortmentHandler) GetGroupById(c *fiber.Ctx) error {
	id := c.Params("id")
	group, err := h.assortmentService.GetGroup(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(group)
}

func (h *AssortmentHandler) CreateGroup(c *fiber.Ctx) error {
	var group service.GroupRequest
	if err := c.BodyParser(&group); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}

	createdGroup, err := h.assortmentService.CreateGroup(c.Context(), group)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(createdGroup)
}

func (h *AssortmentHandler) UpdateGroup(c *fiber.Ctx) error {
	id := c.Params("id")
	var group service.GroupRequest
	if err := c.BodyParser(&group); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}

	log.Printf("group: %s", group.Desc)
	updatedGroup, err := h.assortmentService.UpdateGroup(c.Context(), id, group)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(updatedGroup)
}

func (h *AssortmentHandler) DeleteGroup(c *fiber.Ctx) error {
	id := c.Params("id")
	deleted, err := h.assortmentService.DeleteGroup(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}
	if !deleted {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "group not found"})
	}
	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{})
}

func (h *AssortmentHandler) GetProducts(c *fiber.Ctx) error {
	group_id := c.Query("group_id")
	if group_id == "" {
		products, err := h.assortmentService.GetProducts(c.Context())
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
		}
		return c.Status(fiber.StatusOK).JSON(products)
	}
	products, err := h.assortmentService.GetGroupProducts(c.Context(), group_id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(products)
}

func (h *AssortmentHandler) CreateProduct(c *fiber.Ctx) error {
	var product service.ProductRequest
	if err := c.BodyParser(&product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}

	createdProduct, err := h.assortmentService.CreateProduct(c.Context(), product)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(createdProduct)
}

func (h *AssortmentHandler) UpdateProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	var product service.ProductRequest
	if err := c.BodyParser(&product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}

	updatedProduct, err := h.assortmentService.UpdateProduct(c.Context(), id, product)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(updatedProduct)
}

func (h *AssortmentHandler) DeleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	deleted, err := h.assortmentService.DeleteProduct(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}
	if !deleted {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "product not found"})
	}
	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{})
}

func (h *AssortmentHandler) DeleteProductsByGroup(c *fiber.Ctx) error {
	group_id := c.Params("id")
	deleted, err := h.assortmentService.DeleteAllProductsByGroup(c.Context(), group_id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": err.Error()})
	}
	if !deleted {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "products not found"})
	}
	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{})
}
