package model

type Category struct {
	Base
	Name        string    `json:"name"`
	Desc        string    `json:"desc"`
	Articles    []Article `json:"articles"`
	Colored     bool      `json:"colored" gorm:"default:false"`
	WithDeposit bool      `json:"withDeposit" gorm:"default:false"`
	//Deposit     int32   `json:"deposit"`
}
