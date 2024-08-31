package service

import (
	"context"

	"github.com/scharph/orda/internal/model"
	"github.com/scharph/orda/internal/repository"
)

type ViewRequest struct {
	Name string `json:"name"`
}

type ViewProductRequest struct {
	ProductID string `json:"product_id"`
	Color     string `json:"color"`
	Position  uint   `json:"position"`
}

type ViewResponse struct {
	Id         string                    `json:"id,omitempty"`
	Name       string                    `json:"name"`
	Assortment map[string]*GroupResponse `json:"assortment,omitempty"`
}

// ProductView is a service that provides view functions for products.
type ViewService struct {
	repo        *repository.ViewRepo
	vpRepo      *repository.ViewProductRepo
	productRepo *repository.ProductRepo
	groupRepo   *repository.GroupRepo
}

// NewProductView creates a new ProductView service.
func NewViewService(
	repo *repository.ViewRepo,
	vpRepo *repository.ViewProductRepo,
	productRepo *repository.ProductRepo,
	groupRepo *repository.GroupRepo,

) *ViewService {
	return &ViewService{repo, vpRepo, productRepo, groupRepo}
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

	if len(res) == 0 {
		return []ViewResponse{}, nil
	}

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

	m := make(map[string]*GroupResponse)

	groups, err := s.groupRepo.Read(ctx)
	if err != nil {
		return nil, err
	}

	for _, g := range groups {
		var products []ProductResponse
		for _, p := range res.Products {
			if p.GroupID == g.ID {
				products = append(products, ProductResponse{
					Id:        p.ID,
					Name:      p.Name,
					Desc:      p.Desc,
					Price:     p.Price,
					Active:    p.Active,
					UpdatedAt: p.UpdatedAt.String()})
				m[g.ID] = &GroupResponse{
					Name:      g.Name,
					Desc:      g.Desc,
					Products:  products,
					Deposit:   g.Deposit,
					CreatedAt: g.CreatedAt.String(),
				}
			}
		}
	}

	return &ViewResponse{Name: res.Name, Assortment: m}, nil
}

func (s *ViewService) AddProducts(ctx context.Context, viewId string, viewProduct *[]ViewProductRequest) error {
	if _, err := s.repo.ReadById(ctx, viewId); err != nil {
		return err
	}

	var p []model.ViewProduct
	for _, vp := range *viewProduct {
		p = append(p, model.ViewProduct{
			ViewID:    viewId,
			ProductID: vp.ProductID,
			Color:     vp.Color,
			Position:  vp.Position,
		})
	}
	return s.vpRepo.Create(ctx, p...)
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
