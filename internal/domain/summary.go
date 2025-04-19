package domain

type Summary struct {
	Base
	Type    uint8
	Content map[string]any `gorm:"serializer:json"`
}
