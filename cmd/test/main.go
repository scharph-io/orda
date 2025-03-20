package main

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Base struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt int64
	UpdatedAt int64
}

type View struct {
	Base
	Name     string
	Products []ViewProduct `gorm:"foreignKey:ViewID"`
	Roles    []ViewRole    `gorm:"foreignKey:ViewID"`
}

type Product struct {
	Base
	Name string
}

type Role struct {
	Base
	Name string
}

// Explicit join table for View ↔ Product
type ViewProduct struct {
	ViewID    uint    `gorm:"primaryKey"`
	ProductID uint    `gorm:"primaryKey"`
	View      View    `gorm:"foreignKey:ViewID;constraint:OnDelete:CASCADE;"`
	Product   Product `gorm:"foreignKey:ProductID;constraint:OnDelete:CASCADE;"`
}

// Explicit join table for View ↔ Role
type ViewRole struct {
	ViewID uint `gorm:"primaryKey"`
	RoleID uint `gorm:"primaryKey"`
	View   View `gorm:"foreignKey:ViewID;constraint:OnDelete:CASCADE;"`
	Role   Role `gorm:"foreignKey:RoleID;constraint:OnDelete:CASCADE;"`
}

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Explicitly migrate models and join tables
	db.AutoMigrate(&View{}, &Product{}, &Role{}, &ViewProduct{}, &ViewRole{})

	db.Create(&View{
		Name: "Test",
	})

	var v View
	db.First(&v)

	fmt.Println(v.Name)

	db.Model(&v).Association("Products").Append(
		&Product{
			Name: "P1",
		},
		&Product{
			Name: "P2",
		},
	)

	var p []Product
	db.Model(&v).Association("Products").Find(&p)
	fmt.Println(p)

}
