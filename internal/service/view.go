package service

import (
	"context"
	"fmt"

	"github.com/scharph/orda/internal/model"
	"github.com/scharph/orda/internal/repository"
)

type ViewRequest struct {
	Name string `json:"name"`
}

type ViewResponse struct {
	Id         string                    `json:"id"`
	Name       string                    `json:"name"`
	Assortment []AssortmentGroupResponse `json:"assortment,omitempty"`
}

type AssortmentGroupResponse struct {
	// Roles    []string              `json:"roles"`
	Name     string            `json:"name"`
	Products []ProductResponse `json:"products"`
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
	return &ViewResponse{Id: res.ID, Name: res.Name, Assortment: []AssortmentGroupResponse{}}, nil

}

// Read returns all views.
func (s *ViewService) GetViews(ctx context.Context) ([]ViewResponse, error) {
	res, err := s.repo.Read(ctx)
	if err != nil {
		return nil, err
	}

	var views []ViewResponse

	if len(res) == 0 {
		return []ViewResponse{}, nil
	}

	for _, v := range res {
		views = append(views, ViewResponse{Name: v.Name, Id: v.ID, Assortment: []AssortmentGroupResponse{}})
	}

	return views, nil
}

// ReadByViewID returns a view by its viewID.
func (s *ViewService) GetViewByID(ctx context.Context, id string) (*ViewResponse, error) {
	res, err := s.repo.ReadById(ctx, id)
	if err != nil {
		return nil, err
	}

	groups, err := s.groupRepo.Read(ctx)

	fmt.Println(len(groups))
	fmt.Println(len(res.Products))

	return &ViewResponse{Name: res.Name, Id: res.ID}, nil
}

func (s *ViewService) AddProduct(ctx context.Context, viewId, productId string) (*ViewResponse, error) {
	product, err := s.productRepo.ReadByID(ctx, productId)
	if err != nil {
		return nil, err
	}
	_, err = s.repo.AddProduct(ctx, viewId, product)
	if err != nil {
		return nil, err
	}

	return &ViewResponse{Id: viewId}, nil
}

func (s *ViewService) UpdateView(ctx context.Context, id string, view *ViewRequest) (*ViewResponse, error) {
	res, err := s.repo.Update(ctx, &model.View{Name: view.Name, Base: model.Base{ID: id}})
	if err != nil {
		return nil, err
	}
	return &ViewResponse{Name: res.Name, Id: res.ID}, nil
}

func (s *ViewService) DeleteView(ctx context.Context, id string) (bool, error) {
	return s.repo.Delete(ctx, id)
}
