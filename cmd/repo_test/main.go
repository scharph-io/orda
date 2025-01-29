package main

import (
	"context"
	"fmt"
	"runtime/debug"

	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/repository/assortment"
	"github.com/scharph/orda/internal/repository/user"
	"github.com/scharph/orda/internal/repository/view"
)

var (
	r ports.IRoleRepository

	pr ports.IProductRepository
	gr ports.IProductGroupRepository

	vr  ports.IViewRepository
	vpr ports.IViewProductRepository

	ctx = context.Background()
)

func main() {

	info, _ := debug.ReadBuildInfo()

	fmt.Println(info.Main.Path, info.Main.Version)
	fmt.Println(info.GoVersion)

	database.Connect()

	db := database.DB

	r = user.NewRoleRepo(db)

	vr = view.NewViewRepository(db)
	vpr = view.NewViewProductRepo(db)

	pr = assortment.NewProductRepo(db)
	gr = assortment.NewProductGroupRepo(db)

	views := GetViews()

	if len(views) == 0 {
		CreateView("Test")
		CreateView("Test2")
		views = GetViews()
	}

	for _, v := range views {
		fmt.Println(v.ID, v.Name)
	}

	groups, _ := gr.Read(ctx)

	if len(groups) == 0 {
		gr.Create(ctx, domain.ProductGroup{
			Name: "TestGroup1",
		})
		gr.Create(ctx, domain.ProductGroup{
			Name: "TestGroup2",
		})
		groups, _ = gr.Read(ctx)
	}

	fmt.Println("Groups")
	for _, g := range groups {
		fmt.Println(g.ID, g.Name)
	}

	products, _ := pr.ReadByGroupID(ctx, groups[0].ID)

	if len(products) == 0 {
		pr.Create(ctx, domain.Product{
			Name:           "TestProduct1",
			Price:          100,
			ProductGroupID: groups[0].ID,
		})
		pr.Create(ctx, domain.Product{
			Name:           "TestProduct2",
			Price:          200,
			ProductGroupID: groups[0].ID,
		})
		products, _ = pr.ReadByGroupID(ctx, groups[0].ID)
	}

	fmt.Println("Products in group", groups[0].Name, groups[0].ID)
	for _, p := range products {
		fmt.Println(p.ID, p.Name)
	}

	vps := GetViewProductsByViewId(views[0].ID)

	if len(vps) == 0 {
		fmt.Println("Append", products[0].Name, "to", views[0].Name)
		AppendProduct(views[0].ID, &domain.ViewProduct{
			Position:  0,
			Color:     "red",
			ProductID: products[0].ID,
		})

		AppendProduct(views[1].ID, &domain.ViewProduct{
			Position:  1,
			Color:     "blue",
			ProductID: products[1].ID,
		})
		vps = GetViewProductsByViewId(views[0].ID)
	}

	// RemoveProduct(views[0].ID, products[0].ID)
	//
	for _, vp := range vps {
		fmt.Println(vp.Product.Name, vp.Color, vp.Product.Price)
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

func AppendProduct(viewID string, product *domain.ViewProduct) error {
	return vpr.AppendProducts(ctx, viewID, product)
}

func RemoveProduct(viewID, productID string) error {
	return vpr.RemoveProduct(ctx, viewID, productID)
}

func GetViewProductsByViewId(id string) []*domain.ViewProduct {
	vp, err := vpr.ReadByViewID(ctx, id)
	if err != nil {
		fmt.Println(err)
	}
	return vp
}
