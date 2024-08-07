package handler

// import (
// 	"encoding/json"

// 	"github.com/gofiber/fiber/v2"
// 	"github.com/scharph/orda/internal/database"
// 	"github.com/scharph/orda/internal/model"
// 	"gorm.io/gorm"
// 	"gorm.io/gorm/clause"
// )

// type CategoryDB struct {
// 	*gorm.DB
// }

// // GetAllCategories query all Categories
// func GetAllCategories(c *fiber.Ctx) error {
// 	// TODO: Workaround for query parameter
// 	user := c.Query("user")
// 	db := CategoryDB{database.DB}
// 	var categories []model.Category

// 	if user == "admin" {
// 		db.Model(&model.Category{}).Order("position").Preload("Articles", func(db *gorm.DB) *gorm.DB {
// 			return (&CategoryDB{db}).ProductSort()
// 		}).Find(&categories)
// 	} else if user != "" {
// 		db.Model(&model.Category{}).Where(&model.Category{Desc: user}).Order("position").Preload("Articles", func(db *gorm.DB) *gorm.DB {
// 			return (&CategoryDB{db}).ProductSort()
// 		}).Find(&categories).Find(&categories)
// 	} else {
// 		db.Model(&model.Category{}).Order("position").Preload("Articles", func(db *gorm.DB) *gorm.DB {
// 			return (&CategoryDB{db}).ProductSort()
// 		}).Find(&categories)
// 	}
// 	return c.Status(fiber.StatusOK).JSON(categories)
// }

// func CreateCategory(c *fiber.Ctx) error {
// 	db := database.DB
// 	category := &model.Category{}
// 	if err := c.BodyParser(category); err != nil {
// 		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't create category", "data": err})
// 	}

// 	db.Create(&category)
// 	c.SendStatus(fiber.StatusOK)
// 	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "Created Category", "data": category})
// }

// // UpdateCategory update category
// func UpdateCategory(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	db := database.DB

// 	type UpdateCategoryInput struct {
// 		Name        string `json:"name"`
// 		Desc        string `json:"desc"`
// 		Position    uint   `json:"position"`
// 		Color       string `json:"color"`
// 		WithDeposit bool   `json:"withDeposit"`
// 		Deposit     int32  `json:"deposit"`
// 	}
// 	var input UpdateCategoryInput
// 	if err := c.BodyParser(&input); err != nil {
// 		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't update Category", "data": err})
// 	}

// 	var category model.Category
// 	db.Where("id = ?", id).First(&category)
// 	if category.Name == "" {
// 		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "No Product found with ID", "data": nil})
// 	}

// 	category.Name = input.Name
// 	category.Desc = input.Desc
// 	category.Position = input.Position
// 	category.Color = input.Color
// 	category.Deposit = input.Deposit

// 	db.Save(&category)
// 	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "Category successfully updated", "data": category})
// }

// // DeleteCategory delete category
// func DeleteCategory(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	db := database.DB
// 	var category model.Category
// 	db.Where("id = ?", id).First(&category)
// 	if category.Name == "" {
// 		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "No Category found with ID", "data": nil})
// 	}
// 	if err := db.Delete(&category); err.Error != nil {
// 		return c.Status(fiber.StatusMethodNotAllowed).JSON(fiber.Map{"status": "error", "message": "Couldn't delete Category", "data": err})
// 	}
// 	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "Category successfully deleted", "data": nil})
// }

// // GetAllCategoryProducts query all products in a category
// func GetAllCategoryProducts(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	db := CategoryDB{database.DB}

// 	var product []model.Product
// 	db.ProductSort().Where("category_id = ?", id).Find(&product)
// 	return c.Status(fiber.StatusOK).JSON(product)
// }

// func GetAllCategoryProductsAsFile(c *fiber.Ctx) error {
// 	type ExportProduct struct {
// 		Name  string `json:"name"`
// 		Desc  string `json:"desc"`
// 		Price int32  `json:"price"`
// 	}

// 	id := c.Params("id")
// 	db := database.DB
// 	var products []model.Product
// 	db.Where("category_id = ?", id).Select("name", "desc", "price").Find(&products)

// 	var export []ExportProduct
// 	for _, a := range products {
// 		export = append(export, ExportProduct{Name: a.Name, Desc: a.Desc, Price: a.Price})
// 	}

// 	data, _ := json.MarshalIndent(export, "", " ")
// 	c.Set(fiber.HeaderContentDisposition, "attachment; filename=name.json")
// 	return c.Status(fiber.StatusOK).Send(data)
// }

// func (db *CategoryDB) ProductSort() *gorm.DB {
// 	return db.Order("position DESC").Order("name").Order(clause.OrderByColumn{Column: clause.Column{Name: "desc"}, Desc: true})
// }
