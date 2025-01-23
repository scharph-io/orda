package domain

type View struct {
	Base
	Name         string
	ViewProducts []ViewProduct `gorm:"many2many:view_products;"`
}

type ViewProduct struct {
	ViewID string `gorm:"primaryKey"`
	// View      View    `gorm:"foreignKey:ViewID"`
	ProductID string  `gorm:"primaryKey"`
	Product   Product `gorm:"foreignKey:ProductID"`
	Position  int8
	Color     string
}
