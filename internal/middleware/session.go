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

	c := config.GetConfig()
	database := c.Database
	server := c.Server

	// Initialize custom config
	storage := mysql.New(mysql.Config{
		Host:       database.Host,
		Port:       database.Port,
		Username:   database.User,
		Password:   database.Password,
		Reset:      false,
		GCInterval: 10 * time.Second,
	})

	Store = session.New(session.Config{
		Expiration:     time.Minute * 1,
		Storage:        storage,
		CookieHTTPOnly: true,
		CookieSecure:   server.SSL, // Set to true in production
		CookieSameSite: config.Cookie_sameSite,
		KeyGenerator:   uuid.New().String,
		KeyLookup:      "cookie:session-id",
		// KeyLookup:    "cookie:__Host-orda-session", // Recommended to use the __Host- prefix when serving the app over TLS
	})

}
