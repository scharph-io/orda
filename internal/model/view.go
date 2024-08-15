package model

import (
	"time"

	"gorm.io/gorm"
)

type View struct {
	Base
	Name     string    `json:"name"`
	Products []Product `json:"products" gorm:"many2many:view_products;"`
}

type ViewProduct struct {
	ViewID    string  `gorm:"primaryKey"`
	View      View    `gorm:"foreignKey:ViewID"`
	ProductID string  `gorm:"primaryKey"`
	Product   Product `gorm:"foreignKey:ProductID"`
	CreatedAt time.Time
	DeletedAt gorm.DeletedAt
	Position  uint
	Color     string
}
