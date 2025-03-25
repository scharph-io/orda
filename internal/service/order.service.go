package service

import (
	"context"

	"github.com/scharph/orda/internal/ports"
)

type OrderService struct {
	viewRepo        ports.IViewRepository
	viewProductRepo ports.IViewProductRepository
	transRepo       ports.ITransactionRepository
	accRepo         ports.IAccountRepository
}

var _ ports.IOrderService = (*OrderService)(nil)

func NewOrderService(vr ports.IViewRepository, vpr ports.IViewProductRepository, tr ports.ITransactionRepository, ar ports.IAccountRepository) *OrderService {
	return &OrderService{
		viewRepo:        vr,
		viewProductRepo: vpr,
		transRepo:       tr,
		accRepo:         ar,
	}
}

func (s *OrderService) GetOrderViewsForRole(ctx context.Context, roleid string) ([]*ports.OrderView, error) {
	views, err := s.viewRepo.ReadByRoleId(ctx, roleid)
	if err != nil {
		return nil, err
	}
	v := make([]*ports.OrderView, 0)
	for _, view := range views {
		v = append(v, &ports.OrderView{

			ViewResponse: ports.ViewResponse{
				Id:            view.ID,
				Name:          view.Name,
				Desc:          view.Desc,
				ProductsCount: len(view.Products),
			},
		})
	}
	return v, nil
}

func (s *OrderService) GetOrderProducts(ctx context.Context, viewid string) (ports.OrderProductsMap, error) {

	view, err := s.viewRepo.ReadByID(ctx, viewid)
	if err != nil {
		return nil, err
	}

	vps, err := s.viewProductRepo.ReadByViewID(ctx, view.ID)
	if err != nil {
		return nil, err
	}

	productsMap := make(ports.OrderProductsMap, 0)
	for _, vp := range vps {
		if vp.Product.Active {
			groupId := vp.Product.ProductGroupID
			if productsMap[groupId] == nil {
				productsMap[groupId] = make([]ports.ViewProductResponse, 0)
			}
			productsMap[groupId] = append(productsMap[groupId], ports.ViewProductResponse{
				ProductResponse: ports.ProductResponse{
					ID:    vp.ProductId,
					Price: vp.Product.Price,
					Name:  vp.Product.Name,
					Desc:  vp.Product.Desc,
				},
				Color:    vp.Color,
				Position: vp.Position,
			})
		}
	}

	return productsMap, nil

}
