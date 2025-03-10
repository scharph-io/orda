package router

import (
	"github.com/scharph/orda/internal/accesscontrol"
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/handlers"
	"github.com/scharph/orda/internal/middleware"
	"github.com/scharph/orda/internal/ports"
	"github.com/scharph/orda/internal/repository/account"
	"github.com/scharph/orda/internal/repository/assortment"
	"github.com/scharph/orda/internal/repository/transaction"
	"github.com/scharph/orda/internal/repository/user"
	"github.com/scharph/orda/internal/repository/view"
	"github.com/scharph/orda/internal/service"
)

type Server struct {
	userHandlers        ports.IUserHandlers
	authHandlers        ports.IAuthHandlers
	roleHandlers        ports.IRoleHandlers
	accountHandlers     ports.IAccountHandlers
	assortmentHandlers  ports.IAssortmentHandlers
	viewHandlers        ports.IViewHandlers
	transactionHandlers ports.ITransactionHandlers
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

	viewRepo := view.NewViewRepository(db)
	viewRoleRepo := view.NewViewRoleRepo(db)
	viewProductRepo := view.NewViewProductRepo(db)

	transactionRepo := transaction.NewTransactionRepository(db)
	transactionItemRepo := transaction.NewTransactionItemRepository(db)

	// services
	userService := service.NewUserService(userRepo, roleRepo)
	roleService := service.NewRoleService(roleRepo)
	accountService := service.NewAccountService(accountRepo, accountGroupRepo, accountHistoryRepo)
	assortmentService := service.NewAssortmentService(productRepo, productGroupRepo)
	viewService := service.NewViewService(viewRepo, viewProductRepo, viewRoleRepo)
	transactionService := service.NewTransactionService(transactionRepo, transactionItemRepo, productRepo)

	// handlers
	userHandlers := handlers.NewUserHandlers(userService)
	roleHandlers := handlers.NewRoleHandlers(roleService)
	authHandlers := handlers.NewAuthHandlers(userService, *middleware.Store, accesscontrol.PolicySyncInstance)
	accountHandlers := handlers.NewAccountHandlers(accountService)
	assortmentHandlers := handlers.NewAssortmentHandler(assortmentService)
	viewHandlers := handlers.NewViewHandlers(viewService)
	transactionHandlers := handlers.NewTransactionHandler(transactionService)

	return &Server{
		userHandlers,
		authHandlers,
		roleHandlers,
		accountHandlers,
		assortmentHandlers,
		viewHandlers,
		transactionHandlers,
	}
}

// func createAssortmentHandler() *handler.AssortmentHandler {
// 	return handler.NewAssortmentHandler(
// 		service.NewAssortmentService(
// 			repository.NewGroupRepo(database.DB),
// 			repository.NewProductRepo(database.DB),
// 		),
// 	)
// }

// func createViewHandler() *handler.ViewHandler {
// 	return handler.NewViewHandler(
// 		service.NewViewService(
// 			repository.NewViewRepo(database.DB),
// 			repository.NewViewProductRepo(database.DB),
// 			repository.NewProductRepo(database.DB),
// 			repository.NewGroupRepo(database.DB),
// 		),
// 	)
// }
