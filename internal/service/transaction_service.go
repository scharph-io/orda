package service

import (
	"context"
	"database/sql"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
)

type TransactionService struct {
	TransactionRepository     ports.ITransactionRepository
	TransactionItemRepository ports.ITransactionItemRepository
	ProductRepository         ports.IProductRepository
}

func NewTransactionService(tr ports.ITransactionRepository, tir ports.ITransactionItemRepository, p ports.IProductRepository) *TransactionService {
	return &TransactionService{
		TransactionRepository:     tr,
		TransactionItemRepository: tir,
		ProductRepository:         p,
	}
}

var _ ports.ITransactionService = (*TransactionService)(nil)

func (s *TransactionService) Create(ctx context.Context, t ports.TransactionRequest) (*ports.TransactionResponse, error) {

	pIds := make([]string, 0)
	for _, item := range t.Items {
		pIds = append(pIds, item.ProductID)
	}

	products, err := s.ProductRepository.ReadByIds(ctx, pIds)
	if err != nil {
		return nil, err
	}

	pMap := make(map[string]int32)
	for _, p := range products {
		pMap[p.ID] = p.Price
	}

	var total int32 = 0
	var items []*domain.TransactionItem
	for _, item := range t.Items {
		total += pMap[item.ProductID] * int32(item.Quantity)
		items = append(items, &domain.TransactionItem{
			ProductID: item.ProductID,
			Qty:       int8(item.Quantity),
			Price:     pMap[item.ProductID],
		})
	}

	transaction := &domain.Transaction{
		PaymentOption: t.PaymentOption,
		AccountType:   t.AccountType,
		UserID:        t.UserID,
		AccountID:     sql.NullString{String: t.AccountID, Valid: true},
		Total:         total,
		Items:         items,
	}

	transaction, err = s.TransactionRepository.Create(ctx, transaction)

	return &ports.TransactionResponse{
		TransactionID: transaction.ID,
		Total:         transaction.Total,
		ItemsLength:   len(transaction.Items),
	}, nil
}
func (s *TransactionService) Read(ctx context.Context) ([]*ports.TransactionResponse, error) {
	return nil, nil
}
func (s *TransactionService) ReadByID(ctx context.Context, id string) (*ports.TransactionResponse, error) {
	return nil, nil
}
func (s *TransactionService) ReadItemsByTransactionID(ctx context.Context, transactionID string) ([]*ports.TransactionResponse, error) {
	return nil, nil
}
func (s *TransactionService) Update(ctx context.Context, t ports.TransactionRequest) (*ports.TransactionResponse, error) {
	return nil, nil
}
func (s *TransactionService) Delete(ctx context.Context, id string) error {
	return nil
}
