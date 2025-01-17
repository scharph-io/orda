package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/scharph/orda/internal/config"
	model "github.com/scharph/orda/internal/domain"
)

var DB *gorm.DB

// ConnectDB connect to db
func ConnectDB() {
	var err error

	c := config.GetConfig().Database

	// refer https://github.com/go-sql-driver/mysql#dsn-data-source-name for details
	// "user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		c.User,
		c.Password,
		c.Host,
		c.Port,
		c.Name,
	)
	/*
		NOTE:
		To handle time.Time correctly, you need to include parseTime as a parameter. (more parameters)
		To fully support UTF-8 encoding, you need to change charset=utf8 to charset=utf8mb4. See this product for a detailed explanation
	*/

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold:             time.Second, // Slow SQL threshold
			LogLevel:                  logger.Warn, // Log level
			IgnoreRecordNotFoundError: true,        // Ignore ErrRecordNotFound error for logger
			ParameterizedQueries:      true,        // Don't include params in the SQL log
			Colorful:                  true,        // Disable color
		},
	)

	log.Println(dsn)
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})

	if err != nil {
		log.Println("Failed to connect to mysql database. FALLBACK to SQLite\n", err)

		DB, err = gorm.Open(sqlite.Open("orda-local.db"), &gorm.Config{})
		if err != nil {
			log.Fatal("Failed to connect to sqlite database. \n", err)
			os.Exit(2)
		}
	}

	log.Println("Connection Opened to Database")
	// // DB.AutoMigrate(&model.Category{}, &model.Product{}, &model.Transaction{}, &model.TransactionItem{})

	// if err := DB.SetupJoinTable(&model.View{}, "Products", &model.ViewProduct{}); err != nil {
	// 	log.Fatal("Failed to setup join table. \n", err)
	// 	return
	// }

	if err := DB.AutoMigrate(
		&model.User{},
		// &model.Group{},
		// &model.Product{},

		// &model.View{},
		// &model.Transaction{},
		// &model.TransactionItem{},
	); err != nil {
		log.Fatal("Failed to migrate database. \n", err)
		return
	}
	log.Println("Database Migrated")

}
