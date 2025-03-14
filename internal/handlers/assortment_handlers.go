package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/service"
)

type AssortmentHandlers struct {
	assortmentService *service.AssortmentService
}

func NewAssortmentHandler(service *service.AssortmentService) *AssortmentHandlers {
	return &AssortmentHandlers{service}
}

var _ ports.IAssortmentHandlers = (*AssortmentHandlers)(nil)

func (h *AssortmentHandlers) CreateGroup(c *fiber.Ctx) error {
	req := ports.ProductGroupRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid data"})
	}
	res, err := h.assortmentService.CreateProductGroup(c.Context(), req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to create group"})
	}

	return c.Status(fiber.StatusCreated).JSON(res)
}

func (h *AssortmentHandlers) ReadGroups(c *fiber.Ctx) error {
	res, err := h.assortmentService.ReadProductGroups(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get groups"})
	}
	if res == nil {
		return c.Status(fiber.StatusNoContent).JSON([]string{})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *AssortmentHandlers) ReadGroup(c *fiber.Ctx) error {
	id := c.Params("id")
	res, err := h.assortmentService.ReadProductGroup(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get group"})
	}
	if res == nil {
		return c.Status(fiber.StatusNoContent).JSON([]string{})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *AssortmentHandlers) UpdateGroup(c *fiber.Ctx) error {
	req := ports.ProductGroupRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid data"})
	}
	id := c.Params("id")
	res, err := h.assortmentService.UpdateProductGroup(c.Context(), id, req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to update group"})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *AssortmentHandlers) DeleteGroup(c *fiber.Ctx) error {
	id := c.Params("id")
	err := h.assortmentService.DeleteProductGroup(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to delete group"})
	}
	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{})
}

func (h *AssortmentHandlers) ReadProducts(c *fiber.Ctx) error {
	id := c.Params("id")
	res, err := h.assortmentService.ReadProductsGroupById(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to get products"})
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *AssortmentHandlers) AddProducts(c *fiber.Ctx) error {

	groupID := c.Params("id")

	products := []ports.ProductRequest{}
	result := 0
	if err := c.BodyParser(&products); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid data"})
	}
	err := h.assortmentService.AddProductsToGroup(c.Context(), groupID, products...)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to add products"})
	}
	result = len(products)
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": fmt.Sprintf("created %d product(s)", result)})
}

func (h *AssortmentHandlers) RemoveProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	err := h.assortmentService.RemoveProduct(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to remove product"})
	}
	fmt.Println("Removed", id)
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *AssortmentHandlers) ReadProductById(c *fiber.Ctx) error {
	id := c.Params("id")
	product, err := h.assortmentService.ReadProductById(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to read product"})
	}
	return c.Status(fiber.StatusOK).JSON(product)
}

func (h *AssortmentHandlers) UpdateProduct(c *fiber.Ctx) error {
	req := ports.ProductRequest{}
	productID := c.Params("id")
	if err := c.BodyParser(&req); err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid data"})
	}

	fmt.Println("Updating product:", req)

	req.ID = productID
	res, err := h.assortmentService.UpdateProduct(c.Context(), req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to update product"})
	}

	return c.Status(fiber.StatusOK).JSON(res)
}

func (h *AssortmentHandlers) ToggleProduct(c *fiber.Ctx) error {
	productID := c.Params("id")
	err := h.assortmentService.ToggleProduct(c.Context(), productID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to toggle product"})
	}
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *AssortmentHandlers) SetOrAddViews(c *fiber.Ctx) error {
	productID := c.Params("id")
	overwrite := c.QueryBool("overwrite", false)
	req := []*ports.ViewProductRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid data"})
	}

	if overwrite {
		err := h.assortmentService.SetProductViews(c.Context(), productID, req...)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to set views"})
		}
	} else {
		err := h.assortmentService.AddProductViews(c.Context(), productID, req...)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to add views"})
		}
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": fmt.Sprintf("%d Views updated successfully", len(req)),
	})
}

func (h *AssortmentHandlers) RemoveViews(c *fiber.Ctx) error {
	productID := c.Params("id")
	viewIds := []string{}
	if err := c.BodyParser(&viewIds); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid data"})
	}
	err := h.assortmentService.RemoveProductViews(c.Context(), productID, viewIds...)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to remove views"})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
