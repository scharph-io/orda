package model

import (
	"fmt"

	"gorm.io/gorm"
)

type Transaction struct {
	gorm.Model
	TransactionNr string            `json:"transaction_nr"`
	Items         []TransactionItem `json:"items" gorm:"constraint:OnDelete:CASCADE"`
	PaymentOption int8              `json:"payment_option"`
	AccountType   int8              `json:"account_type"`
	Total         int32             `json:"total"`
	// UserID        string            `json:"user_id"`
	// User          User              `json:"user"`
}

func (t *Transaction) AfterCreate(tx *gorm.DB) (err error) {

	t.TransactionNr = fmt.Sprintf("%s.%d", t.CreatedAt.Format("20060102"), t.ID)
	if err := tx.Save(t).Error; err != nil {
		return err
	}

	return nil
}

type TransactionItem struct {
	gorm.Model
	ID            uint   `gorm:"primarykey;autoIncrement:false" json:"id"`
	TransactionID uint   `gorm:"primaryKey" json:"transaction_id"`
	Description   string `json:"description"`
	Qty           int32  `json:"qty"`
	Price         int32  `json:"price"`
	ProductID     string `gorm:"index" json:"product_id"`
}
