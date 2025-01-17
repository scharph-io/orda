package handlers

import (
	"fmt"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/database"
	model "github.com/scharph/orda/internal/domain"
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
			ProductID:   item.UUID,
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
	db := &TransactionDB{database.DB}

	paymentOption := c.Query("paymentOption")
	accountType := c.Query("accountType")
	updatedBeforeDays := c.Query("updatedBeforeDays")
	currentDate := c.Query("currentDate")

	var transactions []model.Transaction

	if paymentOption != "" {
		db = db.wherePaymentOption(paymentOption)
	}
	if accountType != "" {
		db = db.whereAccountType(accountType)
	}
	if updatedBeforeDays != "" {
		days, err := strconv.Atoi(updatedBeforeDays)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Invalid filter", "data": err})
		}
		db = db.whereUpdatedAt(time.Now().AddDate(0, 0, -1*days))
	} else if currentDate != "" {
		db = db.whereUpdatedAtCurrentDate()
	}

	if err := db.Limit(100).Preload("Items").Find(&transactions).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't get transactions", "data": err})
	}

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

func (db *TransactionDB) whereUpdatedAtCurrentDate() (tx *TransactionDB) {
	return &TransactionDB{DB: db.Where("DATE(updated_at) = CURDATE()")}
}
