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

func (r *ProductRepo) ReadAll(ctx context.Context) (products []model.Product, err error) {
	res := r.db.
		WithContext(ctx).Model(&model.Product{}).
		Order("name").Order(clause.OrderByColumn{Column: clause.Column{Name: "desc"}}).Find(&products)
	if res.Error != nil {
		return nil, res.Error
	}
	return products, nil
}

func (r *ProductRepo) ReadByGroupID(ctx context.Context, group_id string) (products []model.Product, err error) {
	res := r.db.WithContext(ctx).Where("group_id = ?", group_id).
		Order("name").Order(clause.OrderByColumn{Column: clause.Column{Name: "desc"}}).Find(&products)
	if res.Error != nil {
		return nil, res.Error
	}
	return products, nil
}

func (r *ProductRepo) Create(ctx context.Context, product *model.Product) (*model.Product, error) {
	res := r.db.WithContext(ctx).Create(&product)
	if res.Error != nil {
		return nil, res.Error
	}
	return product, nil
}

func (r *ProductRepo) ImportMany(ctx context.Context, group_id string, products *[]model.Product) ([]model.Product, error) {
	for i := range *products {
		(*products)[i].GroupID = group_id
	}
	res := r.db.WithContext(ctx).CreateInBatches(products, len(*products))
	if res.Error != nil {
		return nil, res.Error
	}
	return *products, nil
}

func (r *ProductRepo) Update(ctx context.Context, id string, product *model.Product) (*model.Product, error) {
	res := r.db.WithContext(ctx).Model(&model.Product{}).Where("id = ?", id).Updates(&product)
	if res.Error != nil {
		return nil, res.Error
	}
	return product, nil
}

func (r *ProductRepo) Delete(ctx context.Context, id string) (bool, error) {
	res := r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Product{})
	if res.Error != nil {
		return false, res.Error
	}
	return !(res.RowsAffected == 0), nil
}

// func (r *ProductRepo) GetByID(id string) {
// 	var product model.Product
// 	r.DB.Where("id = ?", id).First(&product)
// }
