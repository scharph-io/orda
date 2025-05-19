package domain

import (
	"database/sql"
	"fmt"
)

type HistoryAction uint8
type DepositType uint8

const (
	HistoryDebitAction HistoryAction = iota
	HistoryDepositAction
	HistoryCorrectionAction
	HistoryBalanceResetAction
)

const (
	DepositTypeFree DepositType = iota
	DepositTypeCash
)

type AccountHistory struct {
	Base
	Amount         int32
	AccountID      sql.NullString `gorm:"size:36"`
	Account        Account
	AccountGroupID sql.NullString `gorm:"size:36"`
	AccountGroup   AccountGroup
	HistoryAction  HistoryAction
	DepositType    DepositType
	TransactionID  sql.NullString `gorm:"size:36"`
	Transaction    Transaction
	UserID         string `gorm:"size:36"`
	User           User
	Reason         string
}

func (h AccountHistory) ToString() string {
	return fmt.Sprintf(
		"Amount: %d, AccountID: %s, AccountGroupID: %s, HistoryAction: %d, DepositType: %d, TransactionID: %s, UserID: %s",
		h.Amount, h.Account.ID, h.AccountGroup.ID, h.HistoryAction, h.DepositType, h.Transaction.ID, h.User.ID)
}
