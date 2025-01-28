package main

import (
	"context"
	"fmt"

	"github.com/scharph/orda/internal/config"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/repository/view"
)

var (
	vr  ports.IViewRepository
	vpr ports.IViewProductRepository
	ctx = context.Background()
)

func main() {
	config := config.GetConfig().Server

	database.Connect()

	fmt.Println(config)

	db := database.DB

	vr = view.NewViewRepository(db)
	vpr = view.NewViewProductRepo(db)

	v := GetView("0194ad7b-3896-7668-8b6c-27c6f8f3030b")

	fmt.Println(v)
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
