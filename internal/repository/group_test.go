package repository

import (
	"context"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/scharph/orda/internal/model"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewMockGORM() (GORM *gorm.DB, close func(), mock sqlmock.Sqlmock) {
	db, mock, err := sqlmock.New()
	if err != nil {
		panic(err)
	}

	// GORM always runs this query, so mock it for all tests
	mock.ExpectQuery("SELECT VERSION()").WillReturnRows(sqlmock.NewRows([]string{"version"}).AddRow("5.7.0"))

	GORM, err = gorm.Open(mysql.New(mysql.Config{Conn: db}), &gorm.Config{Logger: logger.Default.LogMode(logger.Silent)})
	if err != nil {
		panic(err)
	}

	GORM.AutoMigrate(&model.Product{}, &model.Group{})

	return GORM, func() { db.Close() }, mock
}

func TestCreate(t *testing.T) {
	db, close, mock := NewMockGORM()
	defer close()

	mock.ExpectExec("^INSERT INTO product_group (.+)$").WillReturnResult(sqlmock.NewResult(1, 1))

	group := NewGroupRepo(db)

	_, err := group.Create(context.TODO(), &model.Group{
		Name: "Test Group",
	})

	if err != nil {
		t.Error(err)
	}

	// mock.ExpectQuery("INSERT INTO `product_groups`").WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))

}
