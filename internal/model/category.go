package model

type Category struct {
	Base
	Name        string    `json:"name"`
	Desc        string    `json:"desc"`
	Products    []Product `json:"products"`
	Color       string    `json:"color"`
	WithDeposit bool      `json:"withDeposit" gorm:"default:false"`
	Deposit     int32     `json:"deposit"`
	Position    uint      `json:"position" gorm:"default:0"`
}
