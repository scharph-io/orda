package main

import (
	"context"
	"fmt"

	"github.com/joho/godotenv"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/repository"
)

var (
	version string
	date    string
)

func main() {

	if err := godotenv.Load(".env"); err != nil {
		fmt.Println("INFO: No .env file found")
	}

	// app := fiber.New()
	database.ConnectDB()

	groupRepo := repository.NewGroupRepo(database.DB)
	// g, err := groupRepo.Create(context.TODO(), &model.Group{
	// 	Name: "Test Product",
	// })
	// if err != nil {
	// 	fmt.Println(err)
	// }

	// fmt.Println(g)

	productRepo := repository.NewProductRepo(database.DB)
	// p, err := productRepo.Create(context.TODO(), &model.Product{
	// 	Name:    "Test Productasdasdasdasd",
	// 	GroupID: g.ID,
	// 	Price:   100,
	// 	Desc:    "Test Product",
	// })
	// if err != nil {
	// 	fmt.Println(err)
	// }

	// fmt.Println(p.ID)

	g, err := groupRepo.Read(context.TODO())
	if err != nil {
		fmt.Println(err)

	}

	// x, err := productRepo.ImportMany(context.TODO(), g[0].ID, &[]model.Product{
	// 	{
	// 		Name:  "Test A",
	// 		Price: 110,
	// 		Desc:  "Test Product",
	// 	},
	// 	{
	// 		Name:  "Test B",
	// 		Price: 120,
	// 		Desc:  "Test Product",
	// 	},
	// 	{
	// 		Name:  "Test C",
	// 		Price: 130,
	// 		Desc:  "Test Product",
	// 	}})

	// if err != nil {
	// 	fmt.Println(err)
	// }

	// fmt.Println(len(x))

	d, err := productRepo.ReadByGroupID(context.TODO(), g[0].ID)

	if err != nil {
		fmt.Println(err)
	}

	for _, v := range d {
		fmt.Println(v.Name, v.Desc, v.Price)
	}

	// port := config.Config("PORT")
	// if port == "" {
	// 	port = "8080"
	// }

	// if tz := os.Getenv("TZ"); tz != "" {
	// 	var err error
	// 	log.Printf("setting time zone from ENV to '%s'", tz)
	// 	time.Local, err = time.LoadLocation(tz)
	// 	if err != nil {
	// 		log.Printf("error loading location '%s': %v\n", tz, err)
	// 	}
	// }

	// log.Println("server running on port", port)
	// router.SetupRoutes(app)
	// log.Fatal(app.Listen(fmt.Sprintf(":%s", port)))

	// // https://github.com/gofiber/recipes/tree/master/auth-docker-postgres-jwt

}
