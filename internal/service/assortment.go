package service

import (
	"context"
	"fmt"

	"github.com/scharph/orda/internal/model"
	"github.com/scharph/orda/internal/repository"
)

type GroupRequest struct {
	Name    string `json:"name"`
	Desc    string `json:"desc"`
	Deposit uint   `json:"deposit"`
}

type GroupResponse struct {
	Id        string            `json:"id"`
	Name      string            `json:"name"`
	Desc      string            `json:"desc"`
	Deposit   uint              `json:"deposit"`
	CreatedAt string            `json:"created_at"`
	Products  []ProductResponse `json:"products,omitempty"`
}

type ProductRequest struct {
	Name    string `json:"name"`
	Desc    string `json:"desc"`
	Price   int32  `json:"price"`
	GroupID string `json:"group_id"`
}

type ProductResponse struct {
	Id        string `json:"id"`
	Name      string `json:"name"`
	Desc      string `json:"desc"`
	Price     int32  `json:"price"`
	GroupID   string `json:"group_id"`
	Active    bool   `json:"active"`
	UpdatedAt string `json:"updated_at"`
}

type AssortmentService struct {
	groupRepo   *repository.GroupRepo
	productRepo *repository.ProductRepo
}

func NewAssortmentService(groupRepo *repository.GroupRepo, productRepo *repository.ProductRepo) *AssortmentService {
	return &AssortmentService{groupRepo, productRepo}
}

func (a *AssortmentService) GetGroups(ctx context.Context) ([]GroupResponse, error) {
	res, err := a.groupRepo.Read(ctx)
	if err != nil {
		return nil, err
	}
	var groups []GroupResponse
	for _, group := range res {
		groups = append(groups, GroupResponse{
			Id:        group.ID,
			Name:      group.Name,
			Desc:      group.Desc,
			Deposit:   group.Deposit,
			CreatedAt: group.CreatedAt.String(),
		})
	}

	if len(groups) == 0 {
		return []GroupResponse{}, nil
	}
	return groups, nil
}

func (a *AssortmentService) GetGroup(ctx context.Context, id string) (*GroupResponse, error) {
	res, err := a.groupRepo.ReadById(ctx, id)
	if err != nil {
		return nil, err
	}

	var products []ProductResponse
	for _, product := range res.Products {
		products = append(products, ProductResponse{
			Id:        product.ID,
			Name:      product.Name,
			Desc:      product.Desc,
			Price:     product.Price,
			GroupID:   product.GroupID,
			Active:    product.Active,
			UpdatedAt: product.UpdatedAt.String(),
		})
	}

	return &GroupResponse{
		Id:        res.ID,
		Name:      res.Name,
		Desc:      res.Desc,
		Deposit:   res.Deposit,
		CreatedAt: res.CreatedAt.String(),
		Products:  products}, nil
}

func (a *AssortmentService) CreateGroup(ctx context.Context, group GroupRequest) (*GroupResponse, error) {
	res, err := a.groupRepo.Create(ctx, &model.Group{Name: group.Name, Desc: group.Desc, Deposit: group.Deposit})
	if err != nil {
		return nil, err
	}
	return &GroupResponse{
		Id:        res.ID,
		Name:      res.Name,
		Desc:      res.Desc,
		Deposit:   res.Deposit,
		CreatedAt: res.CreatedAt.String(),
	}, nil
}

func (a *AssortmentService) UpdateGroup(ctx context.Context, id string, group GroupRequest) (*GroupResponse, error) {
	res, err := a.groupRepo.Update(ctx, id, &model.Group{Name: group.Name, Desc: group.Desc})
	if err != nil {
		return nil, err
	}
	return &GroupResponse{
		Id:        res.ID,
		Name:      res.Name,
		Desc:      res.Desc,
		Deposit:   res.Deposit,
		CreatedAt: res.CreatedAt.String(),
	}, nil
}

func (a *AssortmentService) DeleteGroup(ctx context.Context, id string) (bool, error) {
	return a.groupRepo.Delete(ctx, id)
}

func (a *AssortmentService) GetGroupProducts(ctx context.Context, id string) ([]ProductResponse, error) {
	res, err := a.productRepo.ReadByGroupId(ctx, id)
	if err != nil {
		return nil, err
	}
	var products []ProductResponse
	for _, product := range res {
		products = append(products, ProductResponse{
			Id:        product.ID,
			Name:      product.Name,
			Desc:      product.Desc,
			Price:     product.Price,
			GroupID:   product.GroupID,
			UpdatedAt: product.UpdatedAt.String(),
		})
	}
	if len(products) == 0 {
		return nil, fmt.Errorf("no products found")
	}
	return products, nil
}

func (a *AssortmentService) CreateProduct(ctx context.Context, product ProductRequest) (*ProductResponse, error) {
	res, err := a.productRepo.Create(ctx, &model.Product{
		Name:    product.Name,
		Desc:    product.Desc,
		Price:   product.Price,
		GroupID: product.GroupID,
	})
	if err != nil {
		return nil, err
	}
	return &ProductResponse{
		Id:        res.ID,
		Name:      res.Name,
		Desc:      res.Desc,
		Price:     res.Price,
		GroupID:   res.GroupID,
		UpdatedAt: res.UpdatedAt.String(),
	}, nil
}

func (a *AssortmentService) UpdateProduct(ctx context.Context, id string, product ProductRequest) (*ProductResponse, error) {
	res, err := a.productRepo.Update(ctx, id, &model.Product{
		Name:    product.Name,
		Desc:    product.Desc,
		Price:   product.Price,
		GroupID: product.GroupID,
	})
	if err != nil {
		return nil, err
	}
	return &ProductResponse{
		Id:        res.ID,
		Name:      res.Name,
		Desc:      res.Desc,
		Price:     res.Price,
		GroupID:   res.GroupID,
		UpdatedAt: res.UpdatedAt.String(),
	}, nil
}

func (a *AssortmentService) DeleteProduct(ctx context.Context, id string) (bool, error) {
	return a.productRepo.Delete(ctx, id)
}
