package repository

import "errors"

var (
	ErrResourceAlreadyExists = errors.New("resource already exists")
	ErrUserNotFound          = errors.New("user not found")
	ErrRoleNotFound          = errors.New("role not found")
)
