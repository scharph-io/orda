package service

import (
	"context"
	"time"

	"github.com/scharph/orda/internal/ports"
)

type StatisticsService struct {
	repo ports.IStatisticsRepository
}

var _ ports.IStatisticsService = (*StatisticsService)(nil)

func NewStatisticsService(repo ports.IStatisticsRepository) *StatisticsService {
	return &StatisticsService{repo: repo}
}

func (s *StatisticsService) GetTransactionDays(ctx context.Context, year int) (ports.TransactionDays, error) {
	if year > time.Now().Year() {
		return nil, ports.ErrInvalidYear
	}
	return s.repo.GetTransactionDays(ctx, year)
}
