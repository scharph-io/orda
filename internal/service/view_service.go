package service

import (
	"context"

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
	v, err := s.repo.Create(ctx, domain.View{Name: view.Name})
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
	var res []*ports.ViewResponse
	for _, v := range views {
		res = append(res, &ports.ViewResponse{
			ID:   v.ID,
			Name: v.Name,
		})
	}
	return res, nil
}

func (s *ViewService) ReadOne(ctx context.Context, id string) (*ports.ViewResponse, error) {
	view, err := s.repo.ReadByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Should i show the roles?
	// roles := make([]*ports.RoleResponse, 0)
	// for _, vr := range view.Roles {
	// 	roles = append(roles, &ports.RoleResponse{
	// 		Id:   vr.ID,
	// 		Name: vr.Name,
	// 	})
	// }

	vps, err := s.productRepo.ReadByViewID(ctx, view.ID)
	if err != nil {
		return nil, err
	}

	products := make([]*ports.ViewProductResponse, 0)
	for _, vp := range vps {
		if vp.Product.Active {
			products = append(products, &ports.ViewProductResponse{
				ProductResponse: ports.ProductResponse{
					ID:   vp.ProductId,
					Name: vp.Product.Name,

					Price: vp.Product.Price,
					Desc:  vp.Product.Desc,
				},
				Position: vp.Position,
				Color:    vp.Color,
			})
		}
	}

	return &ports.ViewResponse{
		ID:   view.ID,
		Name: view.Name,
		// Roles:      roles,
		Assortment: products,
	}, nil
}

func (s *ViewService) Update(ctx context.Context, id string, view ports.ViewRequest) (*ports.ViewResponse, error) {
	v, err := s.repo.Update(ctx, domain.View{Base: domain.Base{ID: id}, Name: view.Name})
	if err != nil {
		return nil, err
	}
	return &ports.ViewResponse{
		ID:   v.ID,
		Name: v.Name,
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

func (s *ViewService) RemoveRoles(ctx context.Context, id string, roleIds ...string) error {
	view, err := s.repo.ReadByID(ctx, id)
	if err != nil {
		return err
	}
	return s.repo.ReplaceRoles(ctx, view, roleIds...)
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
	var vps []*domain.ViewProduct
	for _, id := range productsIds {
		vps = append(vps, &domain.ViewProduct{
			ViewId:    view.ID,
			ProductId: id,
		})
	}
	return s.repo.RemoveViewProducts(ctx, view, vps...)
}
