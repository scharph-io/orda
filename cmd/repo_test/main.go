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
			v1 := CreateView("Test")
			if v1 == nil {
				fmt.Println("Failed to create view 'Test'")
				return
			}
			fmt.Println("Created view:", v1.ID)

			vr.ReplaceRoles(ctx, v1, roles[0].ID, roles[1].ID)
			v2 := CreateView("Test2")
			if v2 == nil {
				fmt.Println("Failed to create view 'Test2'")
				return
			}
			fmt.Println("Created view:", v2.ID)

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
	groups, _ := pgr.Read(ctx)
	{
		if len(groups) == 0 {
			pgr.Create(ctx, domain.ProductGroup{
				Name: "ProductGroup1",
			})
			pgr.Create(ctx, domain.ProductGroup{
				Name: "ProductGroup2",
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
	group1 := groups[0]
	group2 := groups[1]
	productsOfGroup1, _ := pgr.ReadProducts(ctx, group1)
	{
		if len(productsOfGroup1) == 0 {

			pgr.AppendProducts(ctx, group1,
				&domain.Product{
					Name:  "Cola",
					Price: 100,
				},
				&domain.Product{
					Name:  "Fanta",
					Price: 410,
				})

			pgr.AppendProducts(ctx, group2, &domain.Product{
				Name:  "Rum",
				Price: 610,
			})

			productsOfGroup1, _ = pgr.ReadProducts(ctx, group1)
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

	fmt.Println("# Views:")

	// vps := GetViewProductsByViewId(view1.ID)
	{
		// product := productsOfGroup1[0]
		view1 := views[0]

		fmt.Println("Appending product to view:")
		fmt.Println("View:", view1.String())
		// fmt.Println("   --", product.String())

		// vr.ReplaceViewProducts(ctx, view1,
		// 	&domain.ViewProduct{
		// 		Position: 1,
		// 		Color:    "blue",
		// 		Product:  product,
		// 	})

		// var products []*domain.Product
		// for _, pr := range productsOfGroup1 {
		// 	var p domain.Product
		// 	if err := db.Model(&p).Where("id = ?", pr.ID).Find(&p).Error; err != nil {
		// 		panic(err)
		// 	}
		// 	products = append(products, &p)
		// }

		// var viewProducts []*domain.ViewProduct
		// for _, pr := range productsOfGroup1 {
		// 	viewProducts = append(viewProducts, &domain.ViewProduct{
		// 		Product: pr,
		// 	})
		// }

		// for _, vp := range viewProducts {
		// 	fmt.Println("   --", vp.String())
		// }

		if err := db.Model(&view1).Association("Products").Append(productsOfGroup1); err != nil {
			fmt.Println("err: ", err)
		}

		// var vps []*domain.ViewProduct
		// if err := db.Model(&view1).Association("Products").Find(&vps); err != nil {
		// 	fmt.Println("err: ", err)
		// }

		vps := GetViewProductsByViewId(view1.ID)

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
