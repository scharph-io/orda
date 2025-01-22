package domain

import (
	"database/sql"
	"fmt"
)

type DepositType uint8

const (
	DepositTypeFree DepositType = iota
	DepositTypePaid
)

type AccountGroup struct {
	Base
	Name     string
	Accounts Accounts
}

func (ag *AccountGroup) ToString() string {
	return fmt.Sprintf("[AccountGroup]: %s, ID: %s", ag.Name, ag.ID)
}

type Accounts []Account

func (a *Accounts) Print() {
	for _, account := range *a {
		fmt.Println(account.ToString())
	}
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

func (a *Account) ToString() string {
	return fmt.Sprintf("[Account] ID: %s, Name: %s %s, Balance: %d Time: %s", a.ID, a.Firstname, a.Lastname, a.Balance, a.LastDepositTime.Time.String())
}
