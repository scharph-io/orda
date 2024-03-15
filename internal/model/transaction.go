package model

import "gorm.io/gorm"

type Transaction struct {
	Base
	Items         []TransactionItem `json:"items" gorm:"constraint:OnDelete:CASCADE"`
	PaymentOption int8              `json:"payment_option"`
	AccountType   int8              `json:"account_type"`
	Total         int32             `json:"total"`
	// UserID        string            `json:"user_id"`
}

type TransactionItem struct {
	gorm.Model
	ID            uint   `gorm:"primarykey;autoIncrement:false"`
	TransactionID string `gorm:"size:36;primaryKey" json:"transaction_id"`
	Description   string `json:"description"`
	Qty           int32  `json:"qty"`
	Price         int32  `json:"price"`
}
