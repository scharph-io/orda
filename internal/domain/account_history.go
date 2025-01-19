package domain

import (
	"database/sql"
	"fmt"
)

type HistoryAction uint8

const (
	HistoryPaymentAction HistoryAction = iota
	HistoryDepositAction
)

type AccountHistory struct {
	Base
	Amount         int32
	AccountID      sql.NullString `gorm:"size:36"`
	Account        Account
	AccountGroupID sql.NullString `gorm:"size:36"`
	AccountGroup   Group
	HistoryAction  HistoryAction
	DepositType    DepositType
	TransactionID  sql.NullString `gorm:"size:36"`
	Transaction    Transaction
	UserID         sql.NullString `gorm:"size:36"`
	User           User
}

func (h AccountHistory) ToString() string {
	return fmt.Sprintf(
		"Amount: %d, AccountID: %s, AccountGroupID: %s, HistoryAction: %d, DepositType: %d, TransactionID: %s, UserID: %s",
		h.Amount, h.Account.ID, h.AccountGroup.ID, h.HistoryAction, h.DepositType, h.Transaction.ID, h.User.ID)
}
