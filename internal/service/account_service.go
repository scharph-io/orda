package service

import (
	"context"
	"database/sql"
	"fmt"
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
	if req.GroupId == "" {
		group, err = s.groupRepo.ReadByName(ctx, "Default")
		if err != nil {
			return nil, err
		}
	} else {
		group, err = s.groupRepo.ReadById(ctx, req.GroupId)
		if err != nil {
			return nil, err
		}
	}

	acc, err := s.repo.Create(ctx,
		domain.Account{
			Firstname:      req.Firstname,
			Lastname:       req.Lastname,
			AccountGroupID: group.ID,
			CreditBalance:  c.InitialBalance,
			MainBalance:    0,
			LastBalance:    0,
		})
	if err != nil {
		return nil, err
	}

	// Log deposit action
	if err := s.accountHistoryService.LogDeposit(ports.AccountHistoryRequest{
		Amount:        acc.CreditBalance,
		AccountId:     acc.ID,
		DepositType:   domain.DepositTypeFree,
		HistoryAction: domain.HistoryDepositAction,
		UserId:        "",
		TransactionId: "",
	}); err != nil {
		return nil, err
	}

	return &ports.AccountResponse{Id: acc.ID, Firstname: acc.Firstname, Lastname: acc.Lastname, MainBalance: acc.MainBalance, CreditBalance: acc.CreditBalance, Group: group.Name}, nil
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

// GetById implements ports.IAccountService.
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

func (s *AccountService) DepositAmount(ctx context.Context, accountId string, req ports.DepositRequest) (*ports.AccountResponse, error) {
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

	fmt.Printf("[Service] Deposit amount %d to %s\n", req.Amount, updatedAcc.Lastname)

	// Log deposit action
	if err := s.accountHistoryService.LogDeposit(ports.AccountHistoryRequest{
		Amount:        req.Amount,
		AccountId:     updatedAcc.ID,
		DepositType:   req.DepositType,
		HistoryAction: req.HistoryAction,
		UserId:        req.UserId,
		TransactionId: req.TransactionId,
	}); err != nil {
		return nil, err
	}
	return util.ToAccountResponse(updatedAcc), err
}

func (s *AccountService) DepositAmountGroup(ctx context.Context, groupId string, req ports.DepositGroupRequest) (*ports.AccountGroupResponse, error) {

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
	if err := s.accountHistoryService.LogGroupDeposit(ports.AccountHistoryRequest{
		Amount:         req.Amount,
		AccountGroupId: group.ID,
		DepositType:    domain.DepositTypeFree,
		HistoryAction:  domain.HistoryDepositAction,
		UserId:         req.UserId,
	}); err != nil {
		return nil, err
	}

	var res []ports.AccountResponse
	for _, account := range accs {
		res = append(res, *util.ToAccountResponse(&account))
	}
	return &ports.AccountGroupResponse{Id: group.ID, Name: group.Name, Accounts: res}, nil
}

func (s *AccountService) GetAccountHistory(ctx context.Context, accountid string) ([]ports.AccountHistoryResponse, error) {
	return s.accountHistoryService.Get(ports.HistoryTypeAccount, accountid)
}

func (s *AccountService) GetAccountGroupHistory(ctx context.Context, groupid string) ([]ports.AccountHistoryResponse, error) {
	return s.accountHistoryService.Get(ports.HistoryTypeGroup, groupid)
}

func (s *AccountService) DeleteGroup(ctx context.Context, id string) (bool, error) {
	return s.groupRepo.Delete(ctx, id)
}

func (s *AccountService) DeleteAccount(ctx context.Context, id string) (bool, error) {
	return s.repo.Delete(ctx, id)
}
