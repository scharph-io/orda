package domain

import (
	"fmt"

	"gorm.io/gorm"
)

type Products []Product

type ProductGroup struct {
	Base
	Name     string
	Desc     string
	Products Products
	// Deposit  uint
}

func (pg ProductGroup) String() string {
	return fmt.Sprintf("[%s] Name: %s\n", pg.ID, pg.Name)
}

// Product is the model for the product
type Product struct {
	Base
	Name           string
	Desc           string
	Price          int32  `gorm:"default:0"`
	ProductGroupID string `gorm:"size:36;not null"`
	Active         bool   `gorm:"default:false"`
	Views          []View `gorm:"many2many:view_products"`
	Deposit        bool
}

func (p *Product) BeforeDelete(tx *gorm.DB) error {
	// Remove associations in the join table without deleting the views themselves
	if err := tx.Model(p).Association("Views").Clear(); err != nil {
		return err
	}
	return nil
}

func (p Product) String() string {
	return fmt.Sprintf("[%s] Name: %s Price: %d", p.ID, p.Name, p.Price)
}
