package assortment

import (
	"context"

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

func (r *ProductRepo) Read(ctx context.Context) ([]*domain.Product, error) {
	products := make([]*domain.Product, 0)
	if err := r.db.WithContext(ctx).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (r *ProductRepo) ReadById(ctx context.Context, id string) (*domain.Product, error) {
	var product domain.Product
	if err := r.db.WithContext(ctx).Model(&domain.Product{}).Where("id = ?", id).Find(&product).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *ProductRepo) ReadByIds(ctx context.Context, ids ...string) (domain.Products, error) {
	var p domain.Products
	if err := r.db.WithContext(ctx).Find(&p, ids).Error; err != nil {
		return nil, err
	}
	return p, nil
}

func (r *ProductRepo) ReadByGroupId(ctx context.Context, id string) (domain.Products, error) {
	var products domain.Products
	if err := r.db.WithContext(ctx).Where("product_group_id = ?", id).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (r *ProductRepo) Update(ctx context.Context, product domain.Product) (*domain.Product, error) {
	if err := r.db.WithContext(ctx).Model(&product).Updates(
		map[string]any{
			"name":   product.Name,
			"desc":   product.Desc,
			"price":  product.Price,
			"active": product.Active,
		}).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *ProductRepo) Delete(ctx context.Context, p domain.Product) error {
	if err := r.db.WithContext(ctx).Model(&domain.ViewProduct{}).Delete(&domain.ViewProduct{}, "product_id = ?", p.ID).Error; err != nil {
		return err
	}
	if err := r.db.WithContext(ctx).Model(&domain.Product{}).Delete(&p).Error; err != nil {
		return err
	}
	return nil
}

func (r *ProductRepo) GetProductViews(ctx context.Context, p *domain.Product) ([]*domain.ViewProduct, error) {
	var views []*domain.ViewProduct
	if err := r.db.WithContext(ctx).Model(&domain.ViewProduct{}).Where("product_id = ?", p.ID).Preload("View").Find(&views).Error; err != nil {
		return nil, err
	}
	return views, nil
}

func (r *ProductRepo) AppendProductViews(ctx context.Context, p *domain.Product, vps ...*domain.ViewProduct) error {
	var viewIds []string
	for _, vp := range vps {
		viewIds = append(viewIds, vp.ViewId)
	}

	var views []domain.View
	if err := r.db.WithContext(ctx).Model(&domain.View{}).Find(&views, "id IN ?", viewIds).Error; err != nil {
		return err
	}

	if err := r.db.WithContext(ctx).Model(&p).Association("Views").Append(&views); err != nil {
		return err
	}

	var viewProducts []domain.ViewProduct
	if err := r.db.WithContext(ctx).Model(&domain.ViewProduct{}).Find(&viewProducts, "product_id = ?", p.ID).Error; err != nil {
		return err
	}

	for i, vp := range viewProducts {
		vp.Color = vps[i].Color
		vp.Position = vps[i].Position
		if err := r.db.WithContext(ctx).Save(&vp).Error; err != nil {
			return err
		}
	}
	return nil
}

func (r *ProductRepo) ReplaceProductViews(ctx context.Context, p *domain.Product, vps ...*domain.ViewProduct) error {
	var viewIds []string
	for _, vp := range vps {
		viewIds = append(viewIds, vp.ViewId)
	}

	var views []domain.View
	if err := r.db.WithContext(ctx).Model(&domain.View{}).Find(&views, "id IN ?", viewIds).Error; err != nil {
		return err
	}

	if err := r.db.WithContext(ctx).Model(&p).Association("Views").Replace(&views); err != nil {
		return err
	}

	var viewProducts []domain.ViewProduct
	if err := r.db.WithContext(ctx).Model(&domain.ViewProduct{}).Where("product_id = ?", p.ID).Find(&viewProducts).Error; err != nil {
		return err
	}

	for i, vp := range viewProducts {
		vp.Color = vps[i].Color
		vp.Position = vps[i].Position
		if err := r.db.WithContext(ctx).Save(&vp).Error; err != nil {
			return err
		}
	}
	return nil
}

func (r *ProductRepo) RemoveProductViews(ctx context.Context, id string, viewIds ...string) error {
	return r.db.WithContext(ctx).Delete(&domain.ViewProduct{}, "product_id = ? AND view_id IN ?", id, viewIds).Error
}
