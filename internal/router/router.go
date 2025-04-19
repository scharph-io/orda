package router

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/fiber/v2/middleware/healthcheck"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/scharph/orda/internal/middleware"
	"github.com/scharph/orda/web/client"
)

func (s *Server) SetupRoutes(app *fiber.App) {

	app.Use("/", filesystem.New(filesystem.Config{
		Root:       http.FS(client.Assets),
		PathPrefix: "dist/client/browser",
		Browse:     true,
		Index:      "index.html",
	}))

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:4200",
		AllowCredentials: true,
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowHeaders:     "Origin, Content-Type, Accept",
	}))

	// app.Use(csrf.New())

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

	app.Use(func(c *fiber.Ctx) error {
		sess, err := middleware.Store.Get(c)
		if err != nil {
			return err
		}
		c.Locals("session", sess)
		return c.Next()
	})

	// Auth
	auth := app.Group("/auth", logger.New(logger.Config{
		Format: "[auth] ${time} ${status} - ${latency} ${method} ${path}\n",
	}))
	auth.Post("/login", s.authHandlers.Login)
	auth.Post("/logout", s.authHandlers.RequireAuth, s.authHandlers.Logout)
	auth.Get("/session", s.authHandlers.Session)
	auth.Get("/policy", s.authHandlers.RequireAuth, s.authHandlers.Policy)

	api := app.Group("/api/v1", logger.New(logger.Config{
		Format: "[api] ${time} ${status} - ${latency} ${method} ${path}\n",
	}), s.authHandlers.RequireAuth)

	// v1 := api.Group("/v1", func(c *fiber.Ctx) error { // middleware for /api/v1
	// 	c.Set("Version", "v1")
	// 	return c.Next()
	// })

	// User
	user := api.Group("/user", s.authHandlers.RequireRole("admin"))
	user.Get("/", s.userHandlers.GetAll)
	user.Post("/", s.userHandlers.Register)
	user.Get("/:id", s.userHandlers.GetOne)
	user.Put("/:id", s.userHandlers.Update)
	user.Delete("/:id", s.userHandlers.Delete)

	// Role
	role := api.Group("/role", s.authHandlers.RequireRole("admin"))
	role.Get("/", s.roleHandlers.GetAll)
	role.Post("/", s.roleHandlers.Create)
	role.Put("/:id", s.roleHandlers.Update)
	role.Get("/:id", s.roleHandlers.GetOne)
	role.Delete("/:id", s.roleHandlers.Delete)

	// Account
	account := api.Group("/account", s.authHandlers.RequireRole("admin"))
	account.Get("/", s.accountHandlers.GetAll)
	account.Get("/:id", s.accountHandlers.GetById)
	account.Put("/:id", s.accountHandlers.Update)
	account.Post("/", s.accountHandlers.Create)
	account.Post("/:id/deposit", s.accountHandlers.Deposit)
	account.Delete("/:id", s.accountHandlers.Delete)

	// Account Group
	accountGroup := api.Group("/account-group")
	accountGroup.Get("/", s.accountHandlers.GetAllGroups)
	accountGroup.Post("/", s.accountHandlers.CreateGroup)
	accountGroup.Get("/:id", s.accountHandlers.GetGroupAccounts)
	accountGroup.Post("/:id/deposit", s.accountHandlers.DepositGroup)
	accountGroup.Delete("/:id", s.accountHandlers.DeleteGroup)

	accountHistory := account.Group("/history")
	accountHistory.Get("/", s.accountHandlers.GetHistory)

	// Assortment
	assortment := api.Group("/assortment")

	group := assortment.Group("/group")
	group.Get("/", s.assortmentHandlers.ReadGroups)
	group.Get("/:id", s.assortmentHandlers.ReadGroup)
	group.Post("/", s.assortmentHandlers.CreateGroup)
	group.Put("/:id", s.assortmentHandlers.UpdateGroup)
	group.Delete("/:id", s.assortmentHandlers.DeleteGroup)
	group.Post("/:id/products", s.assortmentHandlers.AddProducts)
	group.Put("/:id/deposit", s.assortmentHandlers.SetDeposit)
	group.Delete("/:id/deposit", s.assortmentHandlers.RemoveDeposit)

	product := assortment.Group("/product")
	product.Get("/", s.assortmentHandlers.ReadProducts) // uses query group_id
	product.Get("/:id", s.assortmentHandlers.ReadProductById)
	product.Put("/:id", s.assortmentHandlers.UpdateProduct)
	product.Patch("/:id/toggle", s.assortmentHandlers.ToggleProduct)
	product.Delete("/:id", s.assortmentHandlers.RemoveProduct)
	product.Patch("/:id/views", s.assortmentHandlers.SetOrAddViews)
	product.Delete("/:id/views", s.assortmentHandlers.RemoveViews)

	//Transactions
	transactions := api.Group("/transactions")
	transactions.Get("/", s.transactionHandlers.Read)
	transactions.Get("/summary", s.transactionHandlers.ReadSummaryFromTo)
	transactions.Get("/summarybydate", s.transactionHandlers.ReadSummaryAt)
	transactions.Post("/", s.transactionHandlers.Create)
	transactions.Get("/:id", s.transactionHandlers.ReadById)
	transactions.Delete("/:id", s.transactionHandlers.Delete)

	// Views
	views := api.Group("/views")
	views.Post("/", s.viewHandlers.Create)
	views.Get("/", s.viewHandlers.ReadMany)
	views.Get("/:id", s.viewHandlers.ReadOne)
	views.Put("/:id", s.viewHandlers.Update)
	views.Delete("/:id", s.viewHandlers.Delete)

	views.Get("/:id/roles", s.viewHandlers.GetRoles)
	views.Put("/:id/roles", s.viewHandlers.SetRoles)
	views.Delete("/:id/roles", s.viewHandlers.RemoveRoles)

	views.Get("/:id/products", s.viewHandlers.GetProducts)
	views.Put("/:id/products", s.viewHandlers.SetOrAddProducts)
	views.Delete("/:id/products", s.viewHandlers.RemoveProducts)

	// Order
	order := api.Group("/order")
	order.Get("/views", s.orderHandlers.GetOrderViews)
	order.Get("/views/:id", s.orderHandlers.GetOrderViewProducts)
	order.Post("/checkout", s.transactionHandlers.Create)

	// // Statistic
	// statistic := api.Group("/statistic")
	// statistic.Get("/", middleware.Protected(), handler.GetStatistics)
	// statistic.Get("/products", middleware.Protected(), handler.GetProductStatistic)

}
