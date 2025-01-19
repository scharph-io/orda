package ports

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/domain"
)

type RoleRequest struct {
	Id   string `json:"id,omitempty"`
	Name string `json:"name"`
}

type RoleResponse struct {
	Id   string `json:"id,omitempty"`
	Name string `json:"name"`
}

type IRoleRepository interface {
	Create(ctx context.Context, role *domain.Role) (*domain.Role, error)
	Read(ctx context.Context) ([]domain.Role, error)
	ReadById(ctx context.Context, id string) (*domain.Role, error)
	ReadByName(ctx context.Context, name string) (*domain.Role, error)
	Delete(ctx context.Context, id string) (bool, error)
	Update(ctx context.Context, id string, role *domain.Role) (*domain.Role, error)
}

type IRoleService interface {
	Create(ctx context.Context, req RoleRequest) (*RoleResponse, error)
	GetAll(ctx context.Context) ([]RoleResponse, error)
	GetById(ctx context.Context, id string) (*RoleResponse, error)
	GetByName(ctx context.Context, name string) (*RoleResponse, error)
	Delete(ctx context.Context, id string) (bool, error)
	Update(ctx context.Context, id string, req RoleRequest) (*RoleResponse, error)
}

type IRoleHandlers interface {
	Create(c *fiber.Ctx) error
	GetAll(c *fiber.Ctx) error
	GetOne(c *fiber.Ctx) error
	Delete(c *fiber.Ctx) error
}
