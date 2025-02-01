package domain

import "fmt"

type Products []Product

type ProductGroup struct {
	Base
	Name     string
	Desc     string
	Deposit  uint
	Products Products
}

// Product is the model for the product
type Product struct {
	Base
	Name           string
	Desc           string
	Price          int32
	ProductGroupID string `gorm:"size:36;not null"`
	Active         bool
}

func (p Product) ToString() string {
	return fmt.Sprintf("[ProductID] ID: %s Name: %s NetPrice: %d", p.ID, p.Name, p.Price)
}
