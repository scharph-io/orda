package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/model"
)

// GetAllCategories query all Categories
func GetAllCategories(c *fiber.Ctx) error {
	db := database.DB
	var categories []model.Category
	db.Model(&model.Category{}).Preload("Articles").Find(&categories)
	c.SendStatus(fiber.StatusOK)
	return c.JSON(categories)
}

func CreateCategory(c *fiber.Ctx) error {
	db := database.DB
	category := &model.Category{}
	if err := c.BodyParser(category); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't create category", "data": err})
	}

	db.Create(&category)
	c.SendStatus(fiber.StatusOK)
	return c.JSON(fiber.Map{"status": "success", "message": "Created Category", "data": category})
}

// UpdateCategory update category
func UpdateCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	db := database.DB

	type UpdateCategoryInput struct {
		Name string `json:"name"`
		Desc string `json:"desc"`
	}
	var input UpdateCategoryInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't update Category", "data": err})
	}
	var category model.Category
	db.First(&category, id)
	category.Name = input.Name
	category.Desc = input.Desc
	db.Save(&category)
	c.SendStatus(fiber.StatusOK)
	return c.JSON(fiber.Map{"status": "success", "message": "Category successfully updated", "data": category})
}

// DeleteCategory delete category
func DeleteCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	db := database.DB
	var category model.Category
	db.Where("id = ?", id).First(&category)
	if category.Name == "" {
		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "No Category found with ID", "data": nil})
	}
	if err := db.Delete(&category); err.Error != nil {
		return c.Status(fiber.StatusMethodNotAllowed).JSON(fiber.Map{"status": "error", "message": "Couldn't delete Category", "data": err})
	}
	c.SendStatus(fiber.StatusOK)
	return c.JSON(fiber.Map{"status": "success", "message": "Category successfully deleted", "data": nil})
}

// GetAllCategoryArticles query all articles in a category
func GetAllCategoryArticles(c *fiber.Ctx) error {
	id := c.Params("id")
	db := database.DB
	var articles []model.Article
	db.Where("category_id = ?", id).Find(&articles)
	c.SendStatus(fiber.StatusOK)
	return c.JSON(articles)
}
