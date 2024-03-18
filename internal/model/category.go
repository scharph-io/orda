package model

type Category struct {
	Base
	Name        string    `json:"name"`
	Desc        string    `json:"desc"`
	Articles    []Article `json:"articles"`
	Color       string    `json:"color"`
	WithDeposit bool      `json:"withDeposit" gorm:"default:false"`
	Deposit     int32     `json:"deposit"`
}
