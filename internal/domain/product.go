package domain

type Group struct {
	Base
	Name     string    `json:"name"`
	Desc     string    `json:"desc"`
	Deposit  uint      `json:"deposit"`
	Products []Product `json:"products"`
}

// Product is the model for the product
type Product struct {
	Base
	Name    string `json:"name"`
	Desc    string `json:"desc"`
	Price   int32  `json:"price"`
	GroupID string `json:"groupId" gorm:"size:36"`
	Active  bool   `json:"active"`
}
