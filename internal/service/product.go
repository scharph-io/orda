package service

import (
	"context"

	"github.com/scharph/orda/internal/model"
	"github.com/scharph/orda/internal/repository"
)

type ProductService struct {
	groupRepo   repository.GroupRepo
	productRepo repository.ProductRepo
}

func NewProductService(groupRepo repository.GroupRepo, productRepo repository.ProductRepo) *ProductService {
	return &ProductService{groupRepo, productRepo}
}

func (s *ProductService) GetProducts(ctx context.Context) ([]model.Product, error) {
	return s.productRepo.Read(ctx)
}

func (s *ProductService) GetProductsByGroupID(ctx context.Context, group_id string) ([]model.Product, error) {
	return s.productRepo.ReadByGroupID(ctx, group_id)
}

func (s *ProductService) ImportProducts(ctx context.Context, products *[]model.Product, group_id string) ([]model.Product, error) {
	return s.productRepo.ImportMany(ctx, products, group_id)
}

func (s *ProductService) CreateProduct(ctx context.Context, product *model.Product) (*model.Product, error) {
	return s.productRepo.Create(ctx, product)
}
func (s *ProductService) UpdateProduct(ctx context.Context, id string, product *model.Product) (*model.Product, error) {
	return s.productRepo.Update(ctx, id, product)
}

func (s *ProductService) DeleteProduct(ctx context.Context, id string) (bool, error) {
	return s.productRepo.Delete(ctx, id)
}

func (s *ProductService) CreateGroup(ctx context.Context, group *model.Group) (*model.Group, error) {
	return s.groupRepo.Create(ctx, group)
}

func (s *ProductService) GetGroups(ctx context.Context) ([]model.Group, error) {
	return s.groupRepo.Read(ctx)
}

func (s *ProductService) UpdateGroup(ctx context.Context, id string, group *model.Group) (*model.Group, error) {
	return s.groupRepo.Update(ctx, id, group)
}

func (s *ProductService) DeleteGroup(ctx context.Context, id string) (bool, error) {
	return s.groupRepo.Delete(ctx, id)
}

func (s *ProductService) GetGroupProducts(ctx context.Context, id string) ([]model.Product, error) {
	return s.productRepo.ReadByGroupID(ctx, id)
}
