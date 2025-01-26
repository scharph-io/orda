package service

import (
	"context"
	"errors"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
)

type RoleService struct {
	repo ports.IRoleRepository
}

var _ ports.IRoleService = (*RoleService)(nil)

func NewRoleService(roleRepo ports.IRoleRepository) *RoleService {
	return &RoleService{roleRepo}
}

func (s *RoleService) Create(ctx context.Context, role ports.RoleRequest) (*ports.RoleResponse, error) {
	if role.Name == "" {
		return nil, errors.New("role name cannot be empty")
	} else if len(role.Name) < 3 {
		return nil, errors.New("role name must be at least 3 characters")
	} else if role.Name == "admin" {
		return nil, errors.New("role name cannot be admin")
	}

	res, err := s.repo.Create(ctx, &domain.Role{Name: role.Name})
	if err != nil {
		return nil, err
	}
	return &ports.RoleResponse{Id: res.ID, Name: res.Name}, nil
}

func (s *RoleService) Update(ctx context.Context, id string, role ports.RoleRequest) (*ports.RoleResponse, error) {
	res, err := s.repo.Update(ctx, id, &domain.Role{Name: role.Name})
	if err != nil {
		return nil, err
	}
	return &ports.RoleResponse{Id: res.ID, Name: res.Name}, nil
}

func (s *RoleService) Delete(ctx context.Context, id string) (bool, error) {
	return s.repo.Delete(ctx, id)
}

func (s *RoleService) GetById(ctx context.Context, id string) (*ports.RoleResponse, error) {
	res, err := s.repo.ReadById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &ports.RoleResponse{Id: res.ID, Name: res.Name}, nil
}

func (s *RoleService) GetByName(ctx context.Context, name string) (*ports.RoleResponse, error) {
	res, err := s.repo.ReadByName(ctx, name)
	if err != nil {
		return nil, err
	}
	return &ports.RoleResponse{Id: res.ID, Name: res.Name}, nil
}

func (s *RoleService) GetAll(ctx context.Context) ([]ports.RoleResponse, error) {
	res, err := s.repo.Read(ctx)
	if err != nil {
		return nil, err
	}
	var roles []ports.RoleResponse
	if len(res) == 0 {
		return []ports.RoleResponse{}, nil
	}
	for _, r := range res {
		roles = append(roles, ports.RoleResponse{Id: r.ID, Name: r.Name})
	}
	return roles, nil
}
