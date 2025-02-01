package service

import (
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

func (s *AccountHistoryService) LogDeposit(depositReq ports.AccountHistoryRequest) error {
	return s.repo.Create(domain.AccountHistory{
		Amount:        depositReq.Amount,
		AccountID:     sql.NullString{String: depositReq.AccountId, Valid: true},
		HistoryAction: depositReq.HistoryAction,
		DepositType:   depositReq.DepositType,
		// UserID:        sql.NullString{String: depositReq.UserId, Valid: true},
		// TransactionID: sql.NullString{String: depositReq.TransactionId, Valid: true},
	})
}

func (s *AccountHistoryService) LogGroupDeposit(depositGroupReq ports.AccountHistoryRequest) error {
	return s.repo.Create(domain.AccountHistory{
		Amount:         depositGroupReq.Amount,
		AccountGroupID: sql.NullString{String: depositGroupReq.AccountGroupId, Valid: true},
		HistoryAction:  depositGroupReq.HistoryAction,
		DepositType:    depositGroupReq.DepositType,
		// UserID:         sql.NullString{String: depositGroupReq.UserId, Valid: true},
	})
}

func (s *AccountHistoryService) Get(t ports.HistoryType, id string) ([]ports.AccountHistoryResponse, error) {
	if t == ports.HistoryTypeAccount {
		histories, err := s.repo.ReadByAccountId(id)
		if err != nil {
			return nil, err
		}

		for _, h := range histories {
			fmt.Printf("%+v\n", h.Account)
		}

		var res []ports.AccountHistoryResponse
		for _, h := range histories {
			res = append(res, ports.AccountHistoryResponse{
				Id:     h.ID,
				Amount: h.Amount,
				Account: ports.AccountResponse{
					Firstname: h.Account.Firstname,
					Lastname:  h.Account.Lastname,
				},
				DepositType:   h.DepositType,
				HistoryAction: h.HistoryAction,
			})
		}

		return res, nil
	} else if t == ports.HistoryTypeGroup {
		histories, err := s.repo.ReadByAccountGroupId(id)
		if err != nil {
			return nil, err
		}

		var res []ports.AccountHistoryResponse
		for _, h := range histories {
			res = append(res, ports.AccountHistoryResponse{
				Id:           h.ID,
				Amount:       h.Amount,
				AccountGroup: h.AccountGroupID.String,
			})
		}

		return res, nil
	}
	return nil, nil
}
