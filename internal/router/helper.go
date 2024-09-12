package router

import (
	"github.com/scharph/orda/internal/database"
	"github.com/scharph/orda/internal/handler"
	"github.com/scharph/orda/internal/repository"
	"github.com/scharph/orda/internal/service"
)

func createAssortmentHandler() *handler.AssortmentHandler {
	return handler.NewAssortmentHandler(
		service.NewAssortmentService(
			repository.NewGroupRepo(database.DB),
			repository.NewProductRepo(database.DB),
		),
	)
}

func createViewHandler() *handler.ViewHandler {
	return handler.NewViewHandler(
		service.NewViewService(
			repository.NewViewRepo(database.DB),
			repository.NewViewProductRepo(database.DB),
			repository.NewProductRepo(database.DB),
			repository.NewGroupRepo(database.DB),
		),
	)
}
