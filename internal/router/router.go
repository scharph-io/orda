package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/scharph/orda/internal/accesscontrol"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/handlers"
	"github.com/scharph/orda/internal/middleware"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/repository/account"
	"github.com/scharph/orda/internal/repository/assortment"
	"github.com/scharph/orda/internal/repository/user"
	"github.com/scharph/orda/internal/service"
)

type Server struct {
	userHandlers       ports.IUserHandlers
	authHandlers       ports.IAuthHandlers
	roleHandlers       ports.IRoleHandlers
	accountHandlers    ports.IAccountHandlers
	assortmentHandlers ports.IAssortmentHandlers
}

func NewServer() *Server {

	db := database.DB

	// repositories
	userRepo := user.NewUserRepo(db)
	roleRepo := user.NewRoleRepo(db)
	accountRepo := account.NewAccountRepo(db)
	accountGroupRepo := account.NewAccountGroupRepo(db)
	accountHistoryRepo := account.NewAccountHistoryRepo(db)

	productGroupRepo := assortment.NewProductGroupRepo(db)
	productRepo := assortment.NewProductRepo(db)

	// services
	userService := service.NewUserService(userRepo, roleRepo)
	roleService := service.NewRoleService(roleRepo)
	accountService := service.NewAccountService(accountRepo, accountGroupRepo, accountHistoryRepo)
	assortmentService := service.NewAssortmentService(productRepo, productGroupRepo)

	// handlers
	userHandlers := handlers.NewUserHandlers(userService)
	roleHandlers := handlers.NewRoleHandlers(roleService)
	authHandlers := handlers.NewAuthHandlers(userService, *middleware.Store, accesscontrol.PolicySyncInstance)
	accountHandlers := handlers.NewAccountHandlers(accountService)
	assortmentHandlers := handlers.NewAssortmentHandler(assortmentService)

	return &Server{
		userHandlers,
		authHandlers,
		roleHandlers,
		accountHandlers,
		assortmentHandlers,
	}
}

func (s *Server) SetupRoutes(app *fiber.App) {

	// app.Use("/", filesystem.New(filesystem.Config{
	// 	Root:       http.FS(client.Assets),
	// 	PathPrefix: "dist/client/browser",
	// 	Browse:     true,
	// 	Index:      "index.html",
	// }))

	app.Use(cors.New())
	// app.Use(cors.New(cors.Config{
	// 	AllowOrigins: "*",
	// 	AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH"}))

	// Auth
	auth := app.Group("/auth")
	auth.Post("/login", s.authHandlers.Login)
	auth.Post("/logout", s.authHandlers.RequireAuth, s.authHandlers.Logout)
	auth.Get("/policy", s.authHandlers.RequireAuth, s.authHandlers.Policy)

	api := app.Group("/api", logger.New(logger.Config{
		Format: "[API] ${time} ${status} - ${latency} ${method} ${path}\n",
	}), s.authHandlers.RequireAuth)

	// User
	user := api.Group("/user", s.authHandlers.RequireRole("admin"))
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
