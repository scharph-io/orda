package service

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
)

type AccountHistoryService struct {
	repo ports.IAccountHistoryRepository
}

var _ ports.IAccountHistoryService = (*AccountHistoryService)(nil)

func NewAccountHistoryService(repo ports.IAccountHistoryRepository) *AccountHistoryService {
	return &AccountHistoryService{repo}
}

func (s *AccountHistoryService) Log(ctx context.Context, user_id string, depositReq ...ports.LogRequest) error {
	logs := make([]domain.AccountHistory, 0)
	for _, req := range depositReq {
		var accountGroupId sql.NullString
		if req.AccountGroupId != nil {
			accountGroupId = sql.NullString{String: *req.AccountGroupId, Valid: true}
		} else {
			accountGroupId = sql.NullString{Valid: false}
		}

		var accountId sql.NullString
		if req.AccountId != nil {
			accountId = sql.NullString{String: *req.AccountId, Valid: true}
		} else {
			accountId = sql.NullString{Valid: false}
		}

		var transactionId sql.NullString
		if req.TransactionId != nil {
			transactionId = sql.NullString{String: *req.TransactionId, Valid: true}
		} else {
			transactionId = sql.NullString{Valid: false}
		}

		logs = append(logs, domain.AccountHistory{
			Amount:         req.Amount,
			AccountGroupID: accountGroupId,
			AccountID:      accountId,
			HistoryAction:  req.HistoryAction,
			DepositType:    req.DepositType,
			UserID:         user_id,
			TransactionID:  transactionId,
			Reason:         req.Reason,
		})
	}
	if _, err := s.repo.Create(ctx, logs...); err != nil {
		return err
	}
	return nil
}

func (s *AccountHistoryService) GetByAccountId(ctx context.Context, t ports.HistoryType, id string) ([]*ports.AccountHistoryResponse, error) {
	res := make([]*ports.AccountHistoryResponse, 0)
	if t == ports.HistoryTypeAccount {
		logs, err := s.repo.ReadByAccountId(ctx, id)
		if err != nil {
			return nil, err
		}

		for _, h := range logs {
			res = append(res, &ports.AccountHistoryResponse{
				Id:            h.ID,
				Amount:        h.Amount,
				Account:       fmt.Sprintf("%s %s", h.Account.Firstname, h.Account.Lastname),
				DepositType:   h.DepositType,
				HistoryAction: h.HistoryAction,
			})
		}
	} else if t == ports.HistoryTypeGroup {
		logs, err := s.repo.ReadByAccountGroupId(ctx, id)
		if err != nil {
			return nil, err
		}
		for _, h := range logs {
			res = append(res, &ports.AccountHistoryResponse{
				Id:           h.ID,
				Amount:       h.Amount,
				AccountGroup: h.AccountGroup.Name,
			})
		}
	}
	return res, nil
}

func (s *AccountHistoryService) GetByAccountGroupId(ctx context.Context, t ports.HistoryType, id string) ([]*ports.AccountHistoryResponse, error) {
	return nil, nil
}
