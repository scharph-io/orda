package model

type ProductGroup struct {
	Base
	Name     string    `json:"name"`
	Desc     string    `json:"desc"`
	Products []Product `json:"products"`
}

// Product is the model for the product
type Product struct {
	Base
	Name    string `json:"name"`
	Desc    string `json:"desc"`
	Price   int32  `json:"price"`
	Active  bool   `json:"active"`
	GroupID string `json:"groupId" gorm:"size:36"`
	Color   string `json:"color"`
}
