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
	if err := db.Model(&model.TransactionItem{}).Where("article_id = ?", id).Where("DATE(created_at) = CURDATE()").Select("SUM(`qty`)").Scan(&result).Error; err != nil {
		return c.Status(500).JSON(&fiber.Map{"status": "error", "message": "Couldn't get items from current date", "data": err})
	}
	return c.Status(200).JSON(result)
}
func GetTransactionsByPaymentOption(c *fiber.Ctx) error {
	paymentOption := c.Params("paymentOption")
	db := database.DB
	var transactions []model.Transaction
	if err := db.Where("payment_option = ?", paymentOption).Find(&transactions).Error; err != nil {
		return c.Status(500).JSON(&fiber.Map{"status": "error", "message": "Couldn't get transactions by payment option", "data": err})
	}
	return c.Status(200).JSON(transactions)
}

func GetTransactionsByAccountType(c *fiber.Ctx) error {
	accountType := c.Params("accountType")
	db := database.DB
	var transactions []model.Transaction
	if err := db.Where("account_type = ?", accountType).Find(&transactions).Error; err != nil {
		return c.Status(500).JSON(&fiber.Map{"status": "error", "message": "Couldn't get transactions by account type", "data": err})
	}
	return c.Status(200).JSON(transactions)
}
func GetArticleTransactionHistory(c *fiber.Ctx) error {
	db := database.DB

	type ArticleTransaction struct {
		ArticleId   string `json:"article_id"`
		Qty         int32  `json:"qty"`
		Description string `json:"description"`
	}

	var result []ArticleTransaction
	if err := db.Raw(database.Q_get_article_transaction_history).Scan(&result).Error; err != nil {
		return c.Status(500).JSON(&fiber.Map{"status": "error", "message": "Couldn't get article transaction history", "data": err})
	}
	return c.Status(200).JSON(result)
}

func GetDepositHistory(c *fiber.Ctx) error {
	db := database.DB

	type DepositHistory struct {
		DepositId string `json:"deposit_id"`
		Qty       int32  `json:"qty"`
	}

	var result []DepositHistory
	if err := db.Raw(database.Q_get_deposit_history).Scan(&result).Error; err != nil {
		return c.Status(500).JSON(&fiber.Map{"status": "error", "message": "Couldn't get deposit history", "data": err})
	}
	return c.Status(200).JSON(result)
}
