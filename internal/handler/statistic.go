package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/model"
)

func GetItemSumFromCurrentDate(c *fiber.Ctx) error {

	id := c.Params("id")
	db := database.DB
	var result int
	db.Model(&model.TransactionItem{}).Where("article_id = ?", id).Where("DATE(created_at) = CURDATE()").Select("SUM(`qty`)").Scan(&result)

	return c.JSON(&fiber.Map{"status": "success", "message": "Got items from current date", "data": result})
}
