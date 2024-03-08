package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/model"
)

// GetAllProducts query all products
func GetAllArticles(c *fiber.Ctx) error {
	db := database.DB
	var articles []model.Article
	db.Find(&articles)
	return c.JSON(articles)
}

// // GetProduct query product
// func GetProduct(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	db := database.DB
// 	var product model.Product
// 	db.Find(&product, id)
// 	if product.Title == "" {
// 		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "No product found with ID", "data": nil})
// 	}
// 	return c.JSON(fiber.Map{"status": "success", "message": "Product found", "data": product})
// }

// CreateProduct new product
func CreateArticle(c *fiber.Ctx) error {
	db := database.DB
	article := new(model.Article)
	if err := c.BodyParser(article); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't create article", "data": err})
	}
	db.Create(&article)
	return c.JSON(fiber.Map{"status": "success", "message": "Created product", "data": article})
}

// // DeleteProduct delete product
// func DeleteProduct(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	db := database.DB

// 	var product model.Product
// 	db.First(&product, id)
// 	if product.Title == "" {
// 		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "No product found with ID", "data": nil})
// 	}
// 	db.Delete(&product)
// 	return c.JSON(fiber.Map{"status": "success", "message": "Product successfully deleted", "data": nil})
// }
