package middleware

import (
	"time"

	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/gofiber/storage/mysql/v2"
	"github.com/google/uuid"
	"github.com/scharph/orda/internal/config"
	"gorm.io/gorm"
)

var (
	Store *session.Store
)

type Session struct {
	gorm.Model
	UserID    uint      `json:"user_id"`
	Token     string    `json:"token" gorm:"unique;not null"`
	ExpiresAt time.Time `json:"expires_at"`
}

func initSessionConfig() {

	config := config.GetConfig().Database

	// Initialize custom config
	storage := mysql.New(mysql.Config{
		Host:       config.Host,
		Port:       config.Port,
		Username:   config.User,
		Password:   config.Password,
		Database:   "fiber",
		Table:      "fiber_sessions",
		Reset:      false,
		GCInterval: 10 * time.Second,
	})

	Store = session.New(session.Config{
		Expiration:     time.Hour * 24,
		Storage:        storage,
		CookieHTTPOnly: true,
		CookieSecure:   true,
		KeyLookup:      "cookie:session_id",
		KeyGenerator:   uuid.New().String,
	})
}
