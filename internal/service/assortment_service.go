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

// Product Groups
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

func (s *AssortmentService) ReadProductGroup(ctx context.Context, id string) (*ports.ProductGroupResponse, error) {
	group, err := s.groups.ReadByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return &ports.ProductGroupResponse{
		ID:      group.ID,
		Name:    group.Name,
		Desc:    group.Desc,
		Deposit: group.Deposit,
	}, nil
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

// Products
func (s *AssortmentService) ReadProductById(ctx context.Context, id string) (*ports.ProductResponse, error) {
	p, err := s.products.ReadById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &ports.ProductResponse{
		ID:    p.ID,
		Name:  p.Name,
		Desc:  p.Desc,
		Price: p.Price,
	}, nil
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

func (s *AssortmentService) AddProductsToGroup(ctx context.Context, id string, products ...ports.ProductRequest) error {
	var p []*domain.Product
	for _, product := range products {
		p = append(p, &domain.Product{
			Name:           product.Name,
			Desc:           product.Desc,
			Price:          product.Price,
			Active:         product.Active,
			ProductGroupID: id,
		})
	}

	group, err := s.groups.ReadByID(ctx, id)
	if err != nil {
		return err
	}
	return s.groups.AppendProducts(ctx, group, p...)
}

func (s *AssortmentService) RemoveProduct(ctx context.Context, id string) error {
	p := domain.Product{
		Base: domain.Base{ID: id},
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

	fmt.Println("Updating product:", p)

	updated, err := s.products.Update(ctx, p)
	if err != nil {
		return nil, err
	}

	fmt.Println("Updated product:", updated)

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

	if err != nil {
		return err
	}

	fmt.Printf("set from %v to %v\n", p.Active, !p.Active)
	p.Active = !p.Active
	_, err = s.products.Update(ctx, *p)
	return err
}

// Views
func (s *AssortmentService) SetProductViews(ctx context.Context, id string, views ...*ports.ViewProductRequest) error {

	// for _, view := range views {
	// 	err := s.products.ReplaceProductViews(ctx, id, view)
	// 	if err != nil {
	// 		return err
	// 	}
	// }
	return nil
}

func (s *AssortmentService) AddProductViews(ctx context.Context, id string, views ...*ports.ViewProductRequest) error {
	return nil
}

func (s *AssortmentService) RemoveProductViews(ctx context.Context, id string, viewIds ...string) error {
	return s.products.RemoveProductViews(ctx, id, viewIds...)
}
