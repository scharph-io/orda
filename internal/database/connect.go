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
	"github.com/scharph/orda/internal/domain"
)

var DB *gorm.DB

// ConnectDB connect to db
func Connect() {
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

	DB, err = gorm.Open(mysql.New(
		mysql.Config{
			DSN: dsn,
		},
	), &gorm.Config{
		Logger: newLogger,
		NowFunc: func() time.Time {
			tz, err := time.LoadLocation(config.GetConfig().Server.TZ)
			if err != nil {
				log.Fatal("Failed to load timezone. \n", err)
				os.Exit(2)
			}
			return time.Now().In(tz)
		},
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

	if err := DB.AutoMigrate(
		&domain.Role{},
		&domain.User{},

		&domain.Transaction{},
		&domain.TransactionItem{},

		&domain.AccountGroup{},
		&domain.Account{},

		&domain.AccountHistory{},

		&domain.ProductGroup{},
		&domain.Product{},

		&domain.View{},
		&domain.ViewRole{},
		&domain.ViewProduct{},
	); err != nil {
		log.Fatal("Failed to migrate database. \n", err)
		return
	}
	log.Println("Database Migrated")
	DatabaseInit(DB)
}

func DatabaseInit(db *gorm.DB) {
	defaultAccountGroup := &domain.AccountGroup{
		Name: "Default",
	}
	if db.Where("name = ?", defaultAccountGroup.Name).First(defaultAccountGroup).RowsAffected == 0 {
		if db.Create(defaultAccountGroup).Error != nil {
			log.Fatalln("Error creating default account group")
			panic(1)
		}
		log.Printf("Account group '%s' created", defaultAccountGroup.Name)
	}
}
