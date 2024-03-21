package handler

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/model"
)

func GetItemSumFromCurrentDate(c *fiber.Ctx) error {

	id := c.Params("id")
	db := database.DB
	var result int
	if err := db.Model(&model.TransactionItem{}).Where("article_id = ?", id).Where("DATE(created_at) = CURDATE()").Select("SUM(`qty`)").Scan(&result).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{"status": "error", "message": "Couldn't get items from current date", "data": err})
	}
	return c.Status(fiber.StatusOK).JSON(result)
}
func GetTransactionsByPaymentOption(c *fiber.Ctx) error {
	paymentOption := c.Params("paymentOption")
	db := database.DB
	var transactions []model.Transaction
	if err := db.Where("payment_option = ?", paymentOption).Find(&transactions).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{"status": "error", "message": "Couldn't get transactions by payment option", "data": err})
	}
	return c.Status(fiber.StatusOK).JSON(transactions)
}

func GetTransactionsByAccountType(c *fiber.Ctx) error {
	accountType := c.Params("accountType")
	db := database.DB
	var transactions []model.Transaction
	if err := db.Where("account_type = ?", accountType).Find(&transactions).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{"status": "error", "message": "Couldn't get transactions by account type", "data": err})
	}
	return c.Status(fiber.StatusOK).JSON(transactions)
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
		return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{"status": "error", "message": "Couldn't get article transaction history", "data": err})
	}
	return c.Status(fiber.StatusOK).JSON(result)
}

func GetDepositHistory(c *fiber.Ctx) error {
	db := database.DB

	type DepositHistory struct {
		DepositIn  int32 `json:"deposit_in"`
		DepositOut int32 `json:"deposit_out"`
	}

	var result []DepositHistory
	if err := db.Raw(database.Q_get_deposit_history).Scan(&result).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{"status": "error", "message": "Couldn't get deposit history", "data": err})
	}
	return c.Status(fiber.StatusOK).JSON(result)
}

func GetStatistics(c *fiber.Ctx) error {
	db := database.DB
	type DepositHistory struct {
		DepositIn  int32 `json:"deposit_in"`
		DepositOut int32 `json:"deposit_out"`
	}

	var total int
	if err := db.Model(&model.Transaction{}).Select("SUM(total)").Find(&total).Error; err != nil {
		total = 0
	}

	var depositHistory DepositHistory
	if err := db.Raw(database.Q_get_deposit_history).Scan(&depositHistory).Error; err != nil {
		depositHistory = DepositHistory{0, 0}
	}

	paymentOption0, _ := GetPaymentOptionTotal(0)
	paymentOption1, _ := GetPaymentOptionTotal(1)
	paymentOption2, _ := GetPaymentOptionTotal(2)

	accountType0, _ := GetAccountTypeTotal(0)
	accountType1, _ := GetAccountTypeTotal(1)
	accountType2, _ := GetAccountTypeTotal(2)

	return c.Status(fiber.StatusOK).JSON(
		fiber.Map{
			"total":          total,
			"deposit":        depositHistory,
			"payment_option": []int{paymentOption0, paymentOption1, paymentOption2},
			"account_type":   []int{accountType0, accountType1, accountType2},
		})
}

func GetStatisticsByDate(c *fiber.Ctx) error {
	date := c.Query("date")
	if date == "" {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{"status": "error", "message": "Date is required"})
	}

	fmt.Println(date)
	t, err := time.Parse("14.03.2024, 00:00:00", date)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{"status": "error", "message": "Invalid date format"})
	}

	fmt.Println(t)

	// db := database.DB
	// type DepositHistory struct {
	// 	DepositIn  int32 `json:"deposit_in"`
	// 	DepositOut int32 `json:"deposit_out"`
	// }

	// var total int
	// if err := db.Model(&model.Transaction{}).Select("SUM(total)").Where("DATE(created_at) = DATE(?)").Find(&total).Error; err != nil {
	// 	total = 0
	// }

	// var depositHistory DepositHistory
	// if err := db.Raw(database.Q_get_deposit_history).Scan(&depositHistory).Error; err != nil {
	// 	depositHistory = DepositHistory{0, 0}
	// }

	// paymentOption0, _ := GetPaymentOptionTotal(0)
	// paymentOption1, _ := GetPaymentOptionTotal(1)
	// paymentOption2, _ := GetPaymentOptionTotal(2)

	// accountType0, _ := GetAccountTypeTotal(0)
	// accountType1, _ := GetAccountTypeTotal(1)
	// accountType2, _ := GetAccountTypeTotal(2)

	// return c.Status(fiber.StatusOK).JSON(
	// 	fiber.Map{
	// 		"total":          total,
	// 		"deposit":        depositHistory,
	// 		"payment_option": []int{paymentOption0, paymentOption1, paymentOption2},
	// 		"account_type":   []int{accountType0, accountType1, accountType2},
	// 	})

	return nil
}

func GetPaymentOptionTotal(option uint) (int, error) {
	db := database.DB
	var total int
	if err := db.Model(&model.Transaction{}).Where("payment_option = ?", option).Select("SUM(total)").Find(&total).Error; err != nil {
		return 0, nil
	}
	return total, nil
}

func GetAccountTypeTotal(option uint) (int, error) {
	db := database.DB
	var total int
	if err := db.Model(&model.Transaction{}).Where("account_type = ?", option).Select("SUM(total)").Find(&total).Error; err != nil {
		return 0, nil
	}
	return total, nil
}
