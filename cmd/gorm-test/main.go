package main

import (
	"fmt"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// https://learning-cloud-native-go.github.io/docs/repository/

type View struct {
	ID       int
	Name     string
	Products []Product `gorm:"many2many:View_Products;"`
}

type Product struct {
	ID   uint
	Name string
}

type ViewProduct struct {
	ViewID    int `gorm:"primaryKey"`
	ProductID int `gorm:"primaryKey"`
	CreatedAt time.Time
	DeletedAt gorm.DeletedAt
	Position  uint
	Color     string
}

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	// Change model View's field Productes' join table to ViewProduct
	// ViewProduct must defined all required foreign keys or it will raise error
	if err := db.SetupJoinTable(&View{}, "Products", &ViewProduct{}); err != nil {
		panic("failed to setup join table")
	}

	db.AutoMigrate(&View{}, &Product{}, &ViewProduct{})

	p1 := Product{Name: "Wein"}
	// p2 := Product{Name: "Bosna"}

	// _ := View{Name: "Drinks", Products: []Product{p1, p2}}

	myView := View{}
	db.Find(&myView, 1)

	// db.Model(&myView).Association("Products").Append(&p1, &p2)
	var p []Product

	// Get all products of the view
	db.Model(&myView).Association("Products").Find(&p)

	db.Find(&p1)
	// Delete one product of the view
	// db.Model(&myView).Association("Products").Delete(&p1)

	// Append one product to the view
	// db.Model(&myView).Association("Products").Append(&p1)

	fmt.Println(p)

	// db.Create(&myView)

	var pv ViewProduct
	db.Where("view_id = ? AND product_id = ?", 1, 2).First(&pv)

	fmt.Println(pv.Color, pv.Position)
	// pv.Color = "red"
	// pv.Position = 1
	// db.Save(&pv)
}
