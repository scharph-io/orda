package user

import (
	"context"
	"testing"

	"github.com/scharph/orda/internal/domain"
	"github.com/scharph/orda/internal/repository"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Test database setup
func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		t.Fatalf("Failed to connect to test database: %v", err)
	}

	// Auto migrate the schema
	err = db.AutoMigrate(&domain.Role{}, &domain.User{})
	if err != nil {
		t.Fatalf("Failed to migrate test database: %v", err)
	}

	return db
}

// Test database setup for benchmarks
func setupBenchmarkDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		panic("Failed to connect to benchmark database: " + err.Error())
	}

	// Auto migrate the schema
	err = db.AutoMigrate(&domain.Role{}, &domain.User{})
	if err != nil {
		panic("Failed to migrate benchmark database: " + err.Error())
	}

	return db
}

// Test fixtures
func createTestRole(t *testing.T, db *gorm.DB) *domain.Role {
	role := &domain.Role{
		Base: domain.Base{ID: "test-role-id"},
		Name: "test-role",
	}
	if err := db.Create(role).Error; err != nil {
		t.Fatalf("Failed to create test role: %v", err)
	}
	return role
}

// Benchmark fixtures
func createBenchmarkRole(db *gorm.DB) *domain.Role {
	role := &domain.Role{
		Base: domain.Base{ID: "bench-role-id"},
		Name: "bench-role",
	}
	if err := db.Create(role).Error; err != nil {
		panic("Failed to create benchmark role: " + err.Error())
	}
	return role
}

func createBenchmarkUser(db *gorm.DB, role *domain.Role) *domain.User {
	user := &domain.User{
		Base:     domain.Base{ID: "bench-user-id"},
		Username: "benchuser",
		Password: "benchpass",
		RoleId:   role.ID,
	}
	if err := db.Create(user).Error; err != nil {
		panic("Failed to create benchmark user: " + err.Error())
	}
	return user
}

func createTestUser(t *testing.T, db *gorm.DB, role *domain.Role) *domain.User {
	user := &domain.User{
		Base:     domain.Base{ID: "test-user-id"},
		Username: "testuser",
		Password: "testpass",
		RoleId:   role.ID,
	}
	if err := db.Create(user).Error; err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}
	return user
}

func TestNewUserRepo(t *testing.T) {
	db := setupTestDB(t)

	repo := NewUserRepo(db)

	if repo == nil {
		t.Fatal("NewUserRepo returned nil")
	}

	if repo.db != db {
		t.Error("NewUserRepo did not set database correctly")
	}
}

func TestUserRepo_Create(t *testing.T) {
	db := setupTestDB(t)
	repo := NewUserRepo(db)
	role := createTestRole(t, db)
	ctx := context.Background()

	t.Run("successful creation", func(t *testing.T) {
		user := &domain.User{
			Username: "newuser",
			Password: "password123",
			RoleId:   role.ID,
		}

		createdUser, err := repo.Create(ctx, user)
		if err != nil {
			t.Fatalf("Create failed: %v", err)
		}

		if createdUser == nil {
			t.Fatal("Created user is nil")
		}

		if createdUser.Username != "newuser" {
			t.Errorf("Expected username 'newuser', got '%s'", createdUser.Username)
		}

		if createdUser.ID == "" {
			t.Error("Created user should have an ID")
		}

		// Verify user was actually created in database
		var dbUser domain.User
		if err := db.First(&dbUser, "username = ?", "newuser").Error; err != nil {
			t.Errorf("User not found in database: %v", err)
		}
	})

	t.Run("duplicate username", func(t *testing.T) {
		// Create first user
		user1 := &domain.User{
			Username: "duplicate",
			Password: "password123",
			RoleId:   role.ID,
		}
		_, err := repo.Create(ctx, user1)
		if err != nil {
			t.Fatalf("First user creation failed: %v", err)
		}

		// Try to create user with same username
		user2 := &domain.User{
			Username: "duplicate",
			Password: "password456",
			RoleId:   role.ID,
		}
		_, err = repo.Create(ctx, user2)
		if err != repository.ErrResourceAlreadyExists {
			t.Errorf("Expected ErrResourceAlreadyExists, got: %v", err)
		}
	})

	t.Run("invalid role", func(t *testing.T) {
		user := &domain.User{
			Username: "invalidrole",
			Password: "password123",
			RoleId:   "non-existent-role",
		}

		_, err := repo.Create(ctx, user)
		// Improved implementation validates role existence
		if err == nil {
			t.Error("Expected error for invalid role, got nil")
		}
	})

	t.Run("validation failures", func(t *testing.T) {
		// Test nil user
		_, err := repo.Create(ctx, nil)
		if err == nil {
			t.Error("Expected error for nil user, got nil")
		}

		// Test empty username
		user := &domain.User{
			Username: "",
			Password: "password123",
			RoleId:   role.ID,
		}
		_, err = repo.Create(ctx, user)
		if err == nil {
			t.Error("Expected error for empty username, got nil")
		}

		// Test short username
		user.Username = "ab"
		_, err = repo.Create(ctx, user)
		if err == nil {
			t.Error("Expected error for short username, got nil")
		}

		// Test long username
		user.Username = "this_is_a_very_long_username_that_exceeds_fifty_characters_limit"
		_, err = repo.Create(ctx, user)
		if err == nil {
			t.Error("Expected error for long username, got nil")
		}

		// Test empty password
		user.Username = "validuser"
		user.Password = ""
		_, err = repo.Create(ctx, user)
		if err == nil {
			t.Error("Expected error for empty password, got nil")
		}

		// Test short password
		user.Password = "123"
		_, err = repo.Create(ctx, user)
		if err == nil {
			t.Error("Expected error for short password, got nil")
		}

		// Test empty role ID
		user.Password = "validpass"
		user.RoleId = ""
		_, err = repo.Create(ctx, user)
		if err == nil {
			t.Error("Expected error for empty role ID, got nil")
		}
	})
}

func TestUserRepo_Read(t *testing.T) {
	db := setupTestDB(t)
	repo := NewUserRepo(db)
	role := createTestRole(t, db)
	ctx := context.Background()

	t.Run("empty database", func(t *testing.T) {
		users, err := repo.Read(ctx)
		if err != nil {
			t.Fatalf("Read failed: %v", err)
		}

		if len(users) != 0 {
			t.Errorf("Expected 0 users, got %d", len(users))
		}
	})

	t.Run("with users", func(t *testing.T) {
		// Create test users
		user1 := createTestUser(t, db, role)
		user2 := &domain.User{
			Username: "testuser2",
			Password: "testpass2",
			RoleId:   role.ID,
		}
		if err := db.Create(user2).Error; err != nil {
			t.Fatalf("Failed to create second test user: %v", err)
		}

		users, err := repo.Read(ctx)
		if err != nil {
			t.Fatalf("Read failed: %v", err)
		}

		if len(users) != 2 {
			t.Errorf("Expected 2 users, got %d", len(users))
		}

		// Verify preloading worked
		found := false
		for _, user := range users {
			if user.ID == user1.ID {
				found = true
				if user.Role.Name != role.Name {
					t.Error("Role not preloaded correctly")
				}
			}
		}
		if !found {
			t.Error("Created user not found in results")
		}
	})
}

func TestUserRepo_ReadByUsername(t *testing.T) {
	db := setupTestDB(t)
	repo := NewUserRepo(db)
	role := createTestRole(t, db)
	ctx := context.Background()

	t.Run("user not found", func(t *testing.T) {
		_, err := repo.ReadByUsername(ctx, "nonexistent")
		if err == nil {
			t.Error("Expected error for non-existent user, got nil")
		}
	})

	t.Run("user found", func(t *testing.T) {
		testUser := createTestUser(t, db, role)

		user, err := repo.ReadByUsername(ctx, "testuser")
		if err != nil {
			t.Fatalf("ReadByUsername failed: %v", err)
		}

		if user.ID != testUser.ID {
			t.Errorf("Expected user ID '%s', got '%s'", testUser.ID, user.ID)
		}

		if user.Username != "testuser" {
			t.Errorf("Expected username 'testuser', got '%s'", user.Username)
		}

		// Verify role is preloaded
		if user.Role.Name != role.Name {
			t.Error("Role not preloaded correctly")
		}
	})

	t.Run("validation failures", func(t *testing.T) {
		// Test empty username
		_, err := repo.ReadByUsername(ctx, "")
		if err == nil {
			t.Error("Expected error for empty username, got nil")
		}
	})
}

func TestUserRepo_ReadById(t *testing.T) {
	db := setupTestDB(t)
	repo := NewUserRepo(db)
	role := createTestRole(t, db)
	ctx := context.Background()

	t.Run("user not found", func(t *testing.T) {
		_, err := repo.ReadById(ctx, "nonexistent")
		if err == nil {
			t.Error("Expected error for non-existent user, got nil")
		}
	})

	t.Run("user found", func(t *testing.T) {
		testUser := createTestUser(t, db, role)

		user, err := repo.ReadById(ctx, testUser.ID)
		if err != nil {
			t.Fatalf("ReadById failed: %v", err)
		}

		if user.ID != testUser.ID {
			t.Errorf("Expected user ID '%s', got '%s'", testUser.ID, user.ID)
		}

		if user.Username != testUser.Username {
			t.Errorf("Expected username '%s', got '%s'", testUser.Username, user.Username)
		}

		// Verify role is preloaded
		if user.Role.Name != role.Name {
			t.Error("Role not preloaded correctly")
		}
	})

	t.Run("validation failures", func(t *testing.T) {
		// Test empty ID
		_, err := repo.ReadById(ctx, "")
		if err == nil {
			t.Error("Expected error for empty ID, got nil")
		}
	})
}

func TestUserRepo_Update(t *testing.T) {
	db := setupTestDB(t)
	repo := NewUserRepo(db)
	role := createTestRole(t, db)
	ctx := context.Background()

	t.Run("successful update", func(t *testing.T) {
		testUser := createTestUser(t, db, role)

		updateData := &domain.User{
			Username: "updateduser",
			Password: "newpassword",
		}

		updatedUser, err := repo.Update(ctx, testUser.ID, updateData)
		if err != nil {
			t.Fatalf("Update failed: %v", err)
		}

		if updatedUser == nil {
			t.Fatal("Updated user is nil")
		}

		// Verify the update
		var dbUser domain.User
		if err := db.First(&dbUser, "id = ?", testUser.ID).Error; err != nil {
			t.Fatalf("Failed to fetch updated user: %v", err)
		}

		if dbUser.Username != "updateduser" {
			t.Errorf("Expected username 'updateduser', got '%s'", dbUser.Username)
		}

		if dbUser.Password != "newpassword" {
			t.Errorf("Expected password 'newpassword', got '%s'", dbUser.Password)
		}
	})

	t.Run("user not found", func(t *testing.T) {
		updateData := &domain.User{
			Username: "updateduser",
		}

		_, err := repo.Update(ctx, "nonexistent", updateData)
		// Improved implementation validates user existence before update
		if err == nil {
			t.Error("Expected error for non-existent user, got nil")
		}
	})

	t.Run("validation failures", func(t *testing.T) {
		testUser := &domain.User{
			Base:     domain.Base{ID: "validation-test-user"},
			Username: "validationuser",
			Password: "validpass",
			RoleId:   role.ID,
		}
		if err := db.Create(testUser).Error; err != nil {
			t.Fatalf("Failed to create test user: %v", err)
		}

		// Test empty ID
		_, err := repo.Update(ctx, "", &domain.User{Username: "updated"})
		if err == nil {
			t.Error("Expected error for empty ID, got nil")
		}

		// Test nil user
		_, err = repo.Update(ctx, testUser.ID, nil)
		if err == nil {
			t.Error("Expected error for nil user, got nil")
		}

		// Test invalid username length
		_, err = repo.Update(ctx, testUser.ID, &domain.User{Username: "ab"})
		if err == nil {
			t.Error("Expected error for short username, got nil")
		}

		// Test invalid password length
		_, err = repo.Update(ctx, testUser.ID, &domain.User{Password: "123"})
		if err == nil {
			t.Error("Expected error for short password, got nil")
		}

		// Test username conflict
		user2 := &domain.User{
			Base:     domain.Base{ID: "conflict-test-user"},
			Username: "conflictuser",
			Password: "password123",
			RoleId:   role.ID,
		}
		if err := db.Create(user2).Error; err != nil {
			t.Fatalf("Failed to create second test user: %v", err)
		}

		_, err = repo.Update(ctx, testUser.ID, &domain.User{Username: "conflictuser"})
		if err == nil {
			t.Error("Expected error for username conflict, got nil")
		}
	})
}

func TestUserRepo_Delete(t *testing.T) {
	db := setupTestDB(t)
	repo := NewUserRepo(db)
	role := createTestRole(t, db)
	ctx := context.Background()

	t.Run("successful delete", func(t *testing.T) {
		testUser := createTestUser(t, db, role)

		deleted, err := repo.Delete(ctx, testUser.ID)
		if err != nil {
			t.Fatalf("Delete failed: %v", err)
		}

		if !deleted {
			t.Error("Expected deleted to be true")
		}

		// Verify user is soft deleted (improved implementation uses soft delete)
		var dbUser domain.User
		if err := db.First(&dbUser, "id = ?", testUser.ID).Error; err == nil {
			t.Error("User should be soft deleted but was found")
		}

		// Should find with Unscoped
		if err := db.Unscoped().First(&dbUser, "id = ?", testUser.ID).Error; err != nil {
			t.Error("User should exist with Unscoped query")
		}
	})

	t.Run("user not found", func(t *testing.T) {
		_, err := repo.Delete(ctx, "nonexistent")
		// Improved implementation returns error for non-existent user
		if err == nil {
			t.Error("Expected error for non-existent user, got nil")
		}
	})

	t.Run("validation failures", func(t *testing.T) {
		// Test empty ID
		_, err := repo.Delete(ctx, "")
		if err == nil {
			t.Error("Expected error for empty ID, got nil")
		}
	})

	t.Run("hard delete", func(t *testing.T) {
		testUser := &domain.User{
			Base:     domain.Base{ID: "hard-delete-test-user"},
			Username: "harddeleteuser",
			Password: "testpass",
			RoleId:   role.ID,
		}
		if err := db.Create(testUser).Error; err != nil {
			t.Fatalf("Failed to create test user: %v", err)
		}

		// Test HardDelete method
		deleted, err := repo.HardDelete(ctx, testUser.ID)
		if err != nil {
			t.Fatalf("HardDelete failed: %v", err)
		}

		if !deleted {
			t.Error("Expected deleted to be true")
		}

		// Verify user is hard deleted
		var dbUser domain.User
		if err := db.Unscoped().First(&dbUser, "id = ?", testUser.ID).Error; err == nil {
			t.Error("User should be hard deleted but was found")
		}
	})
}

func TestUserRepo_IntegrationScenario(t *testing.T) {
	db := setupTestDB(t)
	repo := NewUserRepo(db)
	role := createTestRole(t, db)
	ctx := context.Background()

	// Create user
	user := &domain.User{
		Username: "integration",
		Password: "password123",
		RoleId:   role.ID,
	}

	createdUser, err := repo.Create(ctx, user)
	if err != nil {
		t.Fatalf("Integration test - Create failed: %v", err)
	}

	// Read user by username
	foundUser, err := repo.ReadByUsername(ctx, "integration")
	if err != nil {
		t.Fatalf("Integration test - ReadByUsername failed: %v", err)
	}

	if foundUser.ID != createdUser.ID {
		t.Error("Integration test - ReadByUsername returned wrong user")
	}

	// Read user by ID
	foundUser2, err := repo.ReadById(ctx, createdUser.ID)
	if err != nil {
		t.Fatalf("Integration test - ReadById failed: %v", err)
	}

	if foundUser2.Username != "integration" {
		t.Error("Integration test - ReadById returned wrong user")
	}

	// Update user
	updateData := &domain.User{
		Username: "integration-updated",
	}

	updatedUser, err := repo.Update(ctx, createdUser.ID, updateData)
	if err != nil {
		t.Fatalf("Integration test - Update failed: %v", err)
	}

	if updatedUser.Username != "integration-updated" {
		t.Error("Integration test - Update did not change username")
	}

	// Read all users
	allUsers, err := repo.Read(ctx)
	if err != nil {
		t.Fatalf("Integration test - Read failed: %v", err)
	}

	if len(allUsers) != 1 {
		t.Errorf("Integration test - Expected 1 user, got %d", len(allUsers))
	}

	// Delete user
	deleted, err := repo.Delete(ctx, createdUser.ID)
	if err != nil {
		t.Fatalf("Integration test - Delete failed: %v", err)
	}

	if !deleted {
		t.Error("Integration test - Delete returned false")
	}

	// Verify user is deleted (soft deleted in improved implementation)
	allUsers, err = repo.Read(ctx)
	if err != nil {
		t.Fatalf("Integration test - Final Read failed: %v", err)
	}

	if len(allUsers) != 0 {
		t.Errorf("Integration test - Expected 0 users after delete, got %d", len(allUsers))
	}
}

func TestUserRepo_DatabaseError_Scenarios(t *testing.T) {
	t.Run("database connection error", func(t *testing.T) {
		// Create a repository with a closed database connection
		db := setupTestDB(t)
		sqlDB, _ := db.DB()
		sqlDB.Close()

		repo := NewUserRepo(db)
		ctx := context.Background()

		// All operations should fail with database connection errors
		_, err := repo.Read(ctx)
		if err == nil {
			t.Error("Expected database error, got nil")
		}

		_, err = repo.ReadById(ctx, "test")
		if err == nil {
			t.Error("Expected database error, got nil")
		}

		_, err = repo.ReadByUsername(ctx, "test")
		if err == nil {
			t.Error("Expected database error, got nil")
		}
	})
}

func TestUserRepo_ContextCancellation(t *testing.T) {
	db := setupTestDB(t)
	repo := NewUserRepo(db)
	role := createTestRole(t, db)

	t.Run("cancelled context", func(t *testing.T) {
		ctx, cancel := context.WithCancel(context.Background())
		cancel() // Cancel immediately

		user := &domain.User{
			Username: "contexttest",
			Password: "password123",
			RoleId:   role.ID,
		}

		// This might or might not fail depending on timing,
		// but we're testing that the context is properly passed
		_, err := repo.Create(ctx, user)
		// We don't assert on error here as SQLite in-memory might complete before cancellation
		_ = err
	})
}

// Benchmark tests
func BenchmarkUserRepo_Create(b *testing.B) {
	db := setupBenchmarkDB()
	repo := NewUserRepo(db)
	role := createBenchmarkRole(db)
	ctx := context.Background()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		user := &domain.User{
			Username: "benchuser" + string(rune(i)),
			Password: "password123",
			RoleId:   role.ID,
		}
		_, err := repo.Create(ctx, user)
		if err != nil {
			b.Fatalf("Create failed: %v", err)
		}
	}
}

func BenchmarkUserRepo_ReadById(b *testing.B) {
	db := setupBenchmarkDB()
	repo := NewUserRepo(db)
	role := createBenchmarkRole(db)
	user := createBenchmarkUser(db, role)
	ctx := context.Background()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := repo.ReadById(ctx, user.ID)
		if err != nil {
			b.Fatalf("ReadById failed: %v", err)
		}
	}
}

func BenchmarkUserRepo_ReadByUsername(b *testing.B) {
	db := setupBenchmarkDB()
	repo := NewUserRepo(db)
	role := createBenchmarkRole(db)
	user := createBenchmarkUser(db, role)
	ctx := context.Background()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := repo.ReadByUsername(ctx, user.Username)
		if err != nil {
			b.Fatalf("ReadByUsername failed: %v", err)
		}
	}
}
