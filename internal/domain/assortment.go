package domain

import (
	"fmt"
)

type Products []Product

type ProductGroup struct {
	Base
	Name     string
	Desc     string
	Deposit  uint
	Products Products
}

func (pg ProductGroup) String() string {
	return fmt.Sprintf("[%s] Name: %s", pg.ID, pg.Name)
}

// Product is the model for the product
type Product struct {
	Base
	Name           string
	Desc           string
	Price          int32
	ProductGroupID string `gorm:"size:36;not null"`
	Active         bool
	Views          []View `gorm:"many2many:view_products;"`
}

func (p Product) String() string {
	return fmt.Sprintf("[%s] Name: %s Price: %d", p.ID, p.Name, p.Price)
}
