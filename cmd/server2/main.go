package main

var (
	version string
	date    string
)

func main() {

	// if err := godotenv.Load(".env"); err != nil {
	// 	fmt.Println("INFO: No .env file found")
	// }

	// app := fiber.New()

	// // app := fiber.New()
	// database.Connect()

	// e, err := accesscontrol.Init()

	// if err != nil {
	// 	fmt.Println(err)
	// }

	// // ***
	// e.LoadPolicy()

	// // e.AddRoleForUser("alice", "admin")
	// // e.AddRoleForUser("bob", "user")

	// // e.AddGroupingPolicy("alice", "admin")

	// e.AddPolicy("user", "role", "read")
	// e.AddPolicy("admin", "assortment", "read")
	// e.AddPolicy("admin", "assortment", "write")
	// e.AddPolicy("admin", "roles", "read")
	// e.AddPolicy("admin", "roles", "write")
	// e.AddPolicy("admin", "accounts", "read")
	// e.AddPolicy("admin", "accounts", "write")

	// // e.AddPolicy("admin", "assortment", "read")
	// // e.AddPolicy("admin", "assortment", "write")
	// // e.AddNamedPolicy("p", "admin", "assortment", "read")

	// // e.AddPolicies(
	// // 	[][]string{{
	// // 		"admin", "users", "read",
	// // 	}})

	// // x, _ := e.GetAllRoles()
	// // fmt.Println(x)

	// // f, _ := e.GetAllNamedActions("p")
	// // fmt.Println(f)

	// // // d, _ := e.GetAllNamedObjects("p")
	// // // fmt.Println(d)

	// // t, _ := e.GetFilteredPolicy(1, "assortment")
	// // fmt.Println(t)

	// // g, _ := e.GetFilteredGroupingPolicy(1, "admin")
	// // fmt.Println(g)

	// // allow, _ := e.Enforce("user", "assortment:write")
	// // fmt.Println(allow)

	// // allow, _ = e.Enforce("admin", "assortment:write")
	// // fmt.Println(allow)

	// policySync := policy.NewPolicySync(e)
	// policyHandler := &policy.PolicyHandler{PolicySync: policySync}

	// app.Use(cors.New())

	// app.Get("/api/policies", policyHandler.HandleGetPolicies)
	// app.Get("/api/policies/:role", policyHandler.HandleGetRolePolicy)

	// app.Listen(":3000")
}
