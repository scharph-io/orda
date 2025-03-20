package domain

import (
	"fmt"
)

type Role struct {
	Base
	Name  string
	Users []User `gorm:"foreignKey:RoleId;constraint:OnDelete:CASCADE;"`
}

func (r Role) String() string {
	return fmt.Sprintf("[%s] %s (%d users)", r.ID, r.Name, len(r.Users))
}

type User struct {
	Base
	Username string `gorm:"uniqueIndex;not null;size:50;" validate:"required,min=3,max=50"`
	Password string `gorm:"not null;" validate:"required,min=6,max=50"`
	RoleId   string `gorm:"not null;size:36;"`
	Role     Role   `gorm:"foreignKey:RoleId"`
}

func (u User) String() string {
	return fmt.Sprintf("[%s] %s (role: %s)", u.ID, u.Username, u.Role.Name)
}
