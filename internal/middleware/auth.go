package middleware

import (
	"log"

	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/model"
	"github.com/scharph/orda/internal/util"
)

func AuthInit() {
	initSessionConfig()

	db := database.DB

	var adminUser model.User
	if db.Where("username = ?", "admin").First(&adminUser).RowsAffected == 0 {
		initialPassword := util.PasswordGenerator(18)
		log.Printf("Initial Password: %s", initialPassword)
		db.Create(&model.User{
			Username: "admin",
			Password: initialPassword,
			Role:     "admin",
		})
	}

}
