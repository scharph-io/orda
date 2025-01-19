package domain

type TransactionHistory struct {
	Base
	TransactionID string
	Transaction   Transaction
	AccountID     string
	Account       Account
	Amount        int32
	UserID        string
	User          User
}
