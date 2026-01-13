package accesscontrol

import (
	"fmt"

	"github.com/casbin/casbin/v3"
	gormadapter "github.com/casbin/gorm-adapter/v3"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gofiber/fiber/v2/log"
	"github.com/scharph/orda/internal/config"
)

const (
	driver_name = "mysql"
)

func enforcer() (*casbin.Enforcer, error) {
	c := config.GetConfig().Database
	s := config.GetConfig().Server

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/",
		c.User, c.Password, c.Host, c.Port,
	)

	a, err := gormadapter.NewAdapter(driver_name, dsn) // Your driver and data source.
	if err != nil {
		return nil, err
	}

	e, err := casbin.NewEnforcer(s.EnforcerFile, a)
	if err != nil {
		return nil, err
	}

	e.LoadPolicy()

	if err := initPolicies(e); err != nil {
		return nil, err
	}
	return e, nil
}

func initPolicies(e *casbin.Enforcer) error {
	for _, o := range obj {
		for _, a := range act {
			has, err := e.HasPolicy(admin, o, a)
			if !has || err != nil {
				// log.SetLevel(log.LevelInfo)
				log.Debugf("Adding initial policy: '%s:%s:%s'", admin, o, a)
				e.AddPolicy(admin, o, a)
			}
		}
	}
	return e.SavePolicy()
}
