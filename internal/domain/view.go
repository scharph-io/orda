package domain

import (
	"fmt"
)

type Roles []Role

type View struct {
	Base
	Name     string
	Products Products `gorm:"many2many:view_products;"`
	Roles    Roles    `gorm:"many2many:view_roles;"`
}

func (v View) String() string {
	return fmt.Sprintf("[%s] %s (%d products, %d roles)", v.ID, v.Name, len(v.Products), len(v.Roles))
}

type ViewRole struct {
	ViewId string `gorm:"primaryKey;size:36"`
	View   View   `gorm:"foreignKey:ViewId"`
	RoleId string `gorm:"primaryKey;size:36"`
	Role   Role   `gorm:"foreignKey:RoleId"`
}

type ViewProduct struct {
	ViewId    string  `gorm:"primaryKey;size:36"`
	View      View    `gorm:"foreignKey:ViewId"`
	ProductId string  `gorm:"primaryKey;size:36"`
	Product   Product `gorm:"foreignKey:ProductId"`
	Position  int8
	Color     string
}

func (v ViewProduct) String() string {
	return fmt.Sprintf("[view: %s] [product:%s] name: %s, active:%v, pos: %d", v.ViewId, v.ProductId, v.Product.Name, v.Product.Active, v.Position)
}
