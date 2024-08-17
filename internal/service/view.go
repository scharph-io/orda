package service

import (
	"context"

	"github.com/scharph/orda/internal/model"
	"github.com/scharph/orda/internal/repository"
)

type ViewRequest struct {
	Name string `json:"name"`
}

type ViewResponse struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type ViewGroupResponse struct {
	// Roles    []string              `json:"roles"`
	Name     string            `json:"name"`
	Products []ProductResponse `json:"products"`
}
type Response struct {
	Name   string              `json:"name"`
	Groups []ViewGroupResponse `json:"groups"`
}

// ProductView is a service that provides view functions for products.
type ViewService struct {
	repo        *repository.ViewRepo
	productRepo *repository.ProductRepo
	groupRepo   *repository.GroupRepo
}

// NewProductView creates a new ProductView service.
func NewViewService(
	repo *repository.ViewRepo,
	productRepo *repository.ProductRepo,
	groupRepo *repository.GroupRepo,
) *ViewService {
	return &ViewService{repo, productRepo, groupRepo}
}
func (s *ViewService) CreateView(ctx context.Context, view *ViewRequest) (*ViewResponse, error) {

	res, err := s.repo.Create(ctx, &model.View{Name: view.Name})
	if err != nil {
		return nil, err
	}
	return &ViewResponse{Id: res.ID, Name: res.Name}, nil

}

// Read returns all views.
func (s *ViewService) GetViews(ctx context.Context) ([]ViewResponse, error) {
	res, err := s.repo.Read(ctx)
	if err != nil {
		return nil, err
	}
	var views []ViewResponse
	for _, v := range res {
		views = append(views, ViewResponse{Name: v.Name, Id: v.ID})
	}
	return views, nil
}

// ReadByViewID returns a view by its viewID.
func (s *ViewService) GetViewByID(ctx context.Context, id string) (*ViewResponse, error) {
	res, err := s.repo.ReadById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &ViewResponse{Name: res.Name, Id: res.ID}, nil
}

func (s *ViewService) AddProduct(ctx context.Context, viewId, productId string) (*ViewResponse, error) {
	res, err := s.productRepo.ReadByID(ctx, productId)
	if err != nil {
		return nil, err
	}
	_, err = s.repo.AddProduct(ctx, viewId, res)
	if err != nil {
		return nil, err
	}

	return &ViewResponse{Id: viewId}, nil
}

func (s *ViewService) UpdateView(ctx context.Context, id string, view *ViewRequest) (*ViewResponse, error) {
	res, err := s.repo.Update(ctx, id, &model.View{Name: view.Name})
	if err != nil {
		return nil, err
	}
	return &ViewResponse{Name: res.Name, Id: res.ID}, nil
}
