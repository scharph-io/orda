package model

// Article is the model for the article
type Article struct {
	Base
	Name   string `json:"name"`
	Desc   string `json:"desc"`
	Price  int32  `json:"price"`
	Active bool   `json:"active"`
}
