package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/scharph/orda/internal/config"
	"github.com/scharph/orda/internal/model"
)

var DB *gorm.DB

// ConnectDB connect to db
func ConnectDB() {
	var err error

	// refer https://github.com/go-sql-driver/mysql#dsn-data-source-name for details
	// "user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.Config("DB_USER"),
		config.Config("DB_PASSWORD"),
		config.Config("DB_HOST"),
		config.Config("DB_PORT"),
		config.Config("DB_NAME"),
	)
	/*
		NOTE:
		To handle time.Time correctly, you need to include parseTime as a parameter. (more parameters)
		To fully support UTF-8 encoding, you need to change charset=utf8 to charset=utf8mb4. See this article for a detailed explanation
	*/
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Println("Failed to connect to mysql database. FALLBACK to SQLite\n", err)

		DB, err = gorm.Open(sqlite.Open("gorm.db"), &gorm.Config{})
		if err != nil {
			log.Fatal("Failed to connect to sqlite database. \n", err)
			os.Exit(2)
		}
	}

	fmt.Println("Connection Opened to Database")
	DB.AutoMigrate(&model.Category{}, &model.Article{}, &model.Transaction{}, &model.TransactionItem{})
	fmt.Println("Database Migrated")
}
