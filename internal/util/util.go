package util

type PaymentOption uint

const (
	PaymentOptionNone PaymentOption = iota
	PaymentOptionCash               // 1
	PaymentOptionCard               // 2
)

type AccountType uint

const (
	AccountTypeCash    AccountType = iota
	AccountTypeFree                // 1
	AccountTypePremium             // 2
)
