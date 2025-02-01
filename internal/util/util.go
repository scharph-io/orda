package util

import (
	"math/rand"
	"time"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"golang.org/x/crypto/bcrypt"
)

type PaymentOption uint8

const (
	PaymentOptionNone PaymentOption = iota
	PaymentOptionCash               // 1
	PaymentOptionCard               // 2
)

type AccountType uint8

const (
	AccountTypeCash    AccountType = iota
	AccountTypeFree                // 1
	AccountTypePremium             // 2
)

func PasswordGenerator(passwordLength int) string {
	// Character sets for generating passwords
	lowerCase := "abcdefghijklmnopqrstuvwxyz" // lowercase
	upperCase := "ABCDEFGHIJKLMNOPQRSTUVWXYZ" // uppercase
	numbers := "0123456789"                   // numbers

	// Variable for storing password
	password := ""

	// Initialize the random number generator
	source := rand.NewSource(time.Now().UnixNano())
	rng := rand.New(source)

	// Generate password character by character
	for n := 0; n < passwordLength; n++ {
		// Generate a random number to choose a character set
		randNum := rng.Intn(3)

		switch randNum {
		case 0:
			randCharNum := rng.Intn(len(lowerCase))
			password += string(lowerCase[randCharNum])
		case 1:
			randCharNum := rng.Intn(len(upperCase))
			password += string(upperCase[randCharNum])
		case 2:
			randCharNum := rng.Intn(len(numbers))
			password += string(numbers[randCharNum])
		}
	}

	return password
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func VerifyPassword(password, hash string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
}

func ToAccountResponse(account *domain.Account) *ports.AccountResponse {
	return &ports.AccountResponse{
		Id:              account.ID,
		Firstname:       account.Firstname,
		Lastname:        account.Lastname,
		MainBalance:     account.MainBalance,
		CreditBalance:   account.CreditBalance,
		LastDeposit:     account.LastDeposit,
		LastDepostType:  domain.DepositType(account.LastDepositType),
		LastDepositTime: account.LastDepositTime.Time.Format(time.RFC3339),
		LastBalance:     account.LastBalance,
	}
}
