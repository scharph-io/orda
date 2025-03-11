package main

import (
	"context"
	"fmt"
	"runtime/debug"

	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/repository/assortment"
	"github.com/scharph/orda/internal/repository/transaction"
	"github.com/scharph/orda/internal/repository/user"
	"github.com/scharph/orda/internal/repository/view"
)

var (
	r ports.IRoleRepository
	u ports.IUserRepository

	pr ports.IProductRepository
	gr ports.IProductGroupRepository

	vr  ports.IViewRepository
	vpr ports.IViewProductRepository

	tr  ports.ITransactionRepository
	tir ports.ITransactionItemRepository

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
	gr = assortment.NewProductGroupRepo(db)

	tr = transaction.NewTransactionRepository(db)
	tir = transaction.NewTransactionItemRepository(db)

	// ROLES
	fmt.Println("# Roles:")
	roles := GetRoles()
	{
		if len(roles) == 0 {
			r.Create(ctx, &domain.Role{
				Name: "admin",
			})
			r.Create(ctx, &domain.Role{
				Name: "user",
			})
			roles = GetRoles()
		}

		for _, r := range roles {
			fmt.Println(r.String())
		}

		fmt.Println("-------------------------------")
		fmt.Println("")
	}

	// USERS
	fmt.Println("# Users:")
	users := GetUsers()
	{
		if len(users) == 0 {
			u.Create(ctx, &domain.User{
				Username: "admin",
				RoleId:   roles[0].ID,
			})

			users = GetUsers()
		}

		for _, u := range users {
			fmt.Println(u.String())
		}

		fmt.Println("-------------------------------")
		fmt.Println("")
	}

	fmt.Println("# Views:")
	views := GetViews()
	{
		if len(views) == 0 {
			v1 := CreateView("Test")

			// db.Debug().Model(&v1).Association("Roles").Append(&roles)

			vr.ReplaceRoles(ctx, v1, roles[0].ID, roles[1].ID)
			v2 := CreateView("Test2")
			vr.ReplaceRoles(ctx, v2, roles[1].ID)
			views = GetViews()
		}

		for _, v := range views {
			fmt.Println(v.String())
		}

		vr.ReplaceRoles(ctx, views[0], roles[1].ID)

		fmt.Println("New ---- ")
		views = GetViews()
		for _, v := range views {
			fmt.Println(v.String())
		}

		fmt.Println("-------------------------------")
		fmt.Println("")
	}

	fmt.Println("# ProductGroups:")
	groups, _ := gr.Read(ctx)
	{
		if len(groups) == 0 {
			gr.Create(ctx, domain.ProductGroup{
				Name: "TestGroup1",
			})
			gr.Create(ctx, domain.ProductGroup{
				Name: "TestGroup2",
			})
			groups, _ = gr.Read(ctx)
		}

		for _, g := range groups {
			fmt.Println(g.String())
		}

		fmt.Println("-------------------------------")
		fmt.Println("")
	}

	fmt.Println("# Products:")
	group1 := groups[0]
	productsOfGroup1, _ := pr.ReadByGroupID(ctx, group1.ID)
	{
		if len(productsOfGroup1) == 0 {
			pr.Create(ctx, domain.Product{
				Name:           "TestProduct1",
				Price:          100,
				ProductGroupID: group1.ID,
			})
			pr.Create(ctx, domain.Product{
				Name:           "TestProduct2",
				Price:          200,
				ProductGroupID: group1.ID,
			})
			productsOfGroup1, _ = pr.ReadByGroupID(ctx, group1.ID)
		}

		fmt.Println("Products in group", groups[0].String())
		for _, p := range productsOfGroup1 {
			fmt.Println(p.String())
		}

		fmt.Println("-------------------------------")
		fmt.Println("")
	}

	fmt.Println("# Views:")
	view1 := views[0]

	fmt.Println(view1.Name)
	vps := GetViewProductsByViewId(view1.ID)
	{

		// vr.AppendProducts(ctx, view1, &domain.ViewProduct{
		// 	Position:  1,
		// 	Color:     "blue",
		// 	ProductID: productsOfGroup1[1].ID,
		// })
		// if len(vps) == 0 {

		// 	// vps = GetViewProductsByViewId(view1.ID)
		// }

		fmt.Println("ViewProducts in view", view1.Name)
		for _, vp := range vps {
			fmt.Println(vp.String())
		}

		fmt.Println("-------------------------------")
		fmt.Println("")
	}

	// transactions := GetTransactions()

	// if len(transactions) == 0 {
	// 	fmt.Println("Create Transaction")
	// 	transaction := &domain.Transaction{
	// 		Items: []*domain.TransactionItem{
	// 			{
	// 				ProductID: vps[1].ProductID,
	// 				Qty:       1,
	// 				Price:     210,
	// 			},
	// 			{
	// 				ProductID: vps[0].ProductID,
	// 				Qty:       2,
	// 				Price:     100,
	// 			},
	// 		},
	// 		UserID:        "bla",
	// 		Total:         310,
	// 		PaymentOption: domain.PaymentMethodCash,
	// 		AccountType:   domain.AccountTypeAnonymous,
	// 	}

	// 	_, err := tr.Create(ctx, transaction)
	// 	if err != nil {
	// 		fmt.Println(err)
	// 	}

	// 	transactions = GetTransactions()
	// }

	// fmt.Println("Print Transactions: ")
	// for _, t := range transactions {
	// 	fmt.Println("- Transaction", t.ID, t.Total)
	// 	for i := range t.Items {
	// 		fmt.Println("		Item", i, " ", t.Items[i].ProductID, t.Items[i].Qty, t.Items[i].Price)
	// 	}
	// }

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
