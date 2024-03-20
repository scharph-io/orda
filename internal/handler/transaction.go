package handler

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/model"
	"gorm.io/gorm"
)

type TransactionDB struct {
	*gorm.DB
}

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
			ArticleID:   item.UUID,
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

func GetTransactionsLast2Days(c *fiber.Ctx) error {
	db := TransactionDB{database.DB.Model(&model.Transaction{})}

	var transactions []model.Transaction
	if err := db.whereUpdatedAt(time.Now().AddDate(0, 0, -2)).Preload("Items").Find(&transactions).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't get transactions", "data": err})
	}
	return c.Status(fiber.StatusOK).JSON(transactions)
}

func GetTransactionsByFilter(c *fiber.Ctx) error {
	db := TransactionDB{database.DB}

	paymentOption := c.Query("paymentOption")
	accountType := c.Query("accountType")

	var transactions []model.Transaction

	db.whereAccountType("1").wherePaymentOption("1").Find(&transactions)

	if paymentOption != "" && accountType != "" {
		if err := db.whereAccountType(accountType).wherePaymentOption(paymentOption).Preload("Items").Find(&transactions).Error; err != nil {
			return c.Status(500).JSON(err)
		}
	} else if paymentOption != "" {
		if err := db.wherePaymentOption(paymentOption).Preload("Items").Find(&transactions).Error; err != nil {
			return c.Status(500).JSON(err)
		}
	} else if accountType != "" {
		if err := db.whereAccountType(accountType).Preload("Items").Find(&transactions).Error; err != nil {
			return c.Status(500).JSON(err)
		}
	} else {
		return GetAllTransactions(c)
	}

	fmt.Println(len(transactions), "option:", paymentOption, "type", accountType)
	return c.Status(fiber.StatusOK).JSON(transactions)
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
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "Deleted Transaction", "data": transaction})
}

func (db *TransactionDB) wherePaymentOption(opt string) (tx *TransactionDB) {
	return &TransactionDB{DB: db.Where("payment_option = ?", opt)}
}

func (db *TransactionDB) whereAccountType(typ string) (tx *TransactionDB) {
	return &TransactionDB{DB: db.Where("account_type = ?", typ)}
}

func (db *TransactionDB) whereUpdatedAt(updatedAt time.Time) (tx *TransactionDB) {
	return &TransactionDB{DB: db.Where("updated_at > ?", updatedAt.Format("2006-01-02 15:04:05"))}
}
