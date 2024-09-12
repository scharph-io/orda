package main

import (
	"fmt"

	"github.com/joho/godotenv"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/repository"
)

func main() {

	if err := godotenv.Load(".env"); err != nil {
		fmt.Println("INFO: No .env file found")
	}

	database.ConnectDB()

	db := database.DB

	productRepo := repository.NewProductRepo(db)
	// groupRepo := repository.NewGroupRepo(db)
	viewRepo := repository.NewViewRepo(db)
	// viewProductRepo := repository.NewViewProductRepo(db)

	ctx := db.Statement.Context

	views, err := viewRepo.Read(ctx)

	if err != nil {
		fmt.Println(err)
	}
	fmt.Printf("Views: %d\n", len(views))

	view := views[0]

	// vS := service.NewViewService(viewRepo, productRepo, groupRepo)

	// vS.AddProduct(ctx, view.ID, "01915f5d-307a-75d3-b5f1-e62cdb11cadd")

	products, err := productRepo.Read(ctx)
	if err != nil {
		fmt.Println(err)
	}
	p := products[0]

	viewRepo.AddProduct(ctx, view.ID, p)

	view1, err := viewRepo.ReadById(ctx, "01917afe-07de-744e-b2d8-8e002e76cfb5")
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println(len(view1.Products))

	view1.Products = append(view.Products, products[2])
	// fmt.Println(view)

	_, err = viewRepo.Update(ctx, &view)
	if err != nil {
		fmt.Println(err)
	}

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

	// v := "01915f7f-36c1-79f7-a050-613526320bf3"
	// p := "01915f5d-307a-75d3-b5f1-e62cdb11cadd"

	// res, err := viewService.AddProduct(ctx, v, p)
	// if err != nil {
	// 	fmt.Println(err)
	// }

	// fmt.Println(res)

}
