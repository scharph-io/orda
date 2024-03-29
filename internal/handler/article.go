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
	db.Model(&model.Article{}).Order("position DESC").Find(&articles)
	c.SendStatus(fiber.StatusOK)
	return c.JSON(articles)
}

// new article
func CreateArticle(c *fiber.Ctx) error {
	db := database.DB
	article := &model.Article{}
	if err := c.BodyParser(article); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Couldn't create article", "data": err.Error()})
	}

	db.Create(&article)
	return c.JSON(fiber.Map{"status": "success", "message": "Created Article", "data": article})
}

func ImportArticles(c *fiber.Ctx) error {
	db := database.DB
	category_id := c.Query("categoryId")
	if category_id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Couldn't create article", "data": "categoryId is required"})
	}
	articles := &[]model.Article{}
	if err := c.BodyParser(articles); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Couldn't create article", "data": err})
	}

	// Add category id to slice
	for i := range *articles {
		(*articles)[i].CategoryID = category_id
		(*articles)[i].Active = true
	}

	db.Create(articles)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "Created Articles", "data": articles})
}

// update article
func UpdateArticle(c *fiber.Ctx) error {
	id := c.Params("id")
	db := database.DB

	type UpdateArticleInput struct {
		Name     string `json:"name"`
		Desc     string `json:"desc"`
		Price    int32  `json:"price"`
		Active   bool   `json:"active"`
		Position int32  `json:"position"`
	}
	var input UpdateArticleInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't update Article", "data": err.Error()})
	}
	var article model.Article
	db.Where("id = ?", id).First(&article)
	if article.Name == "" {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": "No Article found with ID", "data": nil})
	}

	article.Name = input.Name
	article.Desc = input.Desc
	article.Price = input.Price
	article.Active = input.Active
	article.Position = input.Position
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
