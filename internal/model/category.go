package model

type Category struct {
	Base
	Name     string    `json:"name"`
	Desc     string    `json:"desc"`
	Articles []Article `json:"articles"`
}
