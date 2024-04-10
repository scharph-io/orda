package model

type View struct {
	Base
	Name       string          `json:"name"`
	Components []ViewComponent `json:"components"`
	Deposit    uint            `json:"deposit"`
}

type ViewComponent struct {
	Base
	Product  Product `gorm:"embedded" `
	Position uint    `json:"position" gorm:"default:0"`
}
