package assortment

import (
	"context"
	"fmt"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"gorm.io/gorm"
)

type ProductRepo struct {
	db *gorm.DB
}

func NewProductRepo(db *gorm.DB) *ProductRepo {
	return &ProductRepo{db}
}

var _ ports.IProductRepository = (*ProductRepo)(nil)

func (r *ProductRepo) Create(ctx context.Context, product domain.Product) (*domain.Product, error) {
	if err := r.db.WithContext(ctx).Create(&product).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *ProductRepo) ReadById(ctx context.Context, id string) (*domain.Product, error) {
	var product domain.Product
	if err := r.db.WithContext(ctx).Model(&domain.Product{}).Where("id = ?", id).Find(&product).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *ProductRepo) ReadByIds(ctx context.Context, ids []string) (domain.Products, error) {
	var p domain.Products
	if err := r.db.WithContext(ctx).Find(&p, ids).Error; err != nil {
		return nil, err
	}
	return p, nil
}

func (r *ProductRepo) CreateMany(ctx context.Context, products []domain.Product) error {
	return r.db.WithContext(ctx).CreateInBatches(products, len(products)).Error
}

func (r *ProductRepo) Read(ctx context.Context) (domain.Products, error) {
	var products domain.Products
	if err := r.db.WithContext(ctx).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (r *ProductRepo) Update(ctx context.Context, product domain.Product) (*domain.Product, error) {
	if err := r.db.WithContext(ctx).Model(&product).Updates(
		map[string]interface{}{
			"name":   product.Name,
			"desc":   product.Desc,
			"price":  product.Price,
			"active": product.Active,
		}).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *ProductRepo) Delete(ctx context.Context, product domain.Product) error {
	fmt.Println("Remove", product)

	if err := r.db.WithContext(ctx).Model(&domain.Product{}).Delete(&product).Error; err != nil {
		return err
	}
	return nil
}

func (r *ProductRepo) ReadByGroupID(ctx context.Context, groupID string) (domain.Products, error) {
	var products domain.Products
	if err := r.db.WithContext(ctx).Where("product_group_id = ?", groupID).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (r *ProductRepo) ReadByID(ctx context.Context, id string) (*domain.Product, error) {
	var product domain.Product
	if err := r.db.WithContext(ctx).Model(&domain.Product{}).Where("id = ?", id).Find(&product).Error; err != nil {
		return nil, err
	}
	return &product, nil
}
