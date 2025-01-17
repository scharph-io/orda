package domain

// User model
type User struct {
	Base
	Username string `gorm:"uniqueIndex;not null;size:50;" validate:"required,min=3,max=50" json:"username"`
	Password string `gorm:"not null;" validate:"required,min=6,max=50" json:"password"`
	Role     string `gorm:"not null" json:"roles"`
}
