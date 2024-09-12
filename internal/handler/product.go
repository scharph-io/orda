package handler

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/model"
)

// GetAllProducts query all Products
func GetAllProducts(c *fiber.Ctx) error {
	db := database.DB
	var products []model.Product
	db.Model(&model.Product{}).Order("position DESC").Find(&products)
	c.SendStatus(fiber.StatusOK)
	return c.JSON(products)
}

// new product
func CreateProduct(c *fiber.Ctx) error {
	db := database.DB
	product := &model.Product{}
	if err := c.BodyParser(product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Couldn't create product", "data": err.Error()})
	}

	db.Create(&product)
	return c.JSON(fiber.Map{"status": "success", "message": "Created Product", "data": product})
}

func ImportProducts(c *fiber.Ctx) error {
	db := database.DB
	category_id := c.Query("categoryId")
	if category_id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Couldn't create product", "data": "categoryId is required"})
	}
	products := &[]model.Product{}
	if err := c.BodyParser(products); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Couldn't create product", "data": err})
	}

	// TODO: Add category id to slice
	// Add category id to slice
	// for i := range *products {
	// (*products)[i].GroupID = category_id
	// (*products)[i].Active = true
	// }

	db.Create(products)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "Created Products", "data": products})
}

// update product
func UpdateProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	db := database.DB

	type UpdateProductInput struct {
		Name     string `json:"name"`
		Desc     string `json:"desc"`
		Price    int32  `json:"price"`
		Active   bool   `json:"active"`
		Position int32  `json:"position"`
	}
	var input UpdateProductInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't update Product", "data": err.Error()})
	}
	var product model.Product
	db.Where("id = ?", id).First(&product)
	if product.Name == "" {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": "No Product found with ID", "data": nil})
	}

	product.Name = input.Name
	product.Desc = input.Desc
	product.Price = input.Price
	// product.Active = input.Active
	db.Save(&product)
	return c.JSON(fiber.Map{"status": "success", "message": "Product successfully updated", "data": product})
}

// delete product
func DeleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	db := database.DB

	product, err := getProduct(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": err.Error(), "data": nil})
	}
	db.Delete(product)
	return c.JSON(fiber.Map{"status": "success", "message": "Product successfully deleted", "data": nil})
}

func getProduct(id string) (*model.Product, error) {
	db := database.DB
	var product model.Product
	db.Where("id = ?", id).First(&product)
	if product.Name == "" {
		return nil, fmt.Errorf("no product found with ID")
	}
	return &product, nil
}
