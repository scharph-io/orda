package repository

import (
	"context"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"gorm.io/gorm"
)

type SummaryRepository struct {
	db *gorm.DB
}

func NewSummaryRepository(db *gorm.DB) *SummaryRepository {
	return &SummaryRepository{db}
}

var _ ports.ISummaryRepository = (*SummaryRepository)(nil)

func (sr *SummaryRepository) Create(ctx context.Context, s *domain.Summary) error {
	return sr.db.WithContext(ctx).Create(s).Error
}

func (sr *SummaryRepository) Read(ctx context.Context) (summaries []*domain.Summary, err error) {
	err = sr.db.WithContext(ctx).Find(&summaries).Limit(12).Error
	return
}

func (sr *SummaryRepository) Update(ctx context.Context, s *domain.Summary) error {
	return sr.db.WithContext(ctx).Save(s).Error
}

func (sr *SummaryRepository) Delete(ctx context.Context, id uint) error {
	return sr.db.WithContext(ctx).Delete(&domain.Summary{}, id).Error
}
