package util

import (
	"math/rand"
	"time"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"golang.org/x/crypto/bcrypt"
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
	for range passwordLength {
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
		LastDepositTime: account.LastDepositTime.Time,
		LastBalance:     account.LastBalance,
		GroupId:         account.AccountGroupID,
	}
}

// Map function for slices
func MapSlice[T any, U any](input []T, fn func(T) U) (res []U) {
	for _, v := range input {
		res = append(res, fn(v))
	}
	return res
}
