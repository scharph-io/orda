package domain

import (
	"database/sql"
	"fmt"
)

type AccountGroup struct {
	Base
	Name     string
	Accounts Accounts
}

func (ag *AccountGroup) ToString() string {
	return fmt.Sprintf("[AccountGroup]: %s, ID: %s\n", ag.Name, ag.ID)
}

type Accounts []Account

func (a *Accounts) Print() {
	for _, account := range *a {
		fmt.Println(account)
	}
}

type Account struct {
	Base
	Firstname       string
	Lastname        string
	MainBalance     int32
	CreditBalance   int32
	AccountGroupID  string `gorm:"size:36"`
	LastDeposit     int32
	LastDepositType DepositType
	LastDepositTime sql.NullTime
	LastBalance     int32
	LastPayment     int32
	LastPaymentTime sql.NullTime
}

func (a Account) String() string {
	return fmt.Sprintf("[Account] ID: %s, Name: %s %s, MainBalance: %d (Credit: %d) Time: %s", a.ID, a.Firstname, a.Lastname, a.MainBalance, a.CreditBalance, a.LastDepositTime.Time.String())
}
