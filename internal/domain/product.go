package domain

import "fmt"

type ProductGroup struct {
	Base
	Name     string
	Desc     string
	Deposit  uint
	VAT      uint
	Products []Product
}

// Product is the model for the product
type Product struct {
	Base
	Name           string
	Desc           string
	NetPrice       int32
	VAT            uint
	ProductGroupID string `gorm:"size:36"`
	Active         bool
}

func (p Product) ToString() string {
	return fmt.Sprintf("[ProductID] ID: %s Name: %s NetPrice: %d", p.ID, p.Name, p.NetPrice)
}
