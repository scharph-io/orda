package ports

import "github.com/scharph/orda/internal/domain"

type HistoryType string

const (
	HistoryTypeAccount HistoryType = "account"
	HistoryTypeGroup   HistoryType = "group"
)

type AccountHistoryResponse struct {
	Id            string               `json:"id,omitempty"`
	Amount        int32                `json:"amount"`
	Account       AccountResponse      `json:"account,omitempty"`
	AccountGroup  string               `json:"account_group,omitempty"`
	DepositType   domain.DepositType   `json:"deposit_type"`
	HistoryAction domain.HistoryAction `json:"history_type"`
}

type AccountHistoryRequest struct {
	Amount         int32                `json:"amount"`
	AccountId      string               `json:"account_id,omitempty"`
	AccountGroupId string               `json:"account_group_id,omitempty"`
	DepositType    domain.DepositType   `json:"deposit_type"`
	HistoryAction  domain.HistoryAction `json:"history_type"`
	UserId         string               `json:"user_id,omitempty"`
	TransactionId  string               `json:"transaction_id,omitempty"`
}

type IAccountHistoryRepository interface {
	Create(depositHistory domain.AccountHistory) error
	ReadByAccountId(account_id string) ([]domain.AccountHistory, error)
	ReadByAccountGroupId(account_group_id string) ([]domain.AccountHistory, error)
}

type IAccountHistoryService interface {
	LogDeposit(depositReq AccountHistoryRequest) error
	LogGroupDeposit(depositGroupReq AccountHistoryRequest) error
	Get(t HistoryType, id string) ([]AccountHistoryResponse, error)
}
