package middleware

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/gofiber/storage/mysql/v2"
	"github.com/google/uuid"
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

	// Initialize custom config
	store := mysql.New(mysql.Config{
		Host:       os.Getenv("DB_HOST"),
		Port:       3306,
		Database:   "fiber",
		Table:      "fiber_sessions",
		Reset:      false,
		GCInterval: 10 * time.Second,
	})

	Store = session.New(session.Config{
		Expiration:     time.Hour * 24,
		Storage:        store,
		CookieHTTPOnly: true,
		CookieSecure:   true,
		KeyLookup:      "cookie:session_id",
		KeyGenerator:   uuid.New().String,
	})
}
