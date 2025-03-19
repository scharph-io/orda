package service

import (
	"context"
	"database/sql"
	"fmt"
	"slices"
	"time"

	"github.com/scharph/orda/internal/config"
	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/util"
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

// Groups
func (s *AccountService) CreateGroup(ctx context.Context, req ports.AccountGroupRequest) (*ports.AccountGroupResponse, error) {
	group, err := s.groupRepo.Create(ctx, domain.AccountGroup{Name: req.Name})
	if err != nil {
		return nil, err
	}
	return &ports.AccountGroupResponse{Id: group.ID, Name: group.Name}, nil
}

func (s *AccountService) GetAllGroups(ctx context.Context) ([]ports.AccountGroupResponse, error) {
	fmt.Println("GetAllGroups")
	groups, err := s.groupRepo.Read(ctx)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	var res []ports.AccountGroupResponse
	for _, group := range groups {
		res = append(res, ports.AccountGroupResponse{Id: group.ID, Name: group.Name})
	}
	return res, nil
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
	for _, a := range accounts {
		res = append(res, ports.AccountResponse{
			Id:            a.ID,
			Firstname:     a.Firstname,
			Lastname:      a.Lastname,
			MainBalance:   a.MainBalance,
			CreditBalance: a.CreditBalance,
			Group:         group.Name,
			GroupId:       a.AccountGroupID,
		})
	}
	return res, nil
}

func (s *AccountService) DepositAmountGroup(ctx context.Context, userid, groupId string, req ports.DepositGroupRequest) (*ports.AccountGroupResponse, error) {

	group, err := s.groupRepo.ReadById(ctx, groupId)
	if err != nil {
		return nil, err
	}

	accounts, err := s.groupRepo.GetAccountsByGroupId(ctx, group.ID)

	for i := range accounts {
		accounts[i].LastBalance = accounts[i].MainBalance + accounts[i].CreditBalance
		accounts[i].CreditBalance += req.Amount
		accounts[i].LastDeposit = req.Amount
		accounts[i].LastDepositTime = sql.NullTime{Time: time.Now(), Valid: true}
	}

	accs, err := s.repo.UpdateMany(ctx, accounts)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	// Log deposit action
	if err := s.accountHistoryService.Log(ctx, userid, ports.LogRequest{
		Amount:         req.Amount,
		AccountGroupId: &groupId,
		DepositType:    domain.DepositTypeFree,
		HistoryAction:  domain.HistoryDepositAction,
	}); err != nil {
		return nil, err
	}

	var res []ports.AccountResponse
	for _, account := range accs {
		res = append(res, *util.ToAccountResponse(&account))
	}
	return &ports.AccountGroupResponse{Id: group.ID, Name: group.Name, Accounts: res}, nil
}

func (s *AccountService) DeleteGroup(ctx context.Context, id string) (bool, error) {
	return s.groupRepo.Delete(ctx, id)
}

func (s *AccountService) GetAccountGroupHistory(ctx context.Context, groupid string) ([]*ports.AccountHistoryResponse, error) {
	return s.accountHistoryService.GetByAccountGroupId(ctx, ports.HistoryTypeGroup, groupid)
}

// Accounts
func (s *AccountService) Create(ctx context.Context, creator_id string, req ...ports.AccountRequest) ([]*ports.AccountGroupResponse, error) {
	c := config.GetConfig().Account
	groups, err := s.groupRepo.Read(ctx)
	if err != nil {
		return nil, err
	}

	var groupIds []string
	for _, group := range groups {
		groupIds = append(groupIds, group.ID)
	}

	accounts := make([]domain.Account, 0)

	for _, r := range req {
		if slices.Contains(groupIds, r.GroupId) {
			accounts = append(accounts, domain.Account{
				Firstname:      r.Firstname,
				Lastname:       r.Lastname,
				AccountGroupID: r.GroupId,
				CreditBalance:  c.InitialBalance,
				MainBalance:    0,
				LastBalance:    0,
			})
		}
	}

	accs, err := s.repo.Create(ctx, accounts...)
	if err != nil {
		return nil, err
	}

	logs := make([]ports.LogRequest, 0)
	for _, acc := range accs {
		logs = append(logs, ports.LogRequest{
			Amount:        acc.CreditBalance,
			DepositType:   domain.DepositTypeFree,
			HistoryAction: domain.HistoryDepositAction,
			AccountId:     &acc.ID,
		})
	}
	if err := s.accountHistoryService.Log(ctx, creator_id, logs...); err != nil {
		return nil, err
	}
	return nil, nil
}

func (s *AccountService) GetAll(ctx context.Context) ([]ports.AccountResponse, error) {
	groups, _ := s.groupRepo.Read(ctx)
	accounts, err := s.repo.Read(ctx)
	if err != nil {
		return nil, err
	}
	var res []ports.AccountResponse
	for _, a := range accounts {
		res = append(res, ports.AccountResponse{
			Id:            a.ID,
			Firstname:     a.Firstname,
			Lastname:      a.Lastname,
			MainBalance:   a.MainBalance,
			CreditBalance: a.CreditBalance,
			Group:         getGroupName(groups, a.AccountGroupID),
			GroupId:       a.AccountGroupID,
		})
	}
	return res, nil
}

func (s *AccountService) GetById(ctx context.Context, id string) (*ports.AccountResponse, error) {
	acc, err := s.repo.ReadById(ctx, id)
	if err != nil {
		return nil, err
	}
	group, err := s.groupRepo.ReadById(ctx, acc.AccountGroupID)
	if err != nil {
		return nil, err
	}
	return &ports.AccountResponse{
		Id:            acc.ID,
		Firstname:     acc.Firstname,
		Lastname:      acc.Lastname,
		MainBalance:   acc.MainBalance,
		CreditBalance: acc.CreditBalance,
		Group:         group.Name,
		GroupId:       acc.AccountGroupID,
	}, nil
}

func (s *AccountService) Update(ctx context.Context, req ports.AccountRequest) (*ports.AccountResponse, error) {
	acc, err := s.repo.ReadById(ctx, req.Id)
	if err != nil {
		return nil, err
	}
	acc.Firstname = req.Firstname
	acc.Lastname = req.Lastname
	acc.AccountGroupID = req.GroupId

	updatedAcc, err := s.repo.Update(ctx, *acc)
	if err != nil {
		return nil, err
	}
	return util.ToAccountResponse(updatedAcc), err
}

func (s *AccountService) DepositAmount(ctx context.Context, userid, accountId string, req ports.DepositRequest) (*ports.AccountResponse, error) {
	account, err := s.repo.ReadById(ctx, accountId)
	if err != nil {
		return nil, err
	}

	account.LastBalance = account.MainBalance + account.CreditBalance
	if req.DepositType == domain.DepositTypePaid {
		account.MainBalance += req.Amount
	} else if req.DepositType == domain.DepositTypeFree {
		account.CreditBalance += req.Amount
	} else {
		return nil, fmt.Errorf("invalid deposit type")
	}

	account.LastDeposit = req.Amount
	account.LastDepositType = req.DepositType
	account.LastDepositTime = sql.NullTime{Time: time.Now(), Valid: true}

	updatedAcc, err := s.repo.Update(ctx, *account)
	if err != nil {
		return nil, err
	}

	fmt.Println("Updated Account:", updatedAcc.ToString())

	// Log deposit action
	if err := s.accountHistoryService.Log(ctx, userid, ports.LogRequest{
		Amount:        req.Amount,
		AccountId:     &updatedAcc.ID,
		DepositType:   req.DepositType,
		HistoryAction: req.HistoryAction,
	}); err != nil {
		return nil, err
	}
	return util.ToAccountResponse(updatedAcc), err
}

func (s *AccountService) GetAccountHistory(ctx context.Context, accountid string) ([]*ports.AccountHistoryResponse, error) {
	return s.accountHistoryService.GetByAccountId(ctx, ports.HistoryTypeAccount, accountid)
}

func (s *AccountService) Delete(ctx context.Context, id string) (bool, error) {
	return s.repo.Delete(ctx, id)
}

// util
func getGroupName(groups []domain.AccountGroup, groupId string) string {
	m := make(map[string]domain.AccountGroup)
	for _, group := range groups {
		m[group.ID] = group
	}
	return m[groupId].Name
}
