package main

import (
	"fmt"

	"github.com/joho/godotenv"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/repository"
	"github.com/scharph/orda/internal/service"
)

func main() {

	if err := godotenv.Load(".env"); err != nil {
		fmt.Println("INFO: No .env file found")
	}

	database.ConnectDB()

	db := database.DB

	productRepo := repository.NewProductRepo(db)
	groupRepo := repository.NewGroupRepo(db)
	viewRepo := repository.NewViewRepo(db)
	// viewProductRepo := repository.NewViewProductRepo(db)

	ctx := db.Statement.Context

	// Create Group
	// group, err := groupRepo.Create(ctx, &model.Group{
	// 	Name: "Group 1",
	// 	Desc: "Group 1 Desc",
	// })

	// Get All Groups
	// groups, err := groupRepo.Read(ctx)
	// if err != nil {
	// 	fmt.Println(err)
	// }

	// result, err := productRepo.ImportMany(ctx, &[]model.Product{
	// 	{
	// 		Name:  "Cola",
	// 		Desc:  "0.5",
	// 		Price: 200,
	// 	},
	// 	{
	// 		Name:  "Cola",
	// 		Desc:  "0.3",
	// 		Price: 300,
	// 	},
	// 	{
	// 		Name:  "Cola",
	// 		Desc:  "0.2",
	// 		Price: 150,
	// 	},
	// }, groups[0].ID)

	// if err != nil {
	// 	fmt.Println(err)
	// }

	// fmt.Println("Added Products:", len(result))

	// Get the first 3 products
	// products, err := productRepo.Read(ctx)
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// fmt.Println("Products:", len(products))

	// p := products[:5]

	// _, err := viewRepo.Create(ctx, &model.View{
	// 	Name: "Kiosk 2",
	// 	// Products: p,
	// })

	// if err != nil {
	// 	fmt.Println(err)
	// }

	views, err := viewRepo.Read(ctx)

	if err != nil {
		fmt.Println(err)
	}

	fmt.Printf("Views: %d\n", len(views))

	// res, err := viewProductRepo.ReadByViewId(ctx, views[0].ID)
	// if err != nil {
	// 	fmt.Println(err)
	// }

	// for _, v := range res {
	// 	fmt.Println(v.Position, v.Product.Name, v.Position, v.Color)

	// }

	// res, err := viewProductRepo.Read(ctx)
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// for _, v := range res {
	// 	fmt.Println(v.View.Name, v.Position, v.Product.Name, v.Position, v.Color)

	// }
	// for _, v := range ReadViewProducts {
	// 	fmt.Println(v.Name, v.Deposit)
	// 	for _, p := range v.Products {
	// 		fmt.Println("--", p.Name, p.Desc, p.Price)
	// 	}
	// }

	_ = service.NewViewService(viewRepo, productRepo, groupRepo)

	// v := "01915f7f-36c1-79f7-a050-613526320bf3"
	// p := "01915f5d-307a-75d3-b5f1-e62cdb11cadd"

	// res, err := viewService.AddProduct(ctx, v, p)
	// if err != nil {
	// 	fmt.Println(err)
	// }

	// fmt.Println(res)

}
