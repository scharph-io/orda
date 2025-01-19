package middleware

import (
	"log"

	"github.com/scharph/orda/internal/database"
	model "github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/util"
)

func AuthInit() {
	initSessionConfig()

	db := database.DB

	var adminUser model.User
	if db.Where("username = ?", "admin").First(&adminUser).RowsAffected == 0 {
		initialPassword := util.PasswordGenerator(30)

		hashed, err := util.HashPassword(initialPassword)
		if err != nil {
			log.Fatalf("Error hashing password: %v", err)
		}

		if db.Create(&model.Role{
			Name: "admin",
		}).Error != nil {
			log.Fatalln("Error creating admin role: %v")
			panic(1)
		}
		log.Println("Role 'admin' created")

		if db.Create(&model.User{
			Username: "admin",
			Password: hashed,
			Role:     "admin",
		}).Error != nil {
			log.Fatalln("Error creating admin user: %v")
			panic(1)
		}
		log.Println("User 'admin' created")
		log.Printf("Initial Password: '%s'", initialPassword)

	}

}
