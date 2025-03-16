package service

import (
	"context"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
)

type OrderService struct {
	viewRepo  ports.IViewRepository
	transRepo ports.ITransactionRepository
	accRepo   ports.IAccountRepository
}

var _ ports.IOrderService = (*OrderService)(nil)

func NewOrderService(vr ports.IViewRepository, tr ports.ITransactionRepository, ar ports.IAccountRepository) *OrderService {
	return &OrderService{
		viewRepo:  vr,
		transRepo: tr,
		accRepo:   ar,
	}
}

func (s *OrderService) GetViewsForRole(ctx context.Context, role string) ([]*ports.OrderView, error) {
	views := []*domain.View{}
	var err error
	if role == "admin" {
		views, err = s.viewRepo.Read(ctx)
	} else {
		views, err = s.viewRepo.ReadByRoleID(ctx, role)
	}
	if err != nil {
		return nil, err
	}
	v := make([]*ports.OrderView, len(views))
	for i, view := range views {
		vps := make([]*ports.ViewProductResponse, len(view.Products))
		for j, p := range view.Products {
			vps[j] = &ports.ViewProductResponse{
				ProductResponse: ports.ProductResponse{
					ID:    p.ID,
					Name:  p.Name,
					Price: p.Price,
					Desc:  p.Desc,
				},
			}
		}
		v[i] = &ports.OrderView{
			Id:       view.ID,
			Name:     view.Name,
			Products: vps,
		}
	}
	return v, nil

}
