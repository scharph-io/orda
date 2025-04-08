package main

import (
	"context"
	"fmt"
	"runtime/debug"

	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/repository"
	"github.com/scharph/orda/internal/repository/assortment"
	"github.com/scharph/orda/internal/repository/transaction"
	"github.com/scharph/orda/internal/repository/user"
	"github.com/scharph/orda/internal/repository/view"
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

	// sr.Create(ctx, &domain.Summary{
	// 	Type: 0,
	// 	Content: map[string]any{
	// 		"test": 12,
	// 	},
	// })

	summaries, err := sr.Read(ctx)
	if err != nil {
		fmt.Println(err)
	}
	for _, summary := range summaries {
		fmt.Println(summary)
	}

}

func CreateView(name string) *domain.View {
	v, err := vr.Create(ctx,
		domain.View{
			Name: name,
		},
	)
	if err != nil {
		fmt.Println(err)
	}
	return v
}

func GetView(id string) *domain.View {
	v, err := vr.ReadByID(ctx, id)
	if err != nil {
		fmt.Println(err)
	}
	return v
}

func GetViews() []*domain.View {
	v, err := vr.Read(ctx)
	if err != nil {
		fmt.Println(err)
	}
	return v
}

func GetRoles() []*domain.Role {
	r, err := r.Read(ctx)
	if err != nil {
		fmt.Println(err)
	}
	return r
}

func GetUsers() []domain.User {
	u, err := u.Read(ctx)
	if err != nil {
		fmt.Println(err)
	}
	return u
}

func GetTransactions() []*domain.Transaction {
	t, err := tr.Read(ctx)
	if err != nil {
		fmt.Println(err)
	}
	return t
}

func GetViewProductsByViewId(id string) []*domain.ViewProduct {
	vp, err := vpr.ReadByViewID(ctx, id)
	if err != nil {
		fmt.Println(err)
	}
	return vp
}
