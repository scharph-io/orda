package service

import (
	"context"
	"fmt"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
)

type ViewService struct {
	repo ports.IViewRepository
	// viewroleRepo ports.IViewRoleRepository
	productRepo ports.IViewProductRepository
}

func NewViewService(vr ports.IViewRepository, vipr ports.IViewProductRepository) *ViewService {
	return &ViewService{
		repo: vr,
		// viewroleRepo: vrr,
		productRepo: vipr,
	}
}

var _ ports.IViewService = (*ViewService)(nil)

func (s *ViewService) CreateView(ctx context.Context, v ports.ViewRequest) (*ports.ViewResponse, error) {
	view, err := s.repo.Create(ctx, domain.View{Name: v.Name})
	if err != nil {
		return nil, err
	}

	if err := s.repo.SetRoles(ctx, view, v.Roles...); err != nil {
		return nil, err
	}

	// for _, r := range v.Roles {
	// 	if _, err := s.viewroleRepo.Create(ctx, domain.ViewRole{ViewID: view.ID, RoleID: r}); err != nil {
	// 		return nil, err
	// 	}
	// }

	return s.ReadView(ctx, view.ID)

}

func (s *ViewService) ReadViews(ctx context.Context) ([]*ports.ViewResponse, error) {
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

func (s *ViewService) ReadView(ctx context.Context, id string) (*ports.ViewResponse, error) {
	view, err := s.repo.ReadByID(ctx, id)
	if err != nil {
		fmt.Println("Error View RepoReadById")
		return nil, err
	}

	// viewRoles, err := s.viewroleRepo.ReadByViewID(ctx, id)
	// if err != nil {
	// 	fmt.Println("Error Roles ReadByViewID")

	// 	return nil, err
	// }

	var roles []*ports.RoleResponse
	for _, vr := range view.Roles {
		roles = append(roles, &ports.RoleResponse{
			Id:   vr.ID,
			Name: vr.Name,
		})
	}

	return &ports.ViewResponse{
		ID:    view.ID,
		Name:  view.Name,
		Roles: roles,
	}, nil
}

func (s *ViewService) UpdateView(ctx context.Context, id string, v ports.ViewRequest) (*ports.ViewResponse, error) {
	view, err := s.repo.Update(ctx, domain.View{Base: domain.Base{ID: id}, Name: v.Name})
	if err != nil {
		return nil, err
	}
	return &ports.ViewResponse{
		ID:   view.ID,
		Name: view.Name,
	}, nil
}

func (s *ViewService) DeleteView(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, domain.View{Base: domain.Base{ID: id}})
}

func (s *ViewService) SetRoles(ctx context.Context, id string, roleIds ...string) error {
	view, err := s.repo.ReadByID(ctx, id)
	if err != nil {
		return err
	}
	return s.repo.SetRoles(ctx, view, roleIds...)
}

func (s *ViewService) AddProducts(ctx context.Context, viewId string, products ...*ports.ViewProductRequest) error {
	var p []*domain.ViewProduct
	for _, vp := range products {
		p = append(p, &domain.ViewProduct{
			ViewID:    viewId,
			ProductID: vp.ProductID,
			Color:     vp.Color,
			Position:  vp.Position,
		})
	}
	return s.productRepo.AppendProducts(ctx, viewId, p...)
}

func (s *ViewService) RemoveProduct(ctx context.Context, viewId, viewProductId string) error {
	return s.productRepo.RemoveProduct(ctx, viewId, viewProductId)
}
