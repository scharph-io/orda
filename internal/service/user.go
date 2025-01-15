package service

import (
	"context"

	"github.com/scharph/orda/internal/model"
	"github.com/scharph/orda/internal/repository"
	"github.com/scharph/orda/internal/util"
)

type UserRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type UserResponse struct {
	Username string `json:"username"`
	Role     string `json:"role"`
}

type UserService struct {
	repo *repository.UserRepo
}

func NewUserService(repo *repository.UserRepo) *UserService {
	return &UserService{repo}
}

func (s *UserService) GetAllUsers(ctx context.Context) ([]UserResponse, error) {
	res, err := s.repo.Read(ctx)
	if err != nil {
		return nil, err
	}
	var users []UserResponse
	for _, user := range res {
		users = append(users, UserResponse{
			Username: user.Username,
			Role:     user.Role,
		})
	}
	return users, nil
}

func (s *UserService) CreateUser(ctx context.Context, req UserRequest) (UserResponse, error) {
	pw, err := util.HashPassword(req.Password)
	if err != nil {
		return UserResponse{}, err
	}

	user, err := s.repo.Create(ctx, &model.User{Username: req.Username, Password: pw, Role: req.Role})
	if err != nil {
		return UserResponse{}, err
	}
	return UserResponse{
		Username: user.Username,
		Role:     user.Role,
	}, nil
}

func GetUserById() string {

	return "Get User by ID"
}

func UpdateUser() string {
	return "Update User"
}

func (s *UserService) DeleteUser(ctx context.Context, id string) error {
	_, err := s.repo.Delete(ctx, id)
	return err
}
