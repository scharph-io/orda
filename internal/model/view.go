package model

type View struct {
	Base
	Name      string     `json:"name"`
	Deposit   uint       `json:"deposit"`
	ViewItems []ViewItem `json:"view_items" gorm:"constraint:OnDelete:CASCADE;"`
}

type ViewItem struct {
	Base
	Product   Product `json:"product"`
	ProductID string  `json:"product_id" gorm:"size:36"`
	ViewID    string  `json:"view_id" gorm:"size:36"`
	Position  uint    `json:"position" gorm:"default:0"`
}
