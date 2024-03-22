package handler

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/model"
	"github.com/scharph/orda/internal/util"
)

type DepositHistory struct {
	DepositIn  int32 `json:"deposit_in"`
	DepositOut int32 `json:"deposit_out"`
}

type TransactionStatistic struct {
	Total         int32          `json:"total"`
	Deposit       DepositHistory `json:"deposit"`
	PaymentOption []int          `json:"payment_option"`
	AccountType   []int          `json:"account_type"`
	Date          string         `json:"date"`
}

type ArticleTransaction struct {
	ArticleId   string `json:"article_id"`
	Qty         int32  `json:"qty"`
	Description string `json:"description"`
}

func GetArticleStatistic(c *fiber.Ctx) error {
	date := c.Query("date")
	if date == "" {
		return c.Status(fiber.StatusOK).JSON(getArticleStatistic())
	}
	t, err := time.Parse(time.RFC3339, date)
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println("XXX", t.Local().Format(time.DateOnly))

	return c.Status(fiber.StatusOK).JSON(getDateArticleStatistic(t.Local().Format(time.DateOnly)))
}

func getArticleStatistic() []ArticleTransaction {
	var result []ArticleTransaction
	if err := database.DB.Raw(database.Q_get_article_transaction_history).Scan(&result).Error; err != nil {
		return []ArticleTransaction{}
	}
	return result
}

func getDateArticleStatistic(date string) []ArticleTransaction {
	var result []ArticleTransaction
	if err := database.DB.Raw(database.Q_get_article_transaction_history_date, date).Scan(&result).Error; err != nil {
		return []ArticleTransaction{}
	}
	return result
}

func GetStatistics(c *fiber.Ctx) error {

	date := c.Query("date")
	if date == "" {
		return c.Status(fiber.StatusOK).JSON(getOverallStatistic())
	}
	t, err := time.Parse(time.RFC3339, date)
	if err != nil {
		fmt.Println(err)
	}

	return c.Status(fiber.StatusOK).JSON(getDateStatistic(t.Local().Format(time.DateOnly)))

}

func getPaymentOptionTotal(option uint, date ...string) (int, error) {
	db := database.DB.Model(&model.Transaction{}).Where("payment_option = ?", option)
	if len(date) > 0 {
		db = db.Where("DATE(created_at) = DATE(?)", date[0])
	}
	var total int
	if err := db.Select("SUM(total)").Find(&total).Error; err != nil {
		return 0, nil
	}
	return total, nil
}

func getAccountTypeTotal(option uint, date ...string) (int, error) {
	db := database.DB.Model(&model.Transaction{}).Where("account_type = ?", option)
	if len(date) > 0 {
		db = db.Where("DATE(created_at) = DATE(?)", date[0])
	}
	var total int
	if err := db.Select("SUM(total)").Find(&total).Error; err != nil {
		return 0, nil
	}
	return total, nil
}

func getDateStatistic(date string) TransactionStatistic {
	db := database.DB
	var total int32
	if err := db.Model(&model.Transaction{}).Select("SUM(total)").Where("DATE(created_at) = DATE(?)", date).Find(&total).Error; err != nil {
		total = 0
	}

	var depositHistory DepositHistory
	if err := db.Raw(database.Q_get_deposit_history_date, date).Scan(&depositHistory).Error; err != nil {
		depositHistory = DepositHistory{0, 0}
	}

	paymentOptionNone, _ := getPaymentOptionTotal(uint(util.PaymentOptionNone), date)
	PaymentOptionCash, _ := getPaymentOptionTotal(uint(util.PaymentOptionCash), date)
	paymentOptionCard, _ := getPaymentOptionTotal(uint(util.PaymentOptionCard), date)

	accountTypeFree, _ := getAccountTypeTotal(uint(util.AccountTypeFree), date)
	accountTypeCash, _ := getAccountTypeTotal(uint(util.AccountTypeCash), date)
	accountTypePremium, _ := getAccountTypeTotal(uint(util.AccountTypePremium), date)

	return TransactionStatistic{
		Total:   total,
		Deposit: depositHistory,
		PaymentOption: []int{
			paymentOptionNone,
			PaymentOptionCash,
			paymentOptionCard,
		},
		AccountType: []int{
			accountTypeCash,
			accountTypeFree,
			accountTypePremium,
		},
		Date: date,
	}
}

func getOverallStatistic() TransactionStatistic {
	db := database.DB
	var total int32
	if err := db.Model(&model.Transaction{}).Select("SUM(total)").Find(&total).Error; err != nil {
		total = 0
	}

	var depositHistory DepositHistory
	if err := db.Raw(database.Q_get_deposit_history).Scan(&depositHistory).Error; err != nil {
		depositHistory = DepositHistory{0, 0}
	}

	paymentOptionNone, _ := getPaymentOptionTotal(uint(util.PaymentOptionNone))
	PaymentOptionCash, _ := getPaymentOptionTotal(uint(util.PaymentOptionCash))
	paymentOptionCard, _ := getPaymentOptionTotal(uint(util.PaymentOptionCard))

	accountTypeFree, _ := getAccountTypeTotal(uint(util.AccountTypeFree))
	accountTypeCash, _ := getAccountTypeTotal(uint(util.AccountTypeCash))
	accountTypePremium, _ := getAccountTypeTotal(uint(util.AccountTypePremium))

	return TransactionStatistic{
		Total:   total,
		Deposit: depositHistory,
		PaymentOption: []int{
			paymentOptionNone,
			PaymentOptionCash,
			paymentOptionCard,
		},
		AccountType: []int{
			accountTypeCash,
			accountTypeFree,
			accountTypePremium,
		},
	}
}
