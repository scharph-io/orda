package service

import (
	"context"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
)

type ViewService struct {
	repo     ports.IViewRepository
	itemRepo ports.IViewProductRepository
}

func NewViewService(vr ports.IViewRepository, vipr ports.IViewProductRepository) *ViewService {
	return &ViewService{
		repo:     vr,
		itemRepo: vipr,
	}
}

var _ ports.IViewService = (*ViewService)(nil)

func (s *ViewService) CreateView(ctx context.Context, v ports.ViewRequest) (*ports.ViewResponse, error) {
	view, err := s.repo.Create(ctx, domain.View{Name: v.Name})
	if err != nil {
		return nil, err
	}
	return &ports.ViewResponse{
		Name: view.Name,
		ID:   view.ID,
	}, nil
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
		return nil, err
	}
	return &ports.ViewResponse{
		ID:   view.ID,
		Name: view.Name,
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

func (s *ViewService) AddRoles(ctx context.Context, id string, roleIds ...string) error {
	return s.repo.AddRoles(ctx, id, roleIds...)
}

func (s *ViewService) RemoveRole(ctx context.Context, id, roleId string) error {
	return s.repo.RemoveRoles(ctx, id, []string{roleId})
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
	return s.itemRepo.AppendProducts(ctx, viewId, p...)
}

func (s *ViewService) RemoveProduct(ctx context.Context, viewId, viewProductId string) error {
	return s.itemRepo.RemoveProduct(ctx, viewId, viewProductId)
}
