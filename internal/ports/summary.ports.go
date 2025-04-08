package ports

import (
	"context"

	"github.com/scharph/orda/internal/domain"
)

type ISummaryRepository interface {
	Create(ctx context.Context, s *domain.Summary) error
	Read(ctx context.Context) ([]*domain.Summary, error)
	Update(ctx context.Context, s *domain.Summary) error
	Delete(ctx context.Context, id uint) error
}
