package service

import (
	"context"

	"github.com/scharph/orda/internal/model"
	"github.com/scharph/orda/internal/repository"
)

type RoleRequest struct {
	Name string `json:"name"`
}

type RoleResponse struct {
	Id   string `json:"id,omitempty"`
	Name string `json:"name"`
}

// type RoleService interface {
// 	CreateRole(ctx context.Context, role *RoleRequest) (*RoleResponse, error)
// 	UpdateRole(ctx context.Context, role *RoleRequest) (*RoleResponse, error)
// 	DeleteRole(ctx context.Context, id string) error
// 	FindRoleByID(ctx context.Context, id string) (*RoleResponse, error)
// 	FindRoleByName(ctx context.Context, name string) (*RoleResponse, error)
// 	FindAllRoles(ctx context.Context) ([]RoleResponse, error)
// }

type RoleService struct {
	roleRepo repository.RoleRepo
}

func NewRoleService(roleRepo repository.RoleRepo) *RoleService {
	return &RoleService{roleRepo}
}

func (s *RoleService) CreateRole(ctx context.Context, role *RoleRequest) (*RoleResponse, error) {
	res, err := s.roleRepo.Create(ctx, &model.Role{Name: role.Name})
	if err != nil {
		return nil, err
	}
	return &RoleResponse{Id: res.ID, Name: res.Name}, nil
}

func (s *RoleService) UpdateRole(ctx context.Context, role *RoleRequest) (*RoleResponse, error) {
	res, err := s.roleRepo.Update(ctx, &model.Role{Name: role.Name})
	if err != nil {
		return nil, err
	}
	return &RoleResponse{Id: res.ID, Name: res.Name}, nil
}

func (s *RoleService) DeleteRole(ctx context.Context, id string) error {
	return s.roleRepo.Delete(ctx, &model.Role{Base: model.Base{ID: id}})
}

func (s *RoleService) FindRoleByID(ctx context.Context, id uint) (*RoleResponse, error) {
	res, err := s.roleRepo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return &RoleResponse{Id: res.ID, Name: res.Name}, nil
}

func (s *RoleService) FindRoleByName(ctx context.Context, name string) (*RoleResponse, error) {
	res, err := s.roleRepo.FindByName(ctx, name)
	if err != nil {
		return nil, err
	}
	return &RoleResponse{Id: res.ID, Name: res.Name}, nil
}

func (s *RoleService) FindAllRoles(ctx context.Context) ([]RoleResponse, error) {
	res, err := s.roleRepo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	var roles []RoleResponse

	if len(res) == 0 {
		return []RoleResponse{}, nil
	}

	for _, r := range res {
		roles = append(roles, RoleResponse{Id: r.ID, Name: r.Name})
	}

	return roles, nil
}
