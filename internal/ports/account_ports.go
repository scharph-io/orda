package ports

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/domain"
)

type DepositRequest struct {
	Amount        int32                `json:"amount"`
	DepositType   domain.DepositType   `json:"deposit_type"`
	HistoryAction domain.HistoryAction `json:"history_type"`
	UserId        string               `json:"user_id,omitempty"`
	TransactionId string               `json:"transaction_id,omitempty"`
}

type DepositGroupRequest struct {
	Amount int32  `json:"amount"`
	UserId string `json:"user_id,omitempty"`
}

type AccountRequest struct {
	Id             string `json:"id,omitempty"`
	Firstname      string `json:"firstname"`
	Lastname       string `json:"lastname"`
	AccountGroupId string `json:"accountgroupid"`
}

type AccountResponse struct {
	Id              string             `json:"id"`
	Firstname       string             `json:"firstname"`
	Lastname        string             `json:"lastname"`
	Balance         int32              `json:"balance"`
	Group           string             `json:"group"`
	LastDeposit     int32              `json:"last_deposit"`
	LastDepostType  domain.DepositType `json:"last_deposit_type"`
	LastDepositTime string             `json:"last_deposit_time"`
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
	Create(ctx context.Context, account domain.Account) (*domain.Account, error)
	Read(ctx context.Context) ([]domain.Account, error)
	ReadById(ctx context.Context, id string) (*domain.Account, error)
	Update(ctx context.Context, id string, account domain.Account) (*domain.Account, error)
	UpdateMany(ctx context.Context, accounts []domain.Account) ([]domain.Account, error)
	Delete(ctx context.Context, id string) (bool, error)
}

type IAccountGroupRepository interface {
	Create(ctx context.Context, account domain.AccountGroup) (*domain.AccountGroup, error)
	Read(ctx context.Context) ([]domain.AccountGroup, error)
	ReadById(ctx context.Context, id string) (*domain.AccountGroup, error)
	ReadByName(ctx context.Context, name string) (*domain.AccountGroup, error)
	Delete(ctx context.Context, id string) (bool, error)
	Update(ctx context.Context, id string, account domain.AccountGroup) (*domain.AccountGroup, error)
	GetAccounts(ctx context.Context, id string) ([]domain.Account, error)
}

type IAccountService interface {
	CreateGroup(ctx context.Context, req AccountGroupRequest) (*AccountGroupResponse, error)
	Create(ctx context.Context, req AccountRequest) (*AccountResponse, error)
	GetAll(ctx context.Context) ([]AccountResponse, error)
	GetAllGroups(ctx context.Context) ([]AccountGroupResponse, error)
	GetGroupAccounts(ctx context.Context, id string) ([]AccountResponse, error)
	DepositAmount(ctx context.Context, id string, req DepositRequest) (*AccountResponse, error)
	DepositAmountGroup(ctx context.Context, id string, req DepositGroupRequest) (*AccountGroupResponse, error)
	GetAccountHistory(ctx context.Context, accountid string) ([]AccountHistoryResponse, error)
	GetAccountGroupHistory(ctx context.Context, groupid string) ([]AccountHistoryResponse, error)
}

type IAccountHandlers interface {
	CreateGroup(c *fiber.Ctx) error
	Create(c *fiber.Ctx) error
	GetAll(c *fiber.Ctx) error
	GetAllGroups(c *fiber.Ctx) error
	GetGroupAccounts(c *fiber.Ctx) error
	Deposit(c *fiber.Ctx) error
	DepositGroup(c *fiber.Ctx) error
	GetHistory(c *fiber.Ctx) error
}
