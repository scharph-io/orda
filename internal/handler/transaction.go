package handler

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/model"
)

// TODO: Dont send any prices to to server, get and calculate them on the server side

func CreateTransaction(c *fiber.Ctx) error {
	db := database.DB

	type CheckoutItem struct {
		UUID  string `json:"uuid"`
		Name  string `json:"name"`  // TODO: Remove this
		Price int32  `json:"price"` // TODO: Remove this
		Qty   int32  `json:"quantity"`
		Desc  string `json:"desc"` // TODO: Remove this
	}

	type CheckoutData struct {
		Items         []CheckoutItem `json:"items"`
		Total         int32          `json:"total"` // TODO: Remove this
		PaymentOption int8           `json:"payment_option"`
		AccountType   int8           `json:"account_type"`
	}

	checkoutData := &CheckoutData{}
	if err := c.BodyParser(checkoutData); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't create transaction", "data": err})
	}

	items := []model.TransactionItem{}
	for i, item := range checkoutData.Items {

		desc := item.Name
		if item.Desc != "" {
			desc = fmt.Sprintf("%s - %s", item.Name, item.Desc)
		}
		items = append(items, model.TransactionItem{
			ID:          uint(i + 1),
			Description: desc,
			Price:       item.Price,
			Qty:         item.Qty,
		})
	}

	transaction := model.Transaction{
		Items:         items,
		PaymentOption: checkoutData.PaymentOption,
		AccountType:   checkoutData.AccountType,
		Total:         checkoutData.Total,
	}

	db.Create(&transaction)
	c.SendStatus(fiber.StatusOK)
	return c.JSON(fiber.Map{"status": "success", "message": "Created Transaction", "data": transaction})
}

func GetAllTransactions(c *fiber.Ctx) error {
	db := database.DB
	var transactions []model.Transaction
	if err := db.Model(&model.Transaction{}).Preload("Items").Find(&transactions).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't get transactions", "data": err})
	}
	c.SendStatus(fiber.StatusOK)
	return c.JSON(transactions)
}

func DeleteTransaction(c *fiber.Ctx) error {
	db := database.DB
	id := c.Params("id")
	var transaction model.Transaction
	if err := db.Where("id = ?", id).First(&transaction).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't find transaction", "data": err})
	}
	if err := db.Delete(&transaction).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't delete transaction", "data": err})
	}
	c.SendStatus(fiber.StatusOK)
	return c.JSON(fiber.Map{"status": "success", "message": "Deleted Transaction", "data": transaction})
}
