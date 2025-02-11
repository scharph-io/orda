package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/healthcheck"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func (s *Server) SetupRoutes(app *fiber.App) {

	// app.Use("/", filesystem.New(filesystem.Config{
	// 	Root:       http.FS(client.Assets),
	// 	PathPrefix: "dist/client/browser",
	// 	Browse:     true,
	// 	Index:      "index.html",
	// }))

	// app.Use(requestid.New(requestid.Config{
	// 	Header: "X-Custom-Header",
	// 	Generator: func() string {
	// 		return "static-id"
	// 	},
	// }))

	app.Use(cors.New())
	// app.Use(cors.New(cors.Config{
	// 	AllowOrigins: "*",
	// 	AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH"}))
	//

	app.Use(healthcheck.New(healthcheck.Config{
		LivenessProbe: func(c *fiber.Ctx) bool {
			return true
		},
		LivenessEndpoint: "/live",
		ReadinessProbe: func(c *fiber.Ctx) bool {
			return true
		},
		ReadinessEndpoint: "/ready",
	}))

	// Auth
	auth := app.Group("/auth")
	auth.Post("/login", s.authHandlers.Login)
	auth.Post("/logout", s.authHandlers.RequireAuth, s.authHandlers.Logout)
	auth.Get("/policy", s.authHandlers.RequireAuth, s.authHandlers.Policy)

	api := app.Group("/api", logger.New(logger.Config{
		Format: "[API] ${time} ${status} - ${latency} ${method} ${path}\n",
	}), s.authHandlers.RequireAuth)

	v1 := api.Group("/v1", func(c *fiber.Ctx) error { // middleware for /api/v1
		c.Set("Version", "v1")
		return c.Next()
	})

	// User
	user := v1.Group("/user", logger.New(logger.Config{
		Format: "[USER] ${time} ${status} - ${latency} ${method} ${path}\n",
	}), s.authHandlers.RequireRole("admin"))
	user.Get("/", s.userHandlers.GetAll)
	user.Post("/", s.userHandlers.Register)
	user.Get("/:id", s.userHandlers.GetOne)
	user.Put("/:id", s.userHandlers.Update)
	user.Delete("/:id", s.userHandlers.Delete)

	// Role
	role := api.Group("/role")
	role.Get("/", s.roleHandlers.GetAll)
	role.Post("/", s.authHandlers.RequireRole("admin"), s.roleHandlers.Create)
	role.Get("/:id", s.roleHandlers.GetOne)

	// Account
	account := api.Group("/account")
	account.Get("/", s.accountHandlers.GetAll)
	account.Post("/", s.accountHandlers.Create)
	account.Post("/:id/deposit", s.accountHandlers.Deposit)
	account.Delete("/:id", s.accountHandlers.DeleteAccount)

	// Account Group
	accountGroup := account.Group("/group")
	accountGroup.Get("/", s.accountHandlers.GetAllGroups)
	accountGroup.Post("/", s.accountHandlers.CreateGroup)
	accountGroup.Get("/:id", s.accountHandlers.GetGroupAccounts)
	accountGroup.Post("/:id/deposit", s.accountHandlers.DepositGroup)
	accountGroup.Delete("/:id", s.accountHandlers.DeleteGroup)

	accountHistory := account.Group("/history")
	accountHistory.Get("/", s.accountHandlers.GetHistory)

	// Assortment
	assortment := api.Group("/assortment")

	group := assortment.Group("/groups")
	group.Get("/", s.assortmentHandlers.ReadGroups)
	group.Post("/", s.assortmentHandlers.CreateGroup)
	group.Put("/:id", s.assortmentHandlers.UpdateGroup)
	group.Delete("/:id", s.assortmentHandlers.DeleteGroup)
	group.Get("/:id/products", s.assortmentHandlers.ReadProducts)
	group.Post("/:id/products", s.assortmentHandlers.AddProducts)
	group.Delete("/:id/products/:product", s.assortmentHandlers.RemoveProduct)

	products := assortment.Group("/products")
	products.Put("/:id", s.assortmentHandlers.UpdateProduct)
	products.Put("/:id/toggle", s.assortmentHandlers.ToggleProduct)

	transactions := api.Group("/transaction")
	transactions.Get("/", s.transactionHandlers.ReadLimit)
	transactions.Post("/", s.transactionHandlers.Create)
	transactions.Get("/:id", s.transactionHandlers.ReadById)
	transactions.Delete("/:id", s.transactionHandlers.Delete)

	views := api.Group("/views")
	views.Get("/", s.viewHandlers.Read)
	views.Post("/", s.viewHandlers.Create)
	views.Get("/:id", s.viewHandlers.ReadByID)
	views.Put("/:id", s.viewHandlers.Update)
	views.Delete("/:id", s.viewHandlers.Delete)
	views.Put("/:id/products", s.viewHandlers.AddProducts)
	views.Delete("/:id/products", s.viewHandlers.RemoveProduct)
	views.Put("/:id/roles", s.viewHandlers.AddRoles)

	// views := api.Group("/views")
	// viewHandler := createViewHandler()
	// views.Get("/", viewHandler.GetViews)
	// views.Post("/", viewHandler.CreateView)
	// views.Get("/:id", viewHandler.GetViewById)
	// views.Put("/:id", viewHandler.UpdateView)
	// views.Delete("/:id", viewHandler.DeleteView)
	// // views.Get("/:id/products" /*TODO*/)
	// views.Post("/:id/products/add", viewHandler.AddProducts)
	// views.Post("/:id/products/remove", viewHandler.RemoveProducts)

	// // Checkout
	// checkout := api.Group("/checkout")
	// checkout.Post("/", middleware.Protected(), handler.CreateTransaction)

	// // Transaction
	// transaction := api.Group("/transaction")
	// transaction.Get("/", middleware.Protected(), handler.GetAllTransactions)
	// transaction.Delete("/:id", middleware.Protected(), handler.DeleteTransaction)

	// // Statistic
	// statistic := api.Group("/statistic")
	// statistic.Get("/", middleware.Protected(), handler.GetStatistics)
	// statistic.Get("/products", middleware.Protected(), handler.GetProductStatistic)

}
