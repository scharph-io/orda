package main

import (
	"fmt"

	"github.com/joho/godotenv"
	"github.com/scharph/orda/internal/casbin"
	"github.com/scharph/orda/internal/database"
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

	e, err := casbin.Enforcer()

	if err != nil {
		fmt.Println(err)
	}

	// ***
	e.LoadPolicy()

	e.AddRoleForUser("alice", "admin")
	e.AddRoleForUser("bob", "user")

	e.AddPolicy("user", "assortment", "read")
	e.AddPolicy("admin", "assortment", "read")
	e.AddPolicy("admin", "assortment", "write")
	// e.AddNamedPolicy("p", "admin", "assortment", "read")

	e.AddPolicies(
		[][]string{{
			"admin", "users", "read",
		}})

	x, _ := e.GetAllRoles()
	fmt.Println(x)

	f, _ := e.GetAllNamedActions("p")
	fmt.Println(f)

	// d, _ := e.GetAllNamedObjects("p")
	// fmt.Println(d)

	t, _ := e.GetFilteredPolicy(1, "assortment")
	fmt.Println(t)

	g, _ := e.GetFilteredGroupingPolicy(1, "admin")
	fmt.Println(g)

	allow, _ := e.Enforce("bob", "assortment", "read")
	fmt.Println(allow)

}
