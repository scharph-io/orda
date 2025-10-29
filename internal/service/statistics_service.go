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
	return s.repo.GetTransactionDays(ctx, year)
}

func (s *StatisticsService) GetProductsForDateRange(ctx context.Context, startDate, endDate time.Time) (ports.ProductsForDateRange, error) {
	return s.repo.GetProductsForDateRange(ctx, startDate, endDate)
}

func (s *StatisticsService) GetProductQtyForDateRange(ctx context.Context, productId string, startDate, endDate time.Time) (ports.ProductQuantitiesForDateRange, error) {
	return s.repo.GetProductQtyForDateRange(ctx, productId, startDate, endDate)
}

func (s *StatisticsService) GetProductsQtyDatasets(ctx context.Context, startDate, endDate time.Time, productIds ...string) (ports.ProductQuantitiesDatasets, error) {
	res := make(ports.ProductQuantitiesDatasets, 0)
	for _, id := range productIds {
		x, err := s.repo.GetProductQtyForDateRange(ctx, id, startDate, endDate)
		if err != nil {
			return nil, err
		}
		res = append(res, &ports.ProductQuantitiesDataset{
			ProductId: id,
			Dataset:   x,
		})
	}
	return res, nil
}

func (s *StatisticsService) GetPaymentOptionsForDateRange(ctx context.Context, startDate, endDate time.Time) (map[int]*ports.PaymentOptionForDateRange, error) {
	x, err := s.repo.GetPaymentOptionsForDateRange(ctx, startDate, endDate)
	if err != nil {
		return nil, err
	}

	result := make(map[int]*ports.PaymentOptionForDateRange)
	for _, s := range x {
		result[int(s.PaymentOption)] = s
	}

	return result, nil
}
