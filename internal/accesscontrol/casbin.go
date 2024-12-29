package accesscontrol

import (
	"fmt"
	"os"

	"github.com/casbin/casbin/v2"
	gormadapter "github.com/casbin/gorm-adapter/v3"
	_ "github.com/go-sql-driver/mysql"
)

const (
	casbin_model = "rbac_model.conf"
	driver_name  = "mysql"
)

func enforcer() (*casbin.Enforcer, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
	)

	a, err := gormadapter.NewAdapter(driver_name, dsn) // Your driver and data source.
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

	// if err := initPolicies(e); err != nil {
	// 	return nil, err
	// }
	return e, nil
}

// func initPolicies(e *casbin.Enforcer) error {
// for _, o := range obj {
// 	for _, a := range act {
// 		has, err := e.HasPolicy(admin, o, a)
// 		if !has || err != nil {
// 			log.Debugf("Adding initial policy: '%s:%s:%s'", admin, o, a)
// 			e.AddPolicy(admin, o, a)
// 		}
// 	}
// }
// return e.SavePolicy()
// }
