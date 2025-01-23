package service

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/scharph/orda/internal/config"
	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
)

type AccountService struct {
	repo                  ports.IAccountRepository
	groupRepo             ports.IAccountGroupRepository
	accountHistoryService ports.IAccountHistoryService
}

var _ ports.IAccountService = (*AccountService)(nil)

func NewAccountService(repo ports.IAccountRepository, groupRepo ports.IAccountGroupRepository, accountHistoryRepo ports.IAccountHistoryRepository) *AccountService {
	return &AccountService{repo, groupRepo, NewAccountHistoryService(accountHistoryRepo)}
}

func (s *AccountService) CreateGroup(ctx context.Context, req ports.AccountGroupRequest) (*ports.AccountGroupResponse, error) {
	group, err := s.groupRepo.Create(ctx, domain.AccountGroup{Name: req.Name})
	if err != nil {
		return nil, err
	}
	return &ports.AccountGroupResponse{Id: group.ID, Name: group.Name}, nil
}

func (s *AccountService) Create(ctx context.Context, req ports.AccountRequest) (*ports.AccountResponse, error) {
	c := config.GetConfig().Account
	var group *domain.AccountGroup
	var err error
	if req.AccountGroupId == "" {
		group, err = s.groupRepo.ReadByName(ctx, "Default")
		if err != nil {
			return nil, err
		}
	} else {
		group, err = s.groupRepo.ReadById(ctx, req.AccountGroupId)
		if err != nil {
			return nil, err
		}
	}

	account, err := s.repo.Create(ctx,
		domain.Account{
			Firstname:      req.Firstname,
			Lastname:       req.Lastname,
			AccountGroupID: group.ID,
			Balance:        c.InitialBalance,
			LastBalance:    0,
		})
	if err != nil {
		return nil, err
	}

	// Log deposit action
	if err := s.accountHistoryService.LogDeposit(ports.AccountHistoryRequest{
		Amount:        account.Balance,
		AccountId:     account.ID,
		DepositType:   domain.DepositTypeFree,
		HistoryAction: domain.HistoryDepositAction,
		UserId:        "",
		TransactionId: "",
	}); err != nil {
		return nil, err
	}

	return &ports.AccountResponse{Id: account.ID, Firstname: account.Firstname, Lastname: account.Lastname, Balance: account.Balance, Group: group.Name}, nil
}

func (s *AccountService) GetAll(ctx context.Context) ([]ports.AccountResponse, error) {
	groups, err := s.groupRepo.Read(ctx)
	accounts, err := s.repo.Read(ctx)
	if err != nil {
		return nil, err
	}
	var res []ports.AccountResponse
	for _, account := range accounts {
		res = append(res, ports.AccountResponse{Id: account.ID, Firstname: account.Firstname, Lastname: account.Lastname, Balance: account.Balance, Group: getGroupName(groups, account.AccountGroupID)})
	}
	return res, nil
}

func (s *AccountService) GetAllGroups(ctx context.Context) ([]ports.AccountGroupResponse, error) {
	groups, err := s.groupRepo.Read(ctx)
	if err != nil {
		return nil, err
	}
	var res []ports.AccountGroupResponse
	for _, group := range groups {
		res = append(res, ports.AccountGroupResponse{Id: group.ID, Name: group.Name})
	}
	return res, nil
}

func getGroupName(groups []domain.AccountGroup, groupId string) string {
	m := make(map[string]domain.AccountGroup)
	for _, group := range groups {
		m[group.ID] = group
	}
	return m[groupId].Name
}

func (s *AccountService) GetGroupAccounts(ctx context.Context, id string) ([]ports.AccountResponse, error) {
	group, err := s.groupRepo.ReadById(ctx, id)
	if err != nil {
		return nil, err
	}
	accounts, err := s.groupRepo.GetAccountsByGroupId(ctx, group.ID)
	if err != nil {
		return nil, err
	}
	var res []ports.AccountResponse
	for _, account := range accounts {
		res = append(res, ports.AccountResponse{Id: account.ID, Firstname: account.Firstname, Lastname: account.Lastname, Balance: account.Balance, Group: group.Name})
	}
	return res, nil
}

func (s *AccountService) DepositAmount(ctx context.Context, id string, req ports.DepositRequest) (*ports.AccountResponse, error) {
	account, err := s.repo.ReadById(ctx, id)
	if err != nil {
		return nil, err
	}

	account.LastBalance = account.Balance
	account.Balance += req.Amount
	account.LastDeposit = req.Amount
	account.LastDepositType = req.DepositType
	account.LastDepositTime = sql.NullTime{Time: time.Now(), Valid: true}

	updatedAccount, err := s.repo.Update(ctx, *account)
	if err != nil {
		return nil, err
	}

	fmt.Printf("[Service] Deposit amount %d to %s\n", req.Amount, updatedAccount.Lastname)

	// Log deposit action
	if err := s.accountHistoryService.LogDeposit(ports.AccountHistoryRequest{
		Amount:        req.Amount,
		AccountId:     updatedAccount.ID,
		DepositType:   req.DepositType,
		HistoryAction: req.HistoryAction,
		UserId:        req.UserId,
		TransactionId: req.TransactionId,
	}); err != nil {
		return nil, err
	}

	return &ports.AccountResponse{
		Id:              updatedAccount.ID,
		Firstname:       updatedAccount.Firstname,
		Lastname:        updatedAccount.Lastname,
		Balance:         updatedAccount.Balance,
		Group:           updatedAccount.AccountGroupID,
		LastDeposit:     updatedAccount.LastDeposit,
		LastDepostType:  updatedAccount.LastDepositType,
		LastDepositTime: updatedAccount.LastDepositTime.Time.Format(time.RFC3339),
		LastBalance:     updatedAccount.LastBalance,
	}, err
}

func (s *AccountService) DepositAmountGroup(ctx context.Context, id string, req ports.DepositGroupRequest) (*ports.AccountGroupResponse, error) {

	group, err := s.groupRepo.ReadById(ctx, id)
	if err != nil {
		return nil, err
	}

	for i := range group.Accounts {
		group.Accounts[i].LastBalance = group.Accounts[i].Balance
		group.Accounts[i].Balance += req.Amount
		group.Accounts[i].LastDeposit = req.Amount
		group.Accounts[i].LastDepositTime = sql.NullTime{Time: time.Now(), Valid: true}
	}

	fmt.Println("group", group.ToString())

	accounts, err := s.groupRepo.GetAccountsByGroupId(ctx, group.ID)

	for i := range accounts {
		accounts[i].LastBalance = accounts[i].Balance
		accounts[i].Balance += req.Amount
		accounts[i].LastDeposit = req.Amount
		accounts[i].LastDepositTime = sql.NullTime{Time: time.Now(), Valid: true}
	}

	accs, err := s.repo.UpdateMany(ctx, accounts)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	// Log deposit action
	// if err := s.accountHistoryService.LogGroupDeposit(ports.AccountHistoryRequest{
	// 	Amount:         req.Amount,
	// 	AccountGroupId: group.ID,
	// 	DepositType:    domain.DepositTypeFree,
	// 	HistoryAction:  domain.HistoryDepositAction,
	// 	// UserId:         req.UserId,
	// }); err != nil {
	// 	return nil, err
	// }

	var res []ports.AccountResponse
	for _, account := range accs {
		res = append(res, ports.AccountResponse{
			Id:              account.ID,
			Firstname:       account.Firstname,
			Lastname:        account.Lastname,
			Balance:         account.Balance,
			LastDeposit:     account.LastDeposit,
			LastDepostType:  account.LastDepositType,
			LastDepositTime: account.LastDepositTime.Time.Format(time.RFC3339),
			LastBalance:     account.LastBalance,
		})
	}
	return &ports.AccountGroupResponse{Id: group.ID, Name: group.Name, Accounts: res}, nil
}

func (s *AccountService) GetAccountHistory(ctx context.Context, accountid string) ([]ports.AccountHistoryResponse, error) {
	return s.accountHistoryService.Get(ports.HistoryTypeAccount, accountid)
}

func (s *AccountService) GetAccountGroupHistory(ctx context.Context, groupid string) ([]ports.AccountHistoryResponse, error) {
	return s.accountHistoryService.Get(ports.HistoryTypeGroup, groupid)
}
