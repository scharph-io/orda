package service

import (
	"context"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/util"
)

type UserService struct {
	repo ports.IUserRepository
}

var _ ports.IUserService = (*UserService)(nil)

func NewUserService(repo ports.IUserRepository) *UserService {
	return &UserService{repo}
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
			Role:     user.Role,
			Id:       user.ID,
		})
	}
	return users, nil
}

func (s *UserService) CreateUser(ctx context.Context, req ports.UserRequest) (ports.UserResponse, error) {
	pw, err := util.HashPassword(req.Password)
	if err != nil {
		return ports.UserResponse{}, err
	}

	user, err := s.repo.Create(ctx, &domain.User{Username: req.Username, Password: pw, Role: req.Role})
	if err != nil {
		return ports.UserResponse{}, err
	}
	return ports.UserResponse{
		Username: user.Username,
		Role:     user.Role,
		Id:       user.ID,
	}, nil
}

func (s *UserService) GetUserById(ctx context.Context, id string) (ports.UserResponse, error) {
	user, err := s.repo.ReadById(ctx, id)
	if err != nil {
		return ports.UserResponse{}, err
	}
	return ports.UserResponse{
		Username: user.Username,
		Role:     user.Role,
		Id:       user.ID,
	}, nil
}

func (s *UserService) GetUserByUsername(ctx context.Context, username string) (ports.UserResponse, error) {
	user, err := s.repo.ReadByUsername(ctx, username)
	if err != nil {
		return ports.UserResponse{}, err
	}
	return ports.UserResponse{
		Username: user.Username,
		Role:     user.Role,
		Id:       user.ID,
		Password: user.Password,
	}, nil
}

func (s *UserService) UpdateUser(ctx context.Context, req ports.UserRequest) (ports.UserResponse, error) {
	return ports.UserResponse{}, nil
}

func (s *UserService) DeleteUser(ctx context.Context, id string) error {
	_, err := s.repo.Delete(ctx, id)
	return err
}
