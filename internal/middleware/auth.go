package middleware

import (
	"log"
	"os"

	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/util"
)

func AuthInit() {
	initSessionConfig()

	db := database.DB

	var adminUser domain.User
	if db.Where("username = ?", "admin").First(&adminUser).RowsAffected == 0 {
		initialPassword := "admin"

		if os.Getenv("APP_ENV") == "production" {
			initialPassword = util.PasswordGenerator(30)
		}

		hashed, err := util.HashPassword(initialPassword)
		if err != nil {
			log.Fatalf("Error hashing password: %v\n", err)
		}

		if db.Create(&domain.User{
			Username: "admin",
			Password: hashed,
			Role: domain.Role{
				Name: "admin",
			},
		}).Error != nil {
			log.Fatalf("Error creating admin user: %v\n", err)
			panic(1)
		}
		log.Println("User and Role 'admin' created")
		log.Printf("Initial Password: '%s'", initialPassword)
	}
}
