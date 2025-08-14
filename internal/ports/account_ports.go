package ports

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/domain"
)

type AccDepositRequest struct {
	Amount        int32                `json:"amount" validate:"required gt=0"`
	DepositType   domain.DepositType   `json:"deposit_type"`
	HistoryAction domain.HistoryAction `json:"history_action" validate:"required"`
	TransactionId string               `json:"transactionid,omitzero"`
	Reason        string               `json:"reason"`
}

type AccDepositManyRequest struct {
	AccountIds []string `json:"account_ids" validate:"required"`
	AccDepositRequest
}

type AccCorrectionRequest struct {
	NewBalance int32  `json:"new_balance" validate:"required gt=0"`
	Reason     string `json:"reason"`
}

type AccDebitRequest struct {
	Amount        int32  `json:"amount" validate:"required gt=0"`
	TransactionId string `json:"transactionid,omitzero"`
}

type AccDebitResponse struct {
	RemainingCash int32 `json:"remaining_cash"`
	NewBalance    int32 `json:"new_balance"`
}

type AccDepositGroupRequest struct {
	Amount int32  `json:"amount"`
	UserId string `json:"userid,omitempty"`
	Reason string `json:"reason"`
}

type AccountRequest struct {
	Id        string `json:"id,omitempty"`
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	GroupId   string `json:"groupid"`
}

type AccountResponse struct {
	Id              string             `json:"id"`
	Firstname       string             `json:"firstname"`
	Lastname        string             `json:"lastname"`
	MainBalance     int32              `json:"main_balance"`
	CreditBalance   int32              `json:"credit_balance"`
	Group           string             `json:"group,omitempty"`
	GroupId         string             `json:"groupid,omitempty"`
	LastDeposit     int32              `json:"last_deposit"`
	LastDepostType  domain.DepositType `json:"last_deposit_type"`
	LastDepositTime time.Time          `json:"last_deposit_time"`
	LastBalance     int32              `json:"last_balance"`
}

type AccountGroupRequest struct {
	Id   string `json:"id,omitempty"`
	Name string `json:"name"`
}

type AccountGroupResponse struct {
	Id       string            `json:"id"`
	Name     string            `json:"name"`
	Accounts []AccountResponse `json:"accounts,omitempty"`
}

type IAccountRepository interface {
	Create(ctx context.Context, acc ...domain.Account) ([]domain.Account, error)
	Read(ctx context.Context) ([]domain.Account, error)
	ReadById(ctx context.Context, id string) (*domain.Account, error)
	Update(ctx context.Context, account domain.Account) (*domain.Account, error)
	UpdateMany(ctx context.Context, accounts []domain.Account) ([]domain.Account, error)
	Delete(ctx context.Context, id string) (bool, error)
}

type IAccountGroupRepository interface {
	Create(ctx context.Context, req domain.AccountGroup) (*domain.AccountGroup, error)
	Read(ctx context.Context) ([]domain.AccountGroup, error)
	ReadById(ctx context.Context, id string) (*domain.AccountGroup, error)
	ReadByName(ctx context.Context, name string) (*domain.AccountGroup, error)
	Delete(ctx context.Context, id string) (bool, error)
	Update(ctx context.Context, account domain.AccountGroup) (*domain.AccountGroup, error)
	GetAccountsByGroupId(ctx context.Context, id string) ([]domain.Account, error)
}

type IAccountService interface {
	// Group
	CreateGroup(ctx context.Context, req AccountGroupRequest) (*AccountGroupResponse, error)
	GetAllGroups(ctx context.Context) ([]AccountGroupResponse, error)
	DeleteGroup(ctx context.Context, id string) (bool, error)
	DepositAmountGroup(ctx context.Context, userid, groupId string, req AccDepositGroupRequest) (*AccountGroupResponse, error)
	GetAccountGroupHistory(ctx context.Context, groupid string) ([]*AccountHistoryResponse, error)

	// Account
	Create(ctx context.Context, creator_id string, req ...AccountRequest) ([]*AccountGroupResponse, error)
	GetAll(ctx context.Context) ([]AccountResponse, error)
	GetById(ctx context.Context, id string) (*AccountResponse, error)
	Update(ctx context.Context, req AccountRequest) (*AccountResponse, error)
	GetGroupAccounts(ctx context.Context, id string) ([]AccountResponse, error)
	DepositAmount(ctx context.Context, userid string, req AccDepositRequest, accountId string) (*AccountResponse, error)
	DepositMany(ctx context.Context, userid string, req AccDepositManyRequest) error

	DebitAmount(ctx context.Context, userid, accountId string, req AccDebitRequest) (*AccDebitResponse, error)
	CorrectionAmount(ctx context.Context, userid, accountId string, req AccCorrectionRequest) (*AccountResponse, error)
	GetAccountHistory(ctx context.Context, accountid string) ([]*AccountHistoryResponse, error)
	Delete(ctx context.Context, id string) (bool, error)
}

type IAccountHandlers interface {
	// Group
	CreateGroup(c *fiber.Ctx) error
	GetAllGroups(c *fiber.Ctx) error
	GetGroupAccounts(c *fiber.Ctx) error
	DeleteGroup(c *fiber.Ctx) error
	DepositGroup(c *fiber.Ctx) error

	// Account
	Create(c *fiber.Ctx) error
	CreateMany(c *fiber.Ctx) error
	GetAll(c *fiber.Ctx) error
	GetById(c *fiber.Ctx) error
	Update(c *fiber.Ctx) error
	Deposit(c *fiber.Ctx) error
	DepositMany(c *fiber.Ctx) error
	Correct(c *fiber.Ctx) error
	GetHistory(c *fiber.Ctx) error
	Delete(c *fiber.Ctx) error
}
