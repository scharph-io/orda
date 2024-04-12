package handler

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/model"
)

func GetAllGroups(c *fiber.Ctx) error {
	db := database.DB
	var groups []model.Group
	db.Model(&model.Group{}).Find(&groups)
	return c.Status(fiber.StatusOK).JSON(groups)
}

func CreateGroup(c *fiber.Ctx) error {
	db := database.DB
	group := &model.Group{}
	if err := c.BodyParser(group); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Couldn't create group", "data": err.Error()})
	}

	db.Create(&group)
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "message": "Created Group", "data": group})
}

func UpdateGroup(c *fiber.Ctx) error {
	id := c.Params("id")
	db := database.DB

	type UpdateGroupInput struct {
		Name string `json:"name"`
		Desc string `json:"desc"`
	}

	var input UpdateGroupInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Couldn't update group", "data": err.Error()})
	}

	var group model.Group
	db.First(&group, id)
	group.Name = input.Name
	db.Save(&group)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "Updated Group", "data": group})
}

func DeleteGroup(c *fiber.Ctx) error {
	id := c.Params("id")
	db := database.DB

	group, err := getGroup(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": err.Error()})
	}
	db.Delete(group)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "Deleted Group"})
}

func GetGroupProducts(c *fiber.Ctx) error {
	id := c.Params("id")
	db := database.DB
	var group model.Group
	db.Model(&model.Group{}).Preload("Products").First(&group, id)
	return c.Status(fiber.StatusOK).JSON(group.Products)
}

func getGroup(id string) (*model.Group, error) {
	db := database.DB
	var group model.Group
	db.Where("id = ?", id).First(&group, id)
	if group.Name == "" {
		return nil, fmt.Errorf("no product found with ID")
	}
	return &group, nil
}
