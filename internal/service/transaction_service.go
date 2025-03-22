package service

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/util"
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

func (s *TransactionService) Create(ctx context.Context, userid string, t ports.TransactionRequest) (*ports.TransactionResponse, error) {
	// Deposit
	if len(t.Deposits) > 0 {
		fmt.Println(t.Deposits)
	}

	ids := util.MapSlice(t.Items, func(i ports.ItemRequest) string {
		return i.Id
	})
	products, err := s.productRepo.ReadByIds(ctx, ids...)
	if err != nil {
		return nil, err
	}

	var total int32 = 0
	var items []*domain.TransactionItem
	for index, p := range products {
		total += p.Price * int32(t.Items[index].Quantity)
		items = append(items, &domain.TransactionItem{
			ProductID: p.ID,
			Qty:       t.Items[index].Quantity,
			Price:     p.Price,
		})
	}

	for _, d := range t.Deposits {
		total += int32(d.Quantity) * d.Price
		items = append(items, &domain.TransactionItem{
			ProductID: "deposit",
			Qty:       d.Quantity,
			Price:     d.Price,
		})
	}

	var acc sql.NullString
	if t.AccountID != nil {
		acc = sql.NullString{String: *t.AccountID, Valid: true}
	} else {
		acc = sql.NullString{Valid: false}
	}

	transaction := &domain.Transaction{
		PaymentOption: t.PaymentOption,
		UserID:        userid,
		AccountID:     acc,
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
			// Account:       fmt.Sprintf("%s %s", v.Account.Firstname, v.Account.Lastname),
			// Account: *ports.AccountResponse{
			// 	Firstname: v.Account.Firstname,
			// },
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
		// AccountType:   int(t.AccountType),

		// Account:       fmt.Sprintf("%s %s", t.Account.Firstname, t.Account.Lastname),
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
