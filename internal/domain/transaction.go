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
	Items         []*TransactionItem `gorm:"constraint:OnDelete:CASCADE"`
	PaymentOption PaymentOption
	AccountType   AccountType
	Total         int32
	UserID        string         `gorm:"size:36"`
	User          User           `gorm:"foreignKey:UserID"`
	AccountID     sql.NullString `gorm:"size:36"`
	Account       Account        `gorm:"foreignKey:AccountID"`
}

type TransactionItem struct {
	TransactionID string `gorm:"primaryKey;index;size:36"`
	ProductID     string `gorm:"primaryKey;index;size:36"`
	Qty           int8
	Price         int32
}
