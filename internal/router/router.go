package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/handlers"
	"github.com/scharph/orda/internal/middleware"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/repository"
	"github.com/scharph/orda/internal/service"
)

type Server struct {
	userHandlers ports.IUserHandlers
	authHandlers ports.IAuthHandlers
}

func NewServer() *Server {

	db := database.DB

	// repositories
	userRepo := repository.NewUserRepo(db)

	// services
	userService := service.NewUserService(userRepo)

	// handlers
	userHandlers := handlers.NewUserHandlers(userService)
	authHandlers := handlers.NewAuthHandlers(userService, *middleware.Store)

	return &Server{
		userHandlers,
		authHandlers,
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
	auth.Post("/logout", s.authHandlers.Logout, s.authHandlers.RequireAuth)

	api := app.Group("/api", logger.New(), s.authHandlers.RequireAuth)

	// User
	user := api.Group("/user")
	user.Get("/", s.userHandlers.GetAll, s.authHandlers.RequireRole("admin"))
	user.Post("/", s.userHandlers.Register)
	user.Get("/:id", s.userHandlers.GetOne)
	user.Put("/:id", s.userHandlers.Update)
	user.Delete("/:id", s.userHandlers.Delete)

	// // Policy
	// policy := api.Group("/policy")
	// pHandler := handler.NewPolicyHandler(accesscontrol.PolicySyncInstance)
	// policy.Get("/", pHandler.GetPolicies)
	// policy.Get("/subjects", pHandler.GetSubjects)

	// // Assortment
	// assortment := api.Group("/assortment")
	// assortmentHandler := createAssortmentHandler()

	// group := assortment.Group("/groups")
	// group.Get("/", assortmentHandler.GetGroups)
	// group.Get("/:id", assortmentHandler.GetGroupById)

	// group.Post("/", assortmentHandler.CreateGroup)
	// group.Put("/:id", assortmentHandler.UpdateGroup)
	// group.Delete("/:id", assortmentHandler.DeleteGroup)
	// group.Delete("/:id/products", assortmentHandler.DeleteProductsByGroup)

	// product := assortment.Group("/products")
	// product.Get("/", assortmentHandler.GetProducts)
	// product.Post("/", assortmentHandler.CreateProduct)
	// product.Put("/:id", assortmentHandler.UpdateProduct)
	// product.Delete("/:id", assortmentHandler.DeleteProduct)

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

	// Category
	// category := api.Group("/category")
	// category.Get("/", middleware.Protected(), handler.GetAllCategories)
	// category.Post("/", middleware.Protected(), handler.CreateCategory)
	// category.Put("/:id", middleware.Protected(), handler.UpdateCategory)
	// category.Delete("/:id", middleware.Protected(), handler.DeleteCategory)
	// category.Get("/:id/product", middleware.Protected(), handler.GetAllCategoryProducts)
	// category.Get("export/:id/product", middleware.Protected(), handler.GetAllCategoryProductsAsFile)

	// // Group
	// group := api.Group("/group")

	// // group.Get("/", middleware.Protected(), handler.GetAllGroups)
	// group.Post("/", middleware.Protected(), handler.CreateGroup)
	// group.Put("/:id", middleware.Protected(), handler.UpdateGroup)
	// group.Delete("/:id", middleware.Protected(), handler.DeleteGroup)

	// // Product
	// product := api.Group("/product")
	// product.Get("/", middleware.Protected(), handler.GetAllProducts)
	// product.Post("/", middleware.Protected(), handler.CreateProduct)
	// product.Post("/import", middleware.Protected(), handler.ImportProducts)
	// // product.Get("/:id", middleware.Protected(), handler.GetProduct)
	// product.Put("/:id", middleware.Protected(), handler.UpdateProduct)
	// product.Delete("/:id", middleware.Protected(), handler.DeleteProduct)

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
