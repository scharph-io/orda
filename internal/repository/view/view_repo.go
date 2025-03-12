package view

import (
	"context"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"gorm.io/gorm"
)

type ViewRepo struct {
	db *gorm.DB
}

func NewViewRepository(db *gorm.DB) *ViewRepo {
	return &ViewRepo{db}
}

var _ ports.IViewRepository = (*ViewRepo)(nil)

func (r *ViewRepo) Create(ctx context.Context, view domain.View) (*domain.View, error) {
	if err := r.db.Create(&view).Error; err != nil {
		return nil, err
	}
	return &view, nil
}

func (r *ViewRepo) Read(ctx context.Context) ([]*domain.View, error) {
	var views []*domain.View
	if err := r.db.Preload("Roles").Preload("Products").Find(&views).Error; err != nil {
		return nil, err
	}
	return views, nil
}

func (r *ViewRepo) ReadByID(ctx context.Context, id string) (*domain.View, error) {
	var view domain.View
	if err := r.db.Model(&domain.View{}).
		Where("id = ?", id).
		Preload("Products").
		Preload("Roles").
		Find(&view).Error; err != nil {
		return nil, err
	}
	return &view, nil
}

func (r *ViewRepo) Update(ctx context.Context, view domain.View) (*domain.View, error) {
	if err := r.db.Model(&view).Updates(view).Error; err != nil {
		return nil, err
	}
	return &view, nil
}

func (r *ViewRepo) Delete(ctx context.Context, view domain.View) error {
	return r.db.Delete(&view).Error
}

func (r *ViewRepo) ReplaceRoles(ctx context.Context, view *domain.View, role_ids ...string) error {
	var roles []*domain.Role
	for _, roleId := range role_ids {
		var role domain.Role
		if err := r.db.Model(&role).Where("id = ?", roleId).Find(&role).Error; err != nil {
			return err
		}
		roles = append(roles, &role)
	}
	return r.db.Model(&view).Association("Roles").Replace(roles)
}

func (r *ViewRepo) ReplaceViewProducts(ctx context.Context, v *domain.View, vps ...*domain.ViewProduct) error {
	var productIds []string
	for _, vp := range vps {
		productIds = append(productIds, vp.ProductId)
	}

	var products []domain.Product
	if err := r.db.WithContext(ctx).Model(&domain.Product{}).Where("id IN ?", productIds).Find(&products).Error; err != nil {
		return err
	}
	if err := r.db.WithContext(ctx).Model(&v).Association("Products").Replace(&products); err != nil {
		return err
	}
	var viewProducts []domain.ViewProduct
	if err := r.db.WithContext(ctx).Model(&domain.ViewProduct{}).Where("view_id = ?", v.ID).Find(&viewProducts).Error; err != nil {
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

func (r *ViewRepo) AppendViewProducts(ctx context.Context, v *domain.View, vps ...*domain.ViewProduct) error {
	var productIds []string
	for _, vp := range vps {
		productIds = append(productIds, vp.ProductId)
	}

	var products []domain.Product
	if err := r.db.WithContext(ctx).Model(&domain.Product{}).Where("id IN ?", productIds).Find(&products).Error; err != nil {
		return err
	}

	if err := r.db.WithContext(ctx).Model(&v).Association("Products").Append(&products); err != nil {
		return err
	}
	var viewProducts []domain.ViewProduct
	if err := r.db.WithContext(ctx).Model(&domain.ViewProduct{}).Where("view_id = ? AND product_id IN ?", v.ID, productIds).Find(&viewProducts).Error; err != nil {
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

// func (r *ViewRepo) RemoveViewProducts(ctx context.Context, v *domain.View, ps ...*domain.ViewProduct) error {
// 	return r.db.WithContext(ctx).Model(&v).Association("Products").Delete(ps)
// }

func (r *ViewRepo) AddViewProducts(ctx context.Context, v *domain.View, vps ...*domain.ViewProduct) error {
	for _, vp := range vps {
		if err := r.db.WithContext(ctx).Model(vp).Create(vp).Error; err != nil {
			return err
		}
	}
	return nil
}

func (r *ViewRepo) RemoveViewProducts(ctx context.Context, v *domain.View, vps ...*domain.ViewProduct) error {
	for _, vp := range vps {
		if err := r.db.WithContext(ctx).Model(vp).Delete(vp).Error; err != nil {
			return err
		}
	}
	return nil
}
