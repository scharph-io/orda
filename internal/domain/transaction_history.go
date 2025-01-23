package domain

import "database/sql"

type TransactionHistory struct {
	Base
	TransactionID string
	Transaction   Transaction
	AccountID     sql.NullString `gorm:"size:36"`
	Account       Account
	Amount        int32
	UserID        string
	User          User
}
