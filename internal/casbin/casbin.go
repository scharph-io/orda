package casbin

import (
	"fmt"

	"github.com/casbin/casbin/v2"
	gormadapter "github.com/casbin/gorm-adapter/v3"
	_ "github.com/go-sql-driver/mysql"
	"github.com/scharph/orda/internal/config"
)

const (
	casbin_model = "rbac_model.conf"
)

func Enforcer() (*casbin.Enforcer, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/",
		config.Config("DB_USER"),
		config.Config("DB_PASSWORD"),
		config.Config("DB_HOST"),
		config.Config("DB_PORT"),
	)

	a, err := gormadapter.NewAdapter("mysql", dsn) // Your driver and data source.
	if err != nil {
		return nil, err
	}

	e, err := casbin.NewEnforcer(casbin_model, a)
	if err != nil {
		return nil, err
	}

	if err := e.LoadPolicy(); err != nil {
		return nil, err
	}
	return e, nil
}
