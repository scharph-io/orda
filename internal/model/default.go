package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Base struct {
	ID        string         `json:"id" gorm:"primaryKey,type:uuid"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt"`
}

func (b *Base) BeforeCreate(txn *gorm.DB) error {
	uuid, _ := uuid.NewV7()
	b.ID = uuid.String()
	return nil
}
