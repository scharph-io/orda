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

	pr  ports.IProductRepository
	pgr ports.IProductGroupRepository

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
	pgr = assortment.NewProductGroupRepo(db)

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
			v1 := CreateView("Kiosk")
			vr.ReplaceRoles(ctx, v1, roles[0].ID, roles[1].ID)

			v2 := CreateView("Bar")
			vr.ReplaceRoles(ctx, v2, roles[1].ID)

			views = GetViews()
		}

		for _, v := range views {
			fmt.Println(v.String())
		}

		fmt.Println("#########")
		x, err := vr.ReadByRoleID(ctx, "admin")
		if err != nil {
			fmt.Println("Error reading views by role:", err)
		}
		for _, v := range x {
			fmt.Println(v.String())
		}

		// vr.ReplaceRoles(ctx, views[0], roles[1].ID)

		// fmt.Println("New ---- ")
		// views = GetViews()
		// for _, v := range views {
		// 	fmt.Println(v.String())
		// }

		fmt.Println("-------------------------------")
		fmt.Println("")
	}

	return
	fmt.Println("# ProductGroups:")
	groups, _ := pgr.Read(ctx)
	{
		if len(groups) == 0 {
			pgr.Create(ctx, domain.ProductGroup{
				Name: "Getränke",
			})
			pgr.Create(ctx, domain.ProductGroup{
				Name: "Essen",
			})
			groups, _ = pgr.Read(ctx)
		}

		for _, g := range groups {
			fmt.Println(g.String())
		}

		fmt.Println("-------------------------------")
		fmt.Println("")
	}

	fmt.Println("# Products:")
	drinks_group := groups[0]
	food_group := groups[1]
	drinks, _ := pgr.ReadProducts(ctx, drinks_group)
	{
		if len(drinks) == 0 {

			pgr.AppendProducts(ctx, drinks_group,
				&domain.Product{
					Name:  "Cola",
					Price: 100,
				},
				&domain.Product{
					Name:  "Fanta",
					Price: 410,
				},
				&domain.Product{
					Name:  "Mineral",
					Price: 310,
				},
				&domain.Product{
					Name:  "Rum",
					Price: 460,
				})

			pgr.AppendProducts(ctx, food_group,
				&domain.Product{
					Name:  "Schnitzel",
					Price: 610,
				},
				&domain.Product{
					Name:  "Pommes",
					Price: 610,
				})

			drinks, _ = pgr.ReadProducts(ctx, drinks_group)
		}

		for _, g := range groups {
			fmt.Println(g.String())
			ps, _ := pgr.ReadProducts(ctx, g)
			for _, p := range ps {
				fmt.Println("   ---", p.String())
			}
		}

		fmt.Println("-------------------------------")
		fmt.Println("")
	}

	// food, _ := pgr.ReadProducts(ctx, food_group)
	fmt.Println("# Views:")
	kiosk := views[0]
	bar := views[1]

	// {

	// 	fmt.Println("Appending to View:", kiosk.String())

	// 	vpsKiosk := GetViewProductsByViewId(kiosk.ID)

	// 	if len(vpsKiosk) == 0 {
	// 		if err := vr.AppendViewProducts(ctx, kiosk, &domain.ViewProduct{
	// 			ProductId: food[1].ID,
	// 			Color:     "violett",
	// 			Position:  1,
	// 		}); err != nil {
	// 			fmt.Println("err", err)
	// 		}

	// 		vpsKiosk = GetViewProductsByViewId(kiosk.ID)
	// 		fmt.Println("ViewProducts: ")
	// 		for _, vp := range vpsKiosk {
	// 			fmt.Println("  -- ", vp.String())
	// 		}

	// 		if err := vr.AppendViewProducts(ctx, kiosk,
	// 			&domain.ViewProduct{
	// 				ProductId: drinks[0].ID,
	// 				Color:     "blue",
	// 				Position:  2,
	// 			},
	// 			&domain.ViewProduct{
	// 				ProductId: drinks[1].ID,
	// 				Color:     "grey",
	// 				Position:  3,
	// 			},
	// 			&domain.ViewProduct{
	// 				ProductId: food[0].ID,
	// 				Color:     "brown",
	// 				Position:  4,
	// 			},
	// 			&domain.ViewProduct{
	// 				ProductId: drinks[2].ID,
	// 				Color:     "green",
	// 				Position:  5,
	// 			}); err != nil {
	// 			fmt.Println("err", err)
	// 		}

	// 		vpsKiosk = GetViewProductsByViewId(kiosk.ID)
	// 		fmt.Println("ViewProducts: ")
	// 		for _, vp := range vpsKiosk {
	// 			fmt.Println("  -- ", vp.String())
	// 		}

	// 		if err := vr.ReplaceViewProducts(ctx, kiosk, &domain.ViewProduct{
	// 			ProductId: food[0].ID,
	// 			Color:     "violett",
	// 			Position:  3,
	// 		},
	// 			&domain.ViewProduct{
	// 				ProductId: food[1].ID,
	// 				Color:     "red",
	// 				Position:  1,
	// 			}); err != nil {
	// 			fmt.Println("err", err)
	// 		}

	// 		fmt.Println("ViewProducts: ")
	// 		vpsKiosk = GetViewProductsByViewId(kiosk.ID)
	// 		for _, vp := range vpsKiosk {
	// 			fmt.Println("  -- ", vp.String())
	// 		}

	// 		if err := vr.RemoveViewProducts(ctx, kiosk, &domain.ViewProduct{
	// 			ProductId: food[0].ID,
	// 		}); err != nil {
	// 			fmt.Println("err", err)
	// 		}

	// 		fmt.Println("ViewProducts: ")
	// 		vpsKiosk = GetViewProductsByViewId(kiosk.ID)
	// 		for _, vp := range vpsKiosk {
	// 			fmt.Println("  -- ", vp.String())
	// 		}
	// 	}

	// 	vpsBar := GetViewProductsByViewId(bar.ID)
	// 	if len(vpsBar) == 0 {
	// 		fmt.Println("Appending to:", bar.Name)
	// 		vr.ReplaceViewProducts(ctx, bar,
	// 			&domain.ViewProduct{
	// 				ProductId: food[0].ID,
	// 				Color:     "violett",
	// 				Position:  3,
	// 			},
	// 			&domain.ViewProduct{
	// 				ProductId: food[1].ID,
	// 				Color:     "green",
	// 				Position:  12,
	// 			})
	// 	}

	// 	fmt.Println("-------------------------------")
	// 	fmt.Println("")
	// }

	// pvs, err := pr.GetProductViews(ctx, &food[1])
	// if err != nil {
	// 	fmt.Println("err", err)
	// }

	// fmt.Println(food[1].Name, "has views:")
	// for _, pv := range pvs {
	// 	fmt.Println("  -- ", pv.String())
	// }

	pr.AppendProductViews(ctx, &drinks[0],
		&domain.ViewProduct{
			ViewId:   bar.ID,
			Color:    "black",
			Position: 10,
		},
	)

	pvsDrinks, err := pr.GetProductViews(ctx, &drinks[0])
	if err != nil {
		fmt.Println("err", err)
	}

	fmt.Println(drinks[0].Name, "has views:")
	for _, pv := range pvsDrinks {
		fmt.Println("  -- ", pv.String())
	}

	pr.ReplaceProductViews(ctx, &drinks[0],
		&domain.ViewProduct{
			ViewId:   kiosk.ID,
			Color:    "black",
			Position: 10,
		},
	)

	pvsDrinks, err = pr.GetProductViews(ctx, &drinks[0])
	if err != nil {
		fmt.Println("err", err)
	}

	fmt.Println(drinks[0].Name, "has views:")
	for _, pv := range pvsDrinks {
		fmt.Println("  -- ", pv.String())
	}

	// pr.RemoveProductViews(ctx context.Context, product *domain.Product, vps ...*domain.ViewProduct)

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
