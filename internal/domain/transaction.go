package domain

import (
	"database/sql"
)

type PaymentOption uint8

const (
	PaymentOptionCash PaymentOption = iota
	PaymentOptionAccount
	PaymentOptionFree
	PaymentOptionSponsor
)

type Transaction struct {
	Base
	Items         []TransactionItem `gorm:"constraint:OnDelete:CASCADE"`
	PaymentOption PaymentOption
	Total         int32
	TotalCredit   int32
	UserID        string         `gorm:"size:36"`
	User          User           `gorm:"foreignKey:UserID"`
	AccountID     sql.NullString `gorm:"size:36"`
	Account       Account        `gorm:"foreignKey:AccountID"`
}

type TransactionItem struct {
	TransactionID string  `gorm:"primaryKey;index;size:36"`
	ProductID     string  `gorm:"primaryKey;index;size:36"`
	Product       Product `gorm:"foreignKey:ProductID"`
	Qty           int8
	Price         int32
}
