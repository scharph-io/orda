package service

import (
	"context"
	"database/sql"
	"fmt"
	"sync"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/util"
)

type TransactionService struct {
	mu             sync.Mutex
	repo           ports.ITransactionRepository
	itemRepo       ports.ITransactionItemRepository
	productRepo    ports.IProductRepository
	accountService ports.IAccountService
}

func NewTransactionService(tr ports.ITransactionRepository, tir ports.ITransactionItemRepository, p ports.IProductRepository, as ports.IAccountService) *TransactionService {
	return &TransactionService{
		repo:           tr,
		itemRepo:       tir,
		productRepo:    p,
		accountService: as,
	}
}

var _ ports.ITransactionService = (*TransactionService)(nil)

func (s *TransactionService) Create(ctx context.Context, userid string, t ports.TransactionRequest) (*ports.TransactionResponse, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	productIds := util.MapSlice(t.Items, func(i ports.ItemRequest) string {
		return i.Id
	})
	products, err := s.productRepo.ReadByIds(ctx, productIds...)
	if err != nil {
		return nil, err
	}

	var total int32 = 0
	var items []domain.TransactionItem
	for index, p := range products {
		total += p.Price * int32(t.Items[index].Quantity)
		items = append(items, domain.TransactionItem{
			ProductID: p.ID,
			Qty:       t.Items[index].Quantity,
			Price:     p.Price,
		})
	}

	var acc sql.NullString
	if t.AccountID != "" {
		acc = sql.NullString{String: t.AccountID, Valid: true}
	} else {
		acc = sql.NullString{Valid: false}
	}

	transaction := &domain.Transaction{
		PaymentOption: t.PaymentOption,
		UserID:        userid,
		AccountID:     acc,
		Total:         total,
		Items:         items,
		TotalCredit:   0,
	}

	transaction, err = s.repo.Create(ctx, transaction)
	if err != nil {
		return nil, err
	}

	return &ports.TransactionResponse{
		TransactionID: transaction.ID,
		Total:         transaction.Total,
		ItemsLength:   len(transaction.Items),
	}, nil

}

func (s *TransactionService) CreateWithAccount(ctx context.Context, userid string, req ports.TransactionRequest) (*ports.TransactionResponse, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	// Products
	productIds := util.MapSlice(req.Items, func(i ports.ItemRequest) string {
		return i.Id
	})
	products, err := s.productRepo.ReadByIds(ctx, productIds...)
	if err != nil {
		return nil, err
	}

	if len(req.Items) == 0 {
		return nil, fmt.Errorf("no items found")
	}

	if len(req.Items) != len(products) {
		return nil, fmt.Errorf("invalid product ids")
	}

	// Total Products
	var total int32 = 0
	var items []domain.TransactionItem
	for index, p := range products {
		total += p.Price * int32(req.Items[index].Quantity)
		items = append(items, domain.TransactionItem{
			ProductID: p.ID,
			Qty:       req.Items[index].Quantity,
			Price:     p.Price,
		})
	}

	acc, err := s.accountService.GetById(ctx, req.AccountID)
	if err != nil {
		return nil, err
	}

	if acc.CreditBalance == 0 {
		return nil, fmt.Errorf("insufficient balance")
	}

	transaction, err := s.repo.Create(ctx, &domain.Transaction{
		PaymentOption: req.PaymentOption,
		UserID:        userid,
		AccountID:     sql.NullString{String: req.AccountID, Valid: true},
		Total:         total,
		Items:         items,
	})
	if err != nil {
		return nil, err
	}

	debitAmount, err := s.accountService.DebitAmount(ctx, userid, acc.Id, ports.AccDebitRequest{
		Amount:        total,
		TransactionId: transaction.ID,
	})
	if err != nil {
		return nil, err
	}

	transaction.TotalCredit = total - debitAmount.RemainingCash

	updatedTransaction, err := s.repo.Update(ctx, *transaction)
	if err != nil {
		return nil, err
	}

	if debitAmount.RemainingCash > 0 {
		_, err := s.repo.Create(ctx, &domain.Transaction{
			PaymentOption: domain.PaymentOptionCash,
			UserID:        userid,
			AccountID:     sql.NullString{String: req.AccountID, Valid: true},
			Total:         debitAmount.RemainingCash,
			TotalCredit:   0,
		})
		if err != nil {
			return nil, err
		}

	}
	return &ports.TransactionResponse{
		TransactionID: updatedTransaction.ID,
		Total:         updatedTransaction.Total,
		ItemsLength:   len(updatedTransaction.Items),
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

func (s *TransactionService) ReadByDate(ctx context.Context, date string) ([]*ports.TransactionResponse, error) {
	t, err := s.repo.ReadByDate(ctx, date)
	if err != nil {
		return nil, err
	}
	var res []*ports.TransactionResponse
	for _, v := range t {
		res = append(res, &ports.TransactionResponse{
			CreatedAt:     v.CreatedAt.Format("2006-01-02 15:04:05"),
			TransactionID: v.ID,
			Total:         v.Total,
			ItemsLength:   len(v.Items),
			PaymentOption: v.PaymentOption,
			AccountId:     v.AccountID.String,
		})
	}
	return res, nil
}

func (s *TransactionService) ReadSummaryByDate(ctx context.Context, date string) (*ports.TransactionSummaryResponse, error) {
	totals := make(map[uint8]int32)
	cash, _ := s.repo.ReadSummaryByDate(ctx, date, uint8(domain.PaymentOptionCash))
	totals[uint8(domain.PaymentOptionCash)] = cash

	acc, _ := s.repo.ReadSummaryByDate(ctx, date, uint8(domain.PaymentOptionAccount))
	totals[uint8(domain.PaymentOptionAccount)] = acc

	free, _ := s.repo.ReadSummaryByDate(ctx, date, uint8(domain.PaymentOptionFree))
	totals[uint8(domain.PaymentOptionFree)] = free

	credit, _ := s.repo.ReadSummaryByDate(ctx, date, uint8(domain.PaymentOptionSponsor))
	totals[uint8(domain.PaymentOptionSponsor)] = credit

	return &ports.TransactionSummaryResponse{
		Totals: totals,
	}, nil
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
