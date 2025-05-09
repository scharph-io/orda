package main

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// --- 1) Define your Observer interface

type Observer interface {
	AfterCreate(db *gorm.DB)
	AfterUpdate(db *gorm.DB)
	AfterDelete(db *gorm.DB)
}

// --- 2) Keep a registry of observers

var observers []Observer

func RegisterObserver(o Observer) {
	observers = append(observers, o)
}

func notifyCreate(db *gorm.DB) {
	for _, o := range observers {
		o.AfterCreate(db)
	}
}
func notifyUpdate(db *gorm.DB) {
	for _, o := range observers {
		o.AfterUpdate(db)
	}
}
func notifyDelete(db *gorm.DB) {
	for _, o := range observers {
		o.AfterDelete(db)
	}
}

// --- 3) Create a GORM plugin that wires the callbacks

type observerPlugin struct{}

func (observerPlugin) Name() string {
	return "observer.plugin"
}

func (observerPlugin) Initialize(db *gorm.DB) (err error) {
	// after create
	db.Callback().Create().After("gorm:create").
		Register("observer:after_create", func(tx *gorm.DB) {
			notifyCreate(tx)
		})

	// after update
	db.Callback().Update().After("gorm:update").
		Register("observer:after_update", func(tx *gorm.DB) {
			notifyUpdate(tx)
		})

	// after delete
	db.Callback().Delete().After("gorm:delete").
		Register("observer:after_delete", func(tx *gorm.DB) {
			notifyDelete(tx)
		})

	return nil
}

// --- 4) Example Domain & Observer

type User struct {
	ID   uint
	Name string
}

type loggingObserver struct{}

func (loggingObserver) AfterCreate(db *gorm.DB) {
	if db.Statement.Schema != nil {
		fmt.Printf("[LOG] created %s: %+v\n",
			db.Statement.Schema.Name, db.Statement.Dest)
	}
}
func (loggingObserver) AfterUpdate(db *gorm.DB) {
	fmt.Printf("[LOG] updated %s (ID=%v)\n",
		db.Statement.Schema.Name, db.Statement.RowsAffected)
}
func (loggingObserver) AfterDelete(db *gorm.DB) {
	fmt.Printf("[LOG] deleted %s (ID=%v)\n",
		db.Statement.Schema.Name, db.Statement.RowsAffected)
}

func main() {
	// open connection
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	// migrate
	db.AutoMigrate(&User{})

	// register our plugin & observer
	db.Use(&observerPlugin{})
	RegisterObserver(loggingObserver{})

	// do some operations
	u := User{Name: "Alice"}
	db.Create(&u)
	u.Name = "Alice Cooper"
	db.Save(&u)
	db.Delete(&u)
	db.Delete(&u)
}
