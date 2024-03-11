package handler

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/model"
)

// GetAllArticles query all Articles
func GetAllArticles(c *fiber.Ctx) error {
	db := database.DB
	var articles []model.Article
	db.Find(&articles)
	c.SendStatus(fiber.StatusOK)
	return c.JSON(articles)
}

// new article
func CreateArticle(c *fiber.Ctx) error {
	db := database.DB
	article := &model.Article{}
	if err := c.BodyParser(article); err != nil {
		fmt.Println(err)
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't create article", "data": err})
	}

	db.Create(&article)
	return c.JSON(fiber.Map{"status": "success", "message": "Created Article", "data": article})
}

// update article
func UpdateArticle(c *fiber.Ctx) error {
	id := c.Params("id")
	db := database.DB

	type UpdateArticleInput struct {
		Name   string `json:"name"`
		Desc   string `json:"desc"`
		Price  int32  `json:"price"`
		Active bool   `json:"active"`
	}
	var input UpdateArticleInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't update Article", "data": err})
	}
	var article model.Article
	db.Where("id = ?", id).First(&article)
	if article.Name == "" {
		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "No Article found with ID", "data": nil})
	}

	article.Name = input.Name
	article.Desc = input.Desc
	article.Price = input.Price
	article.Active = input.Active
	db.Save(&article)
	return c.JSON(fiber.Map{"status": "success", "message": "Article successfully updated", "data": article})
}

// delete article
func DeleteArticle(c *fiber.Ctx) error {
	id := c.Params("id")
	db := database.DB

	article, err := getArticle(id)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"status": "error", "message": err.Error(), "data": nil})
	}
	db.Delete(article)
	return c.JSON(fiber.Map{"status": "success", "message": "Article successfully deleted", "data": nil})
}

func getArticle(id string) (*model.Article, error) {
	db := database.DB
	var article model.Article
	db.Where("id = ?", id).First(&article)
	if article.Name == "" {
		return nil, fmt.Errorf("no article found with ID")
	}
	return &article, nil
}
