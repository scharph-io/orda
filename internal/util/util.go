package util

import "github.com/scharph/orda/internal/config"

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

const (
	default_pw = "secret"
)

func GetPasswordFromEnv(key string) string {
	pw := config.Config(key)
	if pw == "" {
		return default_pw
	}
	return pw
}
