package service

import (
	"context"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
)

type TransactionService struct {
	TransactionRepository     ports.ITransactionRepository
	TransactionItemRepository ports.ITransactionItemRepository
}

func NewTransactionService(transactionRepository ports.ITransactionRepository, transactionItemRepository ports.ITransactionItemRepository) *TransactionService {
	return &TransactionService{
		TransactionRepository:     transactionRepository,
		TransactionItemRepository: transactionItemRepository,
	}
}

var _ ports.ITransactionService = (*TransactionService)(nil)

func (s *TransactionService) Create(ctx context.Context, transaction domain.Transaction) (*domain.Transaction, error) {
	return nil, nil
}
func (s *TransactionService) Read(ctx context.Context) ([]*domain.Transaction, error) {
	return nil, nil
}
func (s *TransactionService) ReadByID(ctx context.Context, id string) (*domain.Transaction, error) {
	return nil, nil
}
func (s *TransactionService) ReadItemsByTransactionID(ctx context.Context, transactionID string) ([]*domain.TransactionItem, error) {
	return nil, nil
}
func (s *TransactionService) Update(ctx context.Context, transaction domain.Transaction) (*domain.Transaction, error) {
	return nil, nil
}
func (s *TransactionService) Delete(ctx context.Context, id string) error {
	return nil
}
