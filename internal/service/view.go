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

type ViewProductRequest struct {
	ProductID string `json:"product_id"`
	Color     string `json:"color"`
	Position  uint   `json:"position"`
}

type ViewProductResponse struct {
	ProductResponse
	Position uint   `json:"position"`
	Color    string `json:"color,omitempty"`
}

type ViewResponse struct {
	Id         string                        `json:"id"`
	Name       string                        `json:"name"`
	Assortment map[string]*ViewGroupResponse `json:"assortment"`
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

	viewProducts, err := s.vpRepo.ReadByViewId(ctx, id)
	if err != nil {
		return nil, err
	}

	groups, err := s.groupRepo.Read(ctx)
	if err != nil {
		return nil, err
	}

	m := make(map[string]*ViewGroupResponse)

	for _, g := range groups {
		var products []ViewProductResponse
		for _, vp := range viewProducts {
			if vp.Product.GroupID == g.ID {
				if vp.Product.Active {
					products = append(products, ViewProductResponse{
						ProductResponse: ProductResponse{
							Id:        vp.Product.ID,
							Name:      vp.Product.Name,
							Desc:      vp.Product.Desc,
							Price:     vp.Product.Price,
							UpdatedAt: vp.Product.UpdatedAt.String()},
						Position: vp.Position,
						Color:    vp.Color,
					})
				}

				m[g.ID] = &ViewGroupResponse{
					GroupResponse: GroupResponse{
						Name:      g.Name,
						Desc:      g.Desc,
						Deposit:   g.Deposit,
						CreatedAt: g.CreatedAt.String()},
					Products: products,
				}
			}
		}
	}

	res, err := s.repo.ReadById(ctx, id)
	if err != nil {
		return nil, err
	}

	return &ViewResponse{Id: res.ID, Name: res.Name, Assortment: m}, nil
}

func (s *ViewService) AddProducts(ctx context.Context, viewId string, viewProduct *[]ViewProductRequest) error {

	if _, err := s.repo.ReadById(ctx, viewId); err != nil {
		return err
	}

	var p []model.ViewProduct
	for _, vp := range *viewProduct {
		if pr, err := s.vpRepo.ReadByViewAndProductId(ctx, viewId, vp.ProductID); pr.ProductID != "" || err == nil {
			continue
		}
		p = append(p, model.ViewProduct{
			ViewID:    viewId,
			ProductID: vp.ProductID,
			Color:     vp.Color,
			Position:  vp.Position,
		})
	}

	if len(p) == 0 {
		return fmt.Errorf("no products to add")
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
