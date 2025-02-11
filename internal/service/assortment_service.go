package service

import (
	"context"
	"fmt"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
)

type AssortmentService struct {
	products ports.IProductRepository
	groups   ports.IProductGroupRepository
}

var _ ports.IAssortmentService = (*AssortmentService)(nil)

func NewAssortmentService(products ports.IProductRepository, groups ports.IProductGroupRepository) *AssortmentService {
	return &AssortmentService{products, groups}
}

func (s *AssortmentService) CreateProductGroup(ctx context.Context, productGroup ports.ProductGroupRequest) (*ports.ProductGroupResponse, error) {
	group := domain.ProductGroup{
		Name:    productGroup.Name,
		Desc:    productGroup.Desc,
		Deposit: productGroup.Deposit,
	}
	created, err := s.groups.Create(ctx, group)
	if err != nil {
		return nil, err
	}

	return &ports.ProductGroupResponse{
		ID:      created.ID,
		Name:    created.Name,
		Desc:    created.Desc,
		Deposit: created.Deposit,
	}, nil
}

func (s *AssortmentService) ReadProductGroups(ctx context.Context) ([]ports.ProductGroupResponse, error) {
	groups, err := s.groups.Read(ctx)
	if err != nil {
		return nil, err
	}

	var response []ports.ProductGroupResponse
	for _, group := range groups {
		response = append(response, ports.ProductGroupResponse{
			ID:      group.ID,
			Name:    group.Name,
			Desc:    group.Desc,
			Deposit: group.Deposit,
		})
	}
	return response, nil
}

func (s *AssortmentService) ReadProductsGroupById(ctx context.Context, id string) ([]ports.ProductResponse, error) {

	products, err := s.products.ReadByGroupID(ctx, id)
	if err != nil {
		return nil, err
	}

	var productResponse []ports.ProductResponse
	for _, product := range products {
		productResponse = append(productResponse, ports.ProductResponse{
			ID:     product.ID,
			Name:   product.Name,
			Desc:   product.Desc,
			Price:  product.Price,
			Active: product.Active,
		})
	}
	return productResponse, nil
}

func (s *AssortmentService) UpdateProductGroup(ctx context.Context, id string, productGroup ports.ProductGroupRequest) (*ports.ProductGroupResponse, error) {
	group := domain.ProductGroup{
		Base:    domain.Base{ID: id},
		Name:    productGroup.Name,
		Desc:    productGroup.Desc,
		Deposit: productGroup.Deposit,
	}

	updated, err := s.groups.Update(ctx, group)
	if err != nil {
		return nil, err
	}

	return &ports.ProductGroupResponse{
		ID:      updated.ID,
		Name:    updated.Name,
		Desc:    updated.Desc,
		Deposit: updated.Deposit,
	}, nil
}

func (s *AssortmentService) DeleteProductGroup(ctx context.Context, id string) error {
	group := domain.ProductGroup{
		Base: domain.Base{ID: id},
	}
	return s.groups.Delete(ctx, group)
}

func (s *AssortmentService) AddProduct(ctx context.Context, groupID string, product ports.ProductRequest) error {
	p := domain.Product{
		Name:           product.Name,
		Desc:           product.Desc,
		Price:          product.Price,
		Active:         product.Active,
		ProductGroupID: groupID,
	}
	_, err := s.products.Create(ctx, p)
	return err
}

func (s *AssortmentService) AddProducts(ctx context.Context, groupID string, products []ports.ProductRequest) error {
	var p []domain.Product
	for _, product := range products {
		p = append(p, domain.Product{
			Name:           product.Name,
			Desc:           product.Desc,
			Price:          product.Price,
			Active:         product.Active,
			ProductGroupID: groupID,
		})
	}
	return s.products.CreateMany(ctx, p)
}

func (s *AssortmentService) RemoveProduct(ctx context.Context, groupID, productID string) error {
	p := domain.Product{
		Base:           domain.Base{ID: productID},
		ProductGroupID: groupID,
	}
	return s.products.Delete(ctx, p)
}

func (s *AssortmentService) UpdateProduct(ctx context.Context, product ports.ProductRequest) (*ports.ProductResponse, error) {
	p := domain.Product{
		Base:   domain.Base{ID: product.ID},
		Name:   product.Name,
		Desc:   product.Desc,
		Price:  product.Price,
		Active: product.Active,
	}

	updated, err := s.products.Update(ctx, p)
	if err != nil {
		return nil, err
	}

	return &ports.ProductResponse{
		ID:     updated.ID,
		Name:   updated.Name,
		Desc:   updated.Desc,
		Price:  updated.Price,
		Active: updated.Active,
	}, nil
}

func (s *AssortmentService) ToggleProduct(ctx context.Context, productID string) error {
	p, err := s.products.ReadById(ctx, productID)

	fmt.Printf("set from %v to %v\n", p.Active, !p.Active)
	p.Active = !p.Active
	_, err = s.products.Update(ctx, *p)
	return err
}
