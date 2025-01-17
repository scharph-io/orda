package repository

import (
	"context"

	"github.com/scharph/orda/internal/domain"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ProductRepo struct {
	db *gorm.DB
}

func NewProductRepo(db *gorm.DB) *ProductRepo {
	return &ProductRepo{db}
}

func (r *ProductRepo) Create(ctx context.Context, product *domain.Product) (*domain.Product, error) {
	res := r.db.WithContext(ctx).Create(&product)
	if res.Error != nil {
		return nil, res.Error
	}
	return product, nil
}

func (r *ProductRepo) Read(ctx context.Context) (products []domain.Product, err error) {
	res := r.db.
		WithContext(ctx).Model(&domain.Product{}).
		Order("name").Order(clause.OrderByColumn{Column: clause.Column{Name: "desc"}}).Find(&products)
	if res.Error != nil {
		return nil, res.Error
	}
	return products, nil
}

func (r *ProductRepo) ReadByID(ctx context.Context, id string) (product *domain.Product, err error) {
	res := r.db.WithContext(ctx).Where("id = ?", id).First(&product)
	if res.Error != nil {
		return nil, res.Error
	}
	return product, nil
}

func (r *ProductRepo) ReadByGroupId(ctx context.Context, group_id string) (products []domain.Product, err error) {
	res := r.db.WithContext(ctx).Where("group_id = ?", group_id).
		Order("name").Order(clause.OrderByColumn{Column: clause.Column{Name: "desc"}}).Find(&products)
	if res.Error != nil {
		return nil, res.Error
	}
	return products, nil
}

func (r *ProductRepo) ImportMany(ctx context.Context, products *[]domain.Product, group_id string) ([]domain.Product, error) {
	for i := range *products {
		(*products)[i].GroupID = group_id
	}
	res := r.db.WithContext(ctx).CreateInBatches(products, len(*products))
	if res.Error != nil {
		return nil, res.Error
	}
	return *products, nil
}

func (r *ProductRepo) Update(ctx context.Context, id string, new *domain.Product) (*domain.Product, error) {
	var product domain.Product
	res := r.db.WithContext(ctx).Model(&domain.Product{}).Where("id = ?", id).Find(&product)
	if res.Error != nil {
		return nil, res.Error
	}

	product.Name = new.Name
	product.Desc = new.Desc
	product.Price = new.Price
	product.GroupID = new.GroupID
	product.Active = new.Active

	if res := r.db.WithContext(ctx).Save(&product); res.Error != nil {
		return nil, res.Error
	}
	return &product, nil
}

func (r *ProductRepo) Delete(ctx context.Context, id string) (bool, error) {
	res := r.db.WithContext(ctx).Where("id = ?", id).Delete(&domain.Product{})
	if res.Error != nil {
		return false, res.Error
	}
	return !(res.RowsAffected == 0), nil
}

func (r *ProductRepo) DeleteByGroupId(ctx context.Context, group_id string) (bool, error) {
	res := r.db.WithContext(ctx).Where("group_id = ?", group_id).Delete(&domain.Product{})
	if res.Error != nil {
		return false, res.Error
	}
	return !(res.RowsAffected == 0), nil
}
