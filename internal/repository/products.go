package repository

import (
	"context"

	"github.com/scharph/orda/internal/model"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ProductRepo struct {
	db *gorm.DB
}

func NewProductRepo(db *gorm.DB) *ProductRepo {
	return &ProductRepo{db}
}

func (r *ProductRepo) Create(ctx context.Context, product *model.Product) (*model.Product, error) {
	res := r.db.WithContext(ctx).Create(&product)
	if res.Error != nil {
		return nil, res.Error
	}
	return product, nil
}

func (r *ProductRepo) Read(ctx context.Context) (products []model.Product, err error) {
	res := r.db.
		WithContext(ctx).Model(&model.Product{}).
		Order("name").Order(clause.OrderByColumn{Column: clause.Column{Name: "desc"}}).Find(&products)
	if res.Error != nil {
		return nil, res.Error
	}
	return products, nil
}

func (r *ProductRepo) ReadByID(ctx context.Context, id string) (product *model.Product, err error) {
	res := r.db.WithContext(ctx).Where("id = ?", id).First(&product)
	if res.Error != nil {
		return nil, res.Error
	}
	return product, nil
}

func (r *ProductRepo) ReadByGroupId(ctx context.Context, group_id string) (products []model.Product, err error) {
	res := r.db.WithContext(ctx).Where("group_id = ?", group_id).
		Order("name").Order(clause.OrderByColumn{Column: clause.Column{Name: "desc"}}).Find(&products)
	if res.Error != nil {
		return nil, res.Error
	}
	return products, nil
}

func (r *ProductRepo) ImportMany(ctx context.Context, products *[]model.Product, group_id string) ([]model.Product, error) {
	for i := range *products {
		(*products)[i].GroupID = group_id
	}
	res := r.db.WithContext(ctx).CreateInBatches(products, len(*products))
	if res.Error != nil {
		return nil, res.Error
	}
	return *products, nil
}

func (r *ProductRepo) Update(ctx context.Context, id string, new *model.Product) (*model.Product, error) {
	var product model.Product
	res := r.db.WithContext(ctx).Model(&model.Product{}).Where("id = ?", id).Find(&product)
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
	res := r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Product{})
	if res.Error != nil {
		return false, res.Error
	}
	return !(res.RowsAffected == 0), nil
}

func (r *ProductRepo) DeleteByGroupId(ctx context.Context, group_id string) (bool, error) {
	res := r.db.WithContext(ctx).Where("group_id = ?", group_id).Delete(&model.Product{})
	if res.Error != nil {
		return false, res.Error
	}
	return !(res.RowsAffected == 0), nil
}
