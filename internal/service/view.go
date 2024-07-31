package service

import (
	"context"

	"github.com/scharph/orda/internal/model"
	"github.com/scharph/orda/internal/repository"
)

type ViewResonpse struct {
	Name      string `json:"name"`
	ProductID string `json:"product_id"`
}

// ProductView is a service that provides view functions for products.
type ViewService struct {
	repo repository.ViewRepo
}

// NewProductView creates a new ProductView service.
func NewViewService(repo repository.ViewRepo) *ViewService {
	return &ViewService{repo}
}

// Read returns all views.
func (s *ViewService) GetViews(ctx context.Context) ([]model.View, error) {

	return s.repo.Read(ctx)
}

// ReadByViewID returns a view by its viewID.
