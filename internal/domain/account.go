package domain

import (
	"database/sql"
)

type DepositType uint8

const (
	DepositTypeFree DepositType = iota
	DepositTypePaid
)

type AccountGroup struct {
	Base
	Name     string
	Accounts []Account
}

type Account struct {
	Base
	Firstname       string
	Lastname        string
	Balance         int32
	AccountGroupID  string `gorm:"size:36"`
	LastDeposit     int32
	LastDepositType DepositType
	LastDepositTime sql.NullTime
	LastBalance     int32
	LastPayment     int32
	LastPaymentTime sql.NullTime
}
