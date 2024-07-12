package model

import (
	"time"

	"gorm.io/gorm"
)

type View struct {
	Base
	Name     string    `json:"name"`
	Deposit  uint      `json:"deposit"`
	Products []Product `gorm:"many2many:View_Products;"`
}

type ViewProduct struct {
	ViewID    int `gorm:"primaryKey"`
	ProductID int `gorm:"primaryKey"`
	CreatedAt time.Time
	DeletedAt gorm.DeletedAt
	Position  uint
	Color     string
}
