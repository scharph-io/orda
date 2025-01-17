package ports

import (
	"context"

	fiber "github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/domain"
)

type UserRequest struct {
	Id       string `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type UserResponse struct {
	Id       string `json:"id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	Password string `json:"-"`
}

type IUserService interface {
	GetAllUsers(ctx context.Context) ([]UserResponse, error)
	GetUserById(ctx context.Context, id string) (UserResponse, error)
	GetUserByUsername(ctx context.Context, username string) (UserResponse, error)
	CreateUser(ctx context.Context, req UserRequest) (UserResponse, error)
	UpdateUser(ctx context.Context, req UserRequest) (UserResponse, error)
	DeleteUser(ctx context.Context, id string) error
}

type IUserRepository interface {
	Create(ctx context.Context, user *domain.User) (*domain.User, error)
	Read(ctx context.Context) ([]domain.User, error)
	ReadById(ctx context.Context, id string) (domain.User, error)
	ReadByUsername(ctx context.Context, username string) (domain.User, error)
	Update(ctx context.Context, id string, user *domain.User) (*domain.User, error)
	Delete(ctx context.Context, id string) (bool, error)
}

type IUserHandlers interface {
	Register(c *fiber.Ctx) error
	// Login(c *fiber.Ctx) error
	GetAll(c *fiber.Ctx) error
	GetOne(c *fiber.Ctx) error
	Delete(c *fiber.Ctx) error
	Update(c *fiber.Ctx) error
}
