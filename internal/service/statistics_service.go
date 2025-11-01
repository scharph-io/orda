package service

import (
	"context"
	"fmt"
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

func (s *StatisticsService) GetProductsQtyDatasets(ctx context.Context, startDate, endDate time.Time, productIds ...string) (*ports.ProductQuantitiesDatasets, error) {

	fmt.Println(productIds)
	exists, err := s.repo.ProductsExists(ctx, productIds)
	if err != nil || !exists {
		if err != nil {
			return nil, fmt.Errorf("failed to check product existence: %w", err)
		}
		return nil, fmt.Errorf("not all products found")
	}

	dates, err := s.repo.GetTransactionDates(ctx, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("failed to get transaction dates: %w", err)
	}

	var datasets []*ports.ProductQuantitiesDataset
	for _, p := range productIds {
		dataset, err := s.repo.GetProductQtyForDateRange(ctx, startDate, endDate, p)
		if err != nil {
			return nil, fmt.Errorf("failed to get dataset for product %s: %w", p, err)
		}
		datasets = append(datasets, &ports.ProductQuantitiesDataset{
			ProductId: p,
			Dataset:   dataset,
		})
	}

	return &ports.ProductQuantitiesDatasets{
		Dates:    dates,
		Datasets: datasets,
	}, nil
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
