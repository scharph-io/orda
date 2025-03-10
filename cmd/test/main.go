package main

import (
	"fmt"
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// User model with Pets association
type User struct {
	ID   uint
	Name string
	Pets []Pet
}

// Pet model
type Pet struct {
	ID     uint
	Name   string
	UserID uint
}

func main() {
	// Set up database with query logging enabled
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatal("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(&User{}, &Pet{})

	// Create test data
	cleanupDB(db)
	createTestData(db)

	// Demonstrate replace without creating new entries
	replaceWithoutCreating(db)

	// View final results
	showResults(db)
}

func cleanupDB(db *gorm.DB) {
	db.Exec("DELETE FROM pets")
	db.Exec("DELETE FROM users")
}

func createTestData(db *gorm.DB) {
	// Create a user with pets
	user := User{Name: "John"}
	db.Create(&user)

	// Add some pets to user
	pets := []Pet{
		{Name: "Dog", UserID: user.ID},
		{Name: "Cat", UserID: user.ID},
		{Name: "Fish", UserID: user.ID},
	}
	db.Create(&pets)

	fmt.Println("=== Initial Data ===")
	showResults(db)
}

func replaceWithoutCreating(db *gorm.DB) {
	// Load user with all pets
	var user User
	db.First(&user, 1)

	// Load existing pets to get their IDs
	var existingPets []Pet
	db.Where("user_id = ?", user.ID).Find(&existingPets)

	// Prepare pets for replacement - IMPORTANT: must include IDs of existing pets
	// We'll keep the first pet, update the second, and remove the third
	updatedPets := []Pet{
		existingPets[0], // Keep first pet unchanged
		{ID: existingPets[1].ID, Name: "Updated Cat Name"}, // Update second pet
		// Third pet is not included, so it will be removed
	}

	fmt.Println("\n=== Replacing Pets ===")
	fmt.Printf("Updating with pets: %+v\n", updatedPets)

	// Replace associations - this will update, not create
	err := db.Model(&user).Association("Pets").Replace(updatedPets)
	if err != nil {
		log.Fatalf("Failed to replace: %v", err)
	}
}

func showResults(db *gorm.DB) {
	var user User
	db.Preload("Pets").First(&user)

	fmt.Println("User:", user.Name, "ID:", user.ID)
	fmt.Println("Pets:")
	for _, pet := range user.Pets {
		fmt.Printf("  - %s (ID: %d, UserID: %d)\n", pet.Name, pet.ID, pet.UserID)
	}
}
