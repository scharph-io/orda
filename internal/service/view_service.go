package service

import (
	"context"
	"fmt"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
)

type ViewService struct {
	repo        ports.IViewRepository
	productRepo ports.IViewProductRepository
}

func NewViewService(vr ports.IViewRepository, vpr ports.IViewProductRepository) *ViewService {
	return &ViewService{
		repo:        vr,
		productRepo: vpr,
	}
}

var _ ports.IViewService = (*ViewService)(nil)

func (s *ViewService) Create(ctx context.Context, view ports.ViewRequest) (*ports.ViewResponse, error) {
	v, err := s.repo.Create(ctx, domain.View{Name: view.Name, Desc: view.Desc})
	if err != nil {
		return nil, err
	}
	if err := s.repo.ReplaceRoles(ctx, v, view.Roles...); err != nil {
		return nil, err
	}
	return s.ReadOne(ctx, v.ID)
}

func (s *ViewService) ReadMany(ctx context.Context) ([]*ports.ViewResponse, error) {
	views, err := s.repo.Read(ctx)
	if err != nil {
		return nil, err
	}

	fmt.Println(views)
	res := make([]*ports.ViewResponse, 0)
	for _, v := range views {
		res = append(res, &ports.ViewResponse{
			Id:            v.ID,
			Name:          v.Name,
			Desc:          v.Desc,
			RolesCount:    len(v.Roles),
			ProductsCount: len(v.Products),
			Deposit:       v.Deposit,
		})
	}
	return res, nil
}

func (s *ViewService) ReadOne(ctx context.Context, id string) (*ports.ViewResponse, error) {
	view, err := s.repo.ReadByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Should I show the roles?
	roles := make([]*ports.RoleResponse, 0)
	for _, vr := range view.Roles {
		roles = append(roles, &ports.RoleResponse{
			Id:   vr.ID,
			Name: vr.Name,
		})
	}

	vps, err := s.productRepo.ReadByViewID(ctx, view.ID)
	if err != nil {
		return nil, err
	}

	products := make([]*ports.ViewProductResponse, 0)
	for _, vp := range vps {
		if vp.Product.Active {
			products = append(products, &ports.ViewProductResponse{
				ProductResponse: ports.ProductResponse{
					ID:    vp.ProductId,
					Name:  vp.Product.Name,
					Desc:  vp.Product.Desc,
					Price: vp.Product.Price,
				},
				Position: vp.Position,
				Color:    vp.Color,
			})
		}
	}

	return &ports.ViewResponse{
		Id:            view.ID,
		Name:          view.Name,
		Desc:          view.Desc,
		Roles:         roles,
		Products:      products,
		RolesCount:    len(roles),
		ProductsCount: len(products),
		Deposit:       view.Deposit,
	}, nil
}

func (s *ViewService) Update(ctx context.Context, id string, view ports.ViewRequest) (*ports.ViewResponse, error) {

	v, err := s.repo.Update(ctx, domain.View{Base: domain.Base{ID: id}, Name: view.Name, Desc: view.Desc})
	if err != nil {
		return nil, err
	}
	return &ports.ViewResponse{
		Id:   v.ID,
		Name: v.Name,
		Desc: v.Desc,
	}, nil
}

func (s *ViewService) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, domain.View{Base: domain.Base{ID: id}})
}

func (s *ViewService) SetRoles(ctx context.Context, id string, roleIds ...string) error {
	view, err := s.repo.ReadByID(ctx, id)
	if err != nil {
		return err
	}
	return s.repo.ReplaceRoles(ctx, view, roleIds...)
}

func (s *ViewService) GetRoles(ctx context.Context, id string) ([]*ports.RoleResponse, error) {
	view, err := s.repo.ReadByID(ctx, id)
	if err != nil {
		return nil, err
	}

	roles, err := s.repo.GetViewRoles(ctx, view)
	if err != nil {
		return nil, err
	}

	var roleResponses []*ports.RoleResponse
	for _, role := range roles {
		roleResponses = append(roleResponses, &ports.RoleResponse{
			Id:   role.ID,
			Name: role.Name,
		})
	}
	return roleResponses, nil
}

func (s *ViewService) RemoveRoles(ctx context.Context, id string, roleIds ...string) error {
	view, err := s.repo.ReadByID(ctx, id)
	if err != nil {
		return err
	}
	return s.repo.ReplaceRoles(ctx, view, roleIds...)
}

func (s *ViewService) GetProducts(ctx context.Context, id string) ([]*ports.ViewProductResponse, error) {
	view, err := s.repo.ReadByID(ctx, id)
	if err != nil {
		return nil, err
	}

	vps, err := s.productRepo.ReadByViewID(ctx, view.ID)
	if err != nil {
		return nil, err
	}

	productResponses := make([]*ports.ViewProductResponse, 0)
	for _, vp := range vps {
		productResponses = append(productResponses, &ports.ViewProductResponse{
			ProductResponse: ports.ProductResponse{
				ID:     vp.Product.ID,
				Name:   vp.Product.Name,
				Desc:   vp.Product.Desc,
				Price:  vp.Product.Price,
				Active: vp.Product.Active,
			},
			Color:    vp.Color,
			Position: vp.Position,
		})
	}
	return productResponses, nil
}

func (s *ViewService) SetProducts(ctx context.Context, id string, products ...*ports.ViewProductRequest) error {
	view, err := s.repo.ReadByID(ctx, id)
	if err != nil {
		return err
	}

	var vps []*domain.ViewProduct
	for _, vp := range products {
		vps = append(vps, &domain.ViewProduct{
			ViewId:    view.ID,
			ProductId: vp.ProductID,
			Color:     vp.Color,
			Position:  vp.Position,
		})
	}
	return s.repo.ReplaceViewProducts(ctx, view, vps...)
}

func (s *ViewService) AddProducts(ctx context.Context, id string, products ...*ports.ViewProductRequest) error {
	view, err := s.repo.ReadByID(ctx, id)
	if err != nil {
		return err
	}

	var vps []*domain.ViewProduct
	for _, vp := range products {
		vps = append(vps, &domain.ViewProduct{
			ViewId:    id,
			ProductId: vp.ProductID,
			Color:     vp.Color,
			Position:  vp.Position,
		})
	}
	return s.repo.AppendViewProducts(ctx, view, vps...)
}

func (s *ViewService) RemoveProducts(ctx context.Context, id string, productsIds ...string) error {
	view, err := s.repo.ReadByID(ctx, id)
	if err != nil {
		return err
	}
	return s.repo.RemoveViewProducts(ctx, view, productsIds...)
}
