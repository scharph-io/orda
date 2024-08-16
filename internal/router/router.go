package router

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/scharph/orda/internal/handler"
	"github.com/scharph/orda/web/client"
)

func SetupRoutes(app *fiber.App) {
	app.Use("/", filesystem.New(filesystem.Config{
		Root:       http.FS(client.Assets),
		PathPrefix: "dist/client/browser",
		Browse:     true,
		Index:      "index.html",
	}))

	app.Use(cors.New())
	// app.Use(cors.New(cors.Config{
	// 	AllowOrigins: "*",
	// 	AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH"}))

	api := app.Group("/api", logger.New())
	// api.Use(jwtware.New(jwtware.Config{
	// 	SigningKey: jwtware.SigningKey{
	// 		JWTAlg: jwtware.RS256,
	// 		Key:    middleware.Secret_key,
	// 	},
	// }))

	api.Get("/", handler.Hello)

	// Auth
	auth := api.Group("/auth")
	auth.Post("/login", handler.Login)

	// Assortment
	assortment := api.Group("/assortment")
	assortmentHandler := createAssortmentHandler()

	group := assortment.Group("/groups")
	group.Get("/", assortmentHandler.GetGroups)
	group.Get("/:id", assortmentHandler.GetGroupById)

	group.Post("/", assortmentHandler.CreateGroup)
	group.Put("/:id", assortmentHandler.UpdateGroup)
	group.Delete("/:id", assortmentHandler.DeleteGroup)
	group.Delete("/:id/products", assortmentHandler.DeleteProductsByGroup)

	product := assortment.Group("/products")
	product.Get("/", assortmentHandler.GetProducts)
	product.Post("/", assortmentHandler.CreateProduct)
	product.Put("/:id", assortmentHandler.UpdateProduct)
	product.Delete("/:id", assortmentHandler.DeleteProduct)

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
