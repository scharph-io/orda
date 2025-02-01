package service

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
)

type TransactionService struct {
	repo        ports.ITransactionRepository
	itemRepo    ports.ITransactionItemRepository
	productRepo ports.IProductRepository
}

func NewTransactionService(tr ports.ITransactionRepository, tir ports.ITransactionItemRepository, p ports.IProductRepository) *TransactionService {
	return &TransactionService{
		repo:        tr,
		itemRepo:    tir,
		productRepo: p,
	}
}

var _ ports.ITransactionService = (*TransactionService)(nil)

func (s *TransactionService) Create(ctx context.Context, t ports.TransactionRequest) (*ports.TransactionResponse, error) {

	pIds := make([]string, 0)
	for _, item := range t.Items {
		pIds = append(pIds, item.ProductID)
	}

	products, err := s.productRepo.ReadByIds(ctx, pIds)
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

	transaction, err = s.repo.Create(ctx, transaction)

	return &ports.TransactionResponse{
		TransactionID: transaction.ID,
		Total:         transaction.Total,
		ItemsLength:   len(transaction.Items),
	}, nil
}

func (s *TransactionService) Read(ctx context.Context) ([]*ports.TransactionResponse, error) {
	t, err := s.repo.Read(ctx)
	if err != nil {
		return nil, err
	}
	var res []*ports.TransactionResponse
	for _, v := range t {
		res = append(res, &ports.TransactionResponse{
			TransactionID: v.ID,
			Total:         v.Total,
			ItemsLength:   len(v.Items),
			AccountType:   int(v.AccountType),
			PaymentOption: int(v.PaymentOption),
			User:          v.User.Username,
			Account:       fmt.Sprintf("%s %s", v.Account.Firstname, v.Account.Lastname),
		})
	}
	return res, nil

}

func (s *TransactionService) ReadByID(ctx context.Context, id string) (*ports.TransactionResponse, error) {

	t, err := s.repo.ReadByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return &ports.TransactionResponse{
		TransactionID: t.ID,
		Total:         t.Total,
		ItemsLength:   len(t.Items),
		AccountType:   int(t.AccountType),
		PaymentOption: int(t.PaymentOption),
		User:          t.User.Username,
		Account:       fmt.Sprintf("%s %s", t.Account.Firstname, t.Account.Lastname),
	}, nil
}

func (s *TransactionService) ReadItemsByTransactionID(ctx context.Context, transactionID string) ([]*ports.TransactionResponse, error) {

	// items, err := s.TransactionItemRepository.ReadByTransactionID(ctx, transactionID)
	// if err != nil {
	// 	return nil, err

	// }
	// var res []*ports.TransactionResponse
	//

	return nil, fmt.Errorf("Not implemented")
}

func (s *TransactionService) Update(ctx context.Context, t ports.TransactionRequest) (*ports.TransactionResponse, error) {
	return nil, fmt.Errorf("Not implemented")
}

func (s *TransactionService) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, domain.Transaction{Base: domain.Base{ID: id}})
}
