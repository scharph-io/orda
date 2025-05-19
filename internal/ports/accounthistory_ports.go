package ports

import (
	"context"

	"github.com/scharph/orda/internal/domain"
)

type HistoryType string

const (
	HistoryTypeAccount HistoryType = "account"
	HistoryTypeGroup   HistoryType = "group"
)

type AccountHistoryResponse struct {
	Id            string               `json:"id,omitempty"`
	Amount        int32                `json:"amount"`
	Account       string               `json:"account,omitempty"`
	AccountGroup  string               `json:"account_group,omitempty"`
	DepositType   domain.DepositType   `json:"deposit_type"`
	HistoryAction domain.HistoryAction `json:"history_type"`
}

type LogRequest struct {
	DepositType    domain.DepositType   `json:"deposit_type"`
	HistoryAction  domain.HistoryAction `json:"history_type"`
	TransactionId  *string              `json:"transaction_id,omitempty"`
	AccountId      *string              `json:"account_id,omitempty"`
	AccountGroupId *string              `json:"account_group_id,omitempty"`
	Amount         int32                `json:"amount"`
	Reason         string               `json:"reason"`
}

type IAccountHistoryRepository interface {
	Create(ctx context.Context, logs ...domain.AccountHistory) ([]domain.AccountHistory, error)
	ReadByAccountId(ctx context.Context, saccount_id string) ([]*domain.AccountHistory, error)
	ReadByAccountGroupId(ctx context.Context, account_group_id string) ([]*domain.AccountHistory, error)
}

type IAccountHistoryService interface {
	Log(ctx context.Context, user_id string, depositReq ...LogRequest) error
	GetByAccountId(ctx context.Context, t HistoryType, id string) ([]*AccountHistoryResponse, error)
	GetByAccountGroupId(ctx context.Context, t HistoryType, id string) ([]*AccountHistoryResponse, error)
}
