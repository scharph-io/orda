package domain

import "database/sql"

type PaymentOption int8
type AccountType int8

const (
	PaymentMethodNone PaymentOption = 0
	PaymentMethodCash PaymentOption = 1
	PaymentOptionCard PaymentOption = 2

	AccountTypeAnonymous AccountType = 0
	AccountTypePool      AccountType = 1
)

type Transaction struct {
	Base
	Items         []TransactionItem `gorm:"constraint:OnDelete:CASCADE"`
	PaymentOption PaymentOption
	AccountType   AccountType
	Total         int32
	UserID        string         `gorm:"size:36"`
	AccountID     sql.NullString `gorm:"size:36"`
}

type TransactionItem struct {
	TransactionID string `gorm:"primaryKey,size:36"`
	ProductID     string `gorm:"index"`
	Description   string
	Qty           int8
	Price         int32
}
