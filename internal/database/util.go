package database

import (
	"fmt"
	"math/rand"

	"github.com/scharph/orda/internal/model"
	"github.com/scharph/orda/internal/util"
)

func ValidUser(id string, p string) bool {
	var user model.User
	DB.First(&user, id)
	if user.Username == "" {
		return false
	}
	if !util.CheckPasswordHash(p, user.Password) {
		return false
	}
	return true
}

func initUser(username, pass, roles string) error {
	pw, err := util.HashPassword(pass)
	if err != nil {
		return err
	}

	err = DB.Create(&model.User{
		Username: username,
		Password: pw,
		Roles:    roles,
	}).Error
	if err != nil {
		fmt.Printf("%s user already exists", username)
		return err
	}
	return nil
}

func randomPassword() string {
	n := 10
	var letters = []rune("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}
