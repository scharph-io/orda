package domain

import (
	"fmt"
)

type View struct {
	Base
	Name     string
	Products []ViewProduct `gorm:"many2many:view_products;"`
	Roles    []Role        `gorm:"many2many:view_roles;"`
}

func (v View) String() string {
	return fmt.Sprintf("[%s] %s (%d products, %d roles)", v.ID, v.Name, len(v.Products), len(v.Roles))
}

type ViewRole struct {
	ViewID string `gorm:"primaryKey;size:36"`
	View   View   `gorm:"foreignKey:ViewID"`
	RoleID string `gorm:"primaryKey;size:36"`
	Role   Role   `gorm:"foreignKey:RoleID"`
}

type ViewProduct struct {
	ViewID    string  `gorm:"primaryKey"`
	View      View    `gorm:"foreignKey:ViewID"`
	ProductID string  `gorm:"primaryKey"`
	Product   Product `gorm:"foreignKey:ProductID"`
	Position  int8
	Color     string
}

func (v ViewProduct) String() string {
	return fmt.Sprintf("[%s] %s active:%v, pos: %d", v.Product.Name, v.Color, v.Product.Active, v.Position)
}
