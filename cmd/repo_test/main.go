package main

import (
	"context"
	"fmt"
	"runtime/debug"
	"time"

	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/repository"
	"github.com/scharph/orda/internal/repository/account"
	"github.com/scharph/orda/internal/repository/assortment"
	"github.com/scharph/orda/internal/repository/transaction"
	"github.com/scharph/orda/internal/repository/user"
	"github.com/scharph/orda/internal/repository/view"
	"github.com/scharph/orda/internal/service"
)

var (
	r ports.IRoleRepository
	u ports.IUserRepository

	pr  ports.IProductRepository
	pgr ports.IProductGroupRepository

	vr  ports.IViewRepository
	vpr ports.IViewProductRepository

	tr  ports.ITransactionRepository
	tir ports.ITransactionItemRepository

	sr ports.ISummaryRepository

	ac  ports.IAccountRepository
	acg ports.IAccountGroupRepository
	ach ports.IAccountHistoryRepository

	ctx = context.Background()
)

func main() {

	info, _ := debug.ReadBuildInfo()

	fmt.Println(info.Main.Path, info.Main.Version)
	fmt.Println(info.GoVersion)

	database.Connect()

	db := database.DB

	r = user.NewRoleRepo(db)
	u = user.NewUserRepo(db)

	vr = view.NewViewRepository(db)
	vpr = view.NewViewProductRepo(db)

	pr = assortment.NewProductRepo(db)
	pgr = assortment.NewProductGroupRepo(db)

	tr = transaction.NewTransactionRepository(db)
	tir = transaction.NewTransactionItemRepository(db)

	sr = repository.NewSummaryRepository(db)

	ac = account.NewAccountRepo(db)
	acg = account.NewAccountGroupRepo(db)
	ach = account.NewAccountHistoryRepo(db)

	as := service.NewAccountService(ac, acg, ach)
	ts := service.NewTransactionService(tr, tir, pr, as)

	x, err := ts.ReadPaymentSummary(ctx, time.Now().Add(time.Hour*24*-14), time.Now())
	if err != nil {
		fmt.Println(err)
	}

	y, err := ts.ReadProductSummary(ctx, time.Now().Add(time.Hour*24*-14), time.Now())
	if err != nil {
		fmt.Println(err)
	}

	for k, v := range x {
		fmt.Printf("%d -> %d\n", k, v)
	}

	for _, f := range y {
		fmt.Println(f.TotalQuantity, f.Name, f.Desc)
	}

	// reate(ctx, &domain.Summary{
	// 	Type: 0,
	// 	Content: map[string]any{
	// 		"test": 12,
	// 	},
	// })

	// summaries, err := sr.Read(ctx)
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// for _, summary := range summaries {
	// 	fmt.Println(summary)
	// }

}
