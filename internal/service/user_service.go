package service

import (
	"context"
	"fmt"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/util"
)

type UserService struct {
	repo     ports.IUserRepository
	roleRepo ports.IRoleRepository
}

var _ ports.IUserService = (*UserService)(nil)

func NewUserService(repo ports.IUserRepository, roles ports.IRoleRepository) *UserService {
	return &UserService{repo, roles}
}

func (s *UserService) GetAllUsers(ctx context.Context) ([]ports.UserResponse, error) {
	res, err := s.repo.Read(ctx)
	if err != nil {
		return nil, err
	}
	var users []ports.UserResponse
	for _, user := range res {
		users = append(users, ports.UserResponse{
			Username: user.Username,
			Role:     user.Role.Name,
			RoleId:   user.Role.ID,
			Id:       user.ID,
		})
	}
	return users, nil
}

func (s *UserService) Create(ctx context.Context, req ports.UserRequest) (*ports.UserResponse, error) {
	if req.Username == "admin" {
		return nil, fmt.Errorf("user admin can not be created")
	} else if req.Username == "" || req.Password == "" || req.RoleId == "" {
		return nil, fmt.Errorf("invalid input")
	}

	role, err := s.roleRepo.ReadById(ctx, req.RoleId)
	if err != nil {
		return nil, err
	}

	pw, err := util.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	user, err := s.repo.Create(ctx, &domain.User{Username: req.Username, Password: pw, RoleId: role.ID})
	if err != nil {
		return nil, err
	}
	return &ports.UserResponse{
		Username: user.Username,
		Role:     role.Name,
		RoleId:   role.ID,
		Id:       user.ID,
	}, nil
}

func (s *UserService) GetUserById(ctx context.Context, id string) (*ports.UserResponse, error) {
	user, err := s.repo.ReadById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &ports.UserResponse{
		Username: user.Username,
		Role:     user.Role.Name,
		RoleId:   user.Role.ID,
		Id:       user.ID,
	}, nil
}

func (s *UserService) GetUserByUsername(ctx context.Context, username string) (*ports.UserResponse, error) {
	user, err := s.repo.ReadByUsername(ctx, username)
	if err != nil {
		return nil, err
	}
	return &ports.UserResponse{
		Id:       user.ID,
		Username: user.Username,
		Password: user.Password,
		Role:     user.Role.Name,
		RoleId:   user.Role.ID,
	}, nil
}

func (s *UserService) Update(ctx context.Context, req ports.UserRequest) (*ports.UserResponse, error) {
	current, _ := s.GetUserById(ctx, req.Id)
	// Prevent username "admin" to be updated
	if current.Username == "admin" && req.Username != "admin" {
		return nil, fmt.Errorf("admin can not be updated")
	}

	role, err := s.roleRepo.ReadById(ctx, req.RoleId)
	if err != nil {
		return nil, err
	}

	pw, err := util.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	user, err := s.repo.Update(ctx, req.Id, &domain.User{Username: req.Username, Password: pw, RoleId: role.ID})
	if err != nil {
		return nil, err
	}
	return &ports.UserResponse{
		Username: user.Username,
		Role:     user.Role.Name,
		RoleId:   user.Role.ID,
		Id:       user.ID,
	}, nil

}

func (s *UserService) Delete(ctx context.Context, id string) error {
	u, _ := s.GetUserById(ctx, id)
	if u.Username == "admin" {
		return fmt.Errorf("admin can not be deleted")
	}
	_, err := s.repo.Delete(ctx, id)
	return err
}
