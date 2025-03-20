package domain

import (
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Base struct {
	ID        string `gorm:"size:36;primary_key"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

func (b *Base) BeforeCreate(txn *gorm.DB) error {
	if b.ID == "" {
		uuid, _ := uuid.NewV7()
		b.ID = strings.Replace(uuid.String(), "-", "", -1)
	}
	return nil
}
