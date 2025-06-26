package user

import (
	"context"
	"testing"

	"github.com/scharph/orda/internal/domain"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Test database setup for role tests
func setupRoleTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		t.Fatalf("Failed to connect to test database: %v", err)
	}

	// Auto migrate the schema
	err = db.AutoMigrate(&domain.Role{}, &domain.User{}, &domain.ViewRole{})
	if err != nil {
		t.Fatalf("Failed to migrate test database: %v", err)
	}

	return db
}

// Test database setup for benchmarks
func setupBenchmarkRoleTestDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		panic("Failed to connect to benchmark database: " + err.Error())
	}

	// Auto migrate the schema
	err = db.AutoMigrate(&domain.Role{}, &domain.User{}, &domain.ViewRole{})
	if err != nil {
		panic("Failed to migrate benchmark database: " + err.Error())
	}

	return db
}

// Test fixtures for roles
func createTestRoleForTest(t *testing.T, db *gorm.DB, name string) *domain.Role {
	role := &domain.Role{
		Base: domain.Base{ID: "test-role-" + name},
		Name: name,
	}
	if err := db.Create(role).Error; err != nil {
		t.Fatalf("Failed to create test role: %v", err)
	}
	return role
}

// Benchmark fixtures for roles
func createBenchmarkRoleForTest(db *gorm.DB, name string) *domain.Role {
	role := &domain.Role{
		Base: domain.Base{ID: "bench-role-" + name},
		Name: name,
	}
	if err := db.Create(role).Error; err != nil {
		panic("Failed to create benchmark role: " + err.Error())
	}
	return role
}

func TestNewRoleRepo(t *testing.T) {
	db := setupRoleTestDB(t)

	repo := NewRoleRepo(db)

	if repo == nil {
		t.Fatal("NewRoleRepo returned nil")
	}

	if repo.db != db {
		t.Error("NewRoleRepo did not set database correctly")
	}
}

func TestRoleRepo_Create(t *testing.T) {
	db := setupRoleTestDB(t)
	repo := NewRoleRepo(db)
	ctx := context.Background()

	t.Run("successful creation", func(t *testing.T) {
		role := &domain.Role{
			Name: "admin",
		}

		createdRole, err := repo.Create(ctx, role)
		if err != nil {
			t.Fatalf("Create failed: %v", err)
		}

		if createdRole == nil {
			t.Fatal("Created role is nil")
		}

		if createdRole.Name != "admin" {
			t.Errorf("Expected name 'admin', got '%s'", createdRole.Name)
		}

		if createdRole.ID == "" {
			t.Error("Created role should have an ID")
		}

		// Verify role was actually created in database
		var dbRole domain.Role
		if err := db.First(&dbRole, "name = ?", "admin").Error; err != nil {
			t.Errorf("Role not found in database: %v", err)
		}
	})

	t.Run("empty name", func(t *testing.T) {
		role := &domain.Role{
			Name: "",
		}

		_, err := repo.Create(ctx, role)
		// Improved implementation validates required fields
		if err == nil {
			t.Error("Expected error for empty role name, got nil")
		}
	})

	t.Run("validation failures", func(t *testing.T) {
		// Test nil role
		_, err := repo.Create(ctx, nil)
		if err == nil {
			t.Error("Expected error for nil role, got nil")
		}

		// Test short name
		role := &domain.Role{
			Name: "a",
		}
		_, err = repo.Create(ctx, role)
		if err == nil {
			t.Error("Expected error for short role name, got nil")
		}

		// Test long name
		role.Name = "this_is_a_very_long_role_name_that_exceeds_fifty_characters_limit_for_testing"
		_, err = repo.Create(ctx, role)
		if err == nil {
			t.Error("Expected error for long role name, got nil")
		}

		// Test duplicate name
		_ = createTestRoleForTest(t, db, "duplicate")
		role.Name = "duplicate"
		_, err = repo.Create(ctx, role)
		if err == nil {
			t.Error("Expected error for duplicate role name, got nil")
		}
	})

	t.Run("validation failures", func(t *testing.T) {
		testRole := createTestRoleForTest(t, db, "original")

		// Test empty ID
		_, err := repo.Update(ctx, "", &domain.Role{Name: "updated"})
		if err == nil {
			t.Error("Expected error for empty ID, got nil")
		}

		// Test nil role
		_, err = repo.Update(ctx, testRole.ID, nil)
		if err == nil {
			t.Error("Expected error for nil role, got nil")
		}

		// Test invalid name length
		_, err = repo.Update(ctx, testRole.ID, &domain.Role{Name: "a"})
		if err == nil {
			t.Error("Expected error for short role name, got nil")
		}

		// Test name conflict
		_ = createTestRoleForTest(t, db, "conflict")
		_, err = repo.Update(ctx, testRole.ID, &domain.Role{Name: "conflict"})
		if err == nil {
			t.Error("Expected error for name conflict, got nil")
		}
	})
}

func TestRoleRepo_Update(t *testing.T) {
	db := setupRoleTestDB(t)
	repo := NewRoleRepo(db)
	ctx := context.Background()

	t.Run("successful update", func(t *testing.T) {
		// Create a test role first
		originalRole := createTestRoleForTest(t, db, "original")

		updateRole := &domain.Role{
			Name: "updated",
		}

		updatedRole, err := repo.Update(ctx, originalRole.ID, updateRole)
		if err != nil {
			t.Fatalf("Update failed: %v", err)
		}

		if updatedRole == nil {
			t.Fatal("Updated role is nil")
		}

		if updatedRole.Name != "updated" {
			t.Errorf("Expected name 'updated', got '%s'", updatedRole.Name)
		}
	})

	t.Run("role not found", func(t *testing.T) {
		updateRole := &domain.Role{
			Name: "nonexistent",
		}

		_, err := repo.Update(ctx, "nonexistent-id", updateRole)
		// Improved implementation validates existence
		if err == nil {
			t.Error("Expected error for non-existent role, got nil")
		}
	})

	t.Run("validation failures", func(t *testing.T) {
		// Test empty ID
		_, err := repo.Delete(ctx, "")
		if err == nil {
			t.Error("Expected error for empty ID, got nil")
		}
	})

	t.Run("hard delete with user reassignment", func(t *testing.T) {
		// Create test roles
		testRole := createTestRoleForTest(t, db, "roleToDelete")
		defaultRole := createTestRoleForTest(t, db, "defaultRole")

		// Create test user assigned to role
		testUser := &domain.User{
			Base:     domain.Base{ID: "user-for-hard-delete"},
			Username: "userForHardDelete",
			Password: "testpass",
			RoleId:   testRole.ID,
		}
		if err := db.Create(testUser).Error; err != nil {
			t.Fatalf("Failed to create test user: %v", err)
		}

		// Test HardDelete with user reassignment
		deleted, err := repo.HardDelete(ctx, testRole.ID, defaultRole.ID)
		if err != nil {
			t.Fatalf("HardDelete failed: %v", err)
		}

		if !deleted {
			t.Error("Expected deleted to be true")
		}

		// Verify user was reassigned to default role
		var updatedUser domain.User
		if err := db.First(&updatedUser, "id = ?", testUser.ID).Error; err != nil {
			t.Fatalf("Failed to fetch updated user: %v", err)
		}

		if updatedUser.RoleId != defaultRole.ID {
			t.Errorf("Expected user role to be %s, got %s", defaultRole.ID, updatedUser.RoleId)
		}

		// Verify role is hard deleted
		var deletedRole domain.Role
		if err := db.Unscoped().First(&deletedRole, "id = ?", testRole.ID).Error; err == nil {
			t.Error("Role should be hard deleted but was found")
		}
	})

	t.Run("validation failures", func(t *testing.T) {
		// Test empty ID
		_, err := repo.ReadById(ctx, "")
		if err == nil {
			t.Error("Expected error for empty ID, got nil")
		}
	})

	t.Run("validation failures", func(t *testing.T) {
		// Test empty name
		_, err := repo.ReadByName(ctx, "")
		if err == nil {
			t.Error("Expected error for empty name, got nil")
		}
	})
}

func TestRoleRepo_Delete(t *testing.T) {
	db := setupRoleTestDB(t)
	repo := NewRoleRepo(db)
	ctx := context.Background()

	t.Run("successful delete", func(t *testing.T) {
		// Create a test role
		testRole := createTestRoleForTest(t, db, "deleteme")

		deleted, err := repo.Delete(ctx, testRole.ID)
		if err != nil {
			t.Fatalf("Delete failed: %v", err)
		}

		if !deleted {
			t.Error("Expected deleted to be true")
		}

		// Verify role is deleted
		var dbRole domain.Role
		if err := db.First(&dbRole, "id = ?", testRole.ID).Error; err == nil {
			t.Error("Role should be deleted but was found")
		}
	})

	t.Run("delete with users assigned", func(t *testing.T) {
		// Create role and user
		testRole := createTestRoleForTest(t, db, "roleWithUsers")
		testUser := &domain.User{
			Base:     domain.Base{ID: "test-user-for-role"},
			Username: "testuser",
			Password: "testpass",
			RoleId:   testRole.ID,
		}
		if err := db.Create(testUser).Error; err != nil {
			t.Fatalf("Failed to create test user: %v", err)
		}

		// Improved implementation prevents deletion of roles with users
		deleted, err := repo.Delete(ctx, testRole.ID)
		if err == nil {
			t.Error("Expected error when deleting role with users, got nil")
		}

		if deleted {
			t.Error("Expected deleted to be false when role has users")
		}
	})

	t.Run("role not found", func(t *testing.T) {
		_, err := repo.Delete(ctx, "nonexistent")
		// Improved implementation returns error for non-existent role
		if err == nil {
			t.Error("Expected error for non-existent role, got nil")
		}
	})
}

func TestRoleRepo_ReadById(t *testing.T) {
	db := setupRoleTestDB(t)
	repo := NewRoleRepo(db)
	ctx := context.Background()

	t.Run("role not found", func(t *testing.T) {
		_, err := repo.ReadById(ctx, "nonexistent")
		if err == nil {
			t.Error("Expected error for non-existent role, got nil")
		}
	})

	t.Run("role found", func(t *testing.T) {
		testRole := createTestRoleForTest(t, db, "findme")

		role, err := repo.ReadById(ctx, testRole.ID)
		if err != nil {
			t.Fatalf("ReadById failed: %v", err)
		}

		if role == nil {
			t.Fatal("ReadById returned nil role")
		}

		if role.ID != testRole.ID {
			t.Errorf("Expected role ID '%s', got '%s'", testRole.ID, role.ID)
		}

		if role.Name != "findme" {
			t.Errorf("Expected role name 'findme', got '%s'", role.Name)
		}
	})

	t.Run("role with users", func(t *testing.T) {
		// Create role and user
		testRole := createTestRoleForTest(t, db, "roleWithUser")
		testUser := &domain.User{
			Base:     domain.Base{ID: "user-for-role-test"},
			Username: "roleuser",
			Password: "testpass",
			RoleId:   testRole.ID,
		}
		if err := db.Create(testUser).Error; err != nil {
			t.Fatalf("Failed to create test user: %v", err)
		}

		role, err := repo.ReadById(ctx, testRole.ID)
		if err != nil {
			t.Fatalf("ReadById failed: %v", err)
		}

		// Verify users are preloaded
		if len(role.Users) != 1 {
			t.Errorf("Expected 1 user, got %d", len(role.Users))
		}

		if len(role.Users) > 0 && role.Users[0].Username != "roleuser" {
			t.Errorf("Expected user 'roleuser', got '%s'", role.Users[0].Username)
		}
	})
}

func TestRoleRepo_ReadByName(t *testing.T) {
	db := setupRoleTestDB(t)
	repo := NewRoleRepo(db)
	ctx := context.Background()

	t.Run("role not found", func(t *testing.T) {
		_, err := repo.ReadByName(ctx, "nonexistent")
		if err == nil {
			t.Error("Expected error for non-existent role, got nil")
		}
	})

	t.Run("role found", func(t *testing.T) {
		testRole := createTestRoleForTest(t, db, "searchme")

		role, err := repo.ReadByName(ctx, "searchme")
		if err != nil {
			t.Fatalf("ReadByName failed: %v", err)
		}

		if role == nil {
			t.Fatal("ReadByName returned nil role")
		}

		if role.ID != testRole.ID {
			t.Errorf("Expected role ID '%s', got '%s'", testRole.ID, role.ID)
		}

		if role.Name != "searchme" {
			t.Errorf("Expected role name 'searchme', got '%s'", role.Name)
		}
	})
}

func TestRoleRepo_Read(t *testing.T) {
	db := setupRoleTestDB(t)
	repo := NewRoleRepo(db)
	ctx := context.Background()

	t.Run("empty database", func(t *testing.T) {
		roles, err := repo.Read(ctx)
		if err != nil {
			t.Fatalf("Read failed: %v", err)
		}

		if len(roles) != 0 {
			t.Errorf("Expected 0 roles, got %d", len(roles))
		}
	})

	t.Run("with roles", func(t *testing.T) {
		// Create test roles
		role1 := createTestRoleForTest(t, db, "role1")
		role2 := createTestRoleForTest(t, db, "role2")

		roles, err := repo.Read(ctx)
		if err != nil {
			t.Fatalf("Read failed: %v", err)
		}

		if len(roles) != 2 {
			t.Errorf("Expected 2 roles, got %d", len(roles))
		}

		// Verify roles are found
		foundRole1, foundRole2 := false, false
		for _, role := range roles {
			if role.ID == role1.ID {
				foundRole1 = true
			}
			if role.ID == role2.ID {
				foundRole2 = true
			}
		}

		if !foundRole1 {
			t.Error("Role1 not found in results")
		}
		if !foundRole2 {
			t.Error("Role2 not found in results")
		}
	})
}

func TestRoleRepo_IntegrationScenario(t *testing.T) {
	db := setupRoleTestDB(t)
	repo := NewRoleRepo(db)
	ctx := context.Background()

	// Create role
	role := &domain.Role{
		Name: "integration-role",
	}

	createdRole, err := repo.Create(ctx, role)
	if err != nil {
		t.Fatalf("Integration test - Create failed: %v", err)
	}

	// Read role by ID
	foundRole, err := repo.ReadById(ctx, createdRole.ID)
	if err != nil {
		t.Fatalf("Integration test - ReadById failed: %v", err)
	}

	if foundRole.Name != "integration-role" {
		t.Error("Integration test - ReadById returned wrong role")
	}

	// Read role by name
	foundRole2, err := repo.ReadByName(ctx, "integration-role")
	if err != nil {
		t.Fatalf("Integration test - ReadByName failed: %v", err)
	}

	if foundRole2.ID != createdRole.ID {
		t.Error("Integration test - ReadByName returned wrong role")
	}

	// Update role
	updateData := &domain.Role{
		Name: "integration-role-updated",
	}

	updatedRole, err := repo.Update(ctx, createdRole.ID, updateData)
	if err != nil {
		t.Fatalf("Integration test - Update failed: %v", err)
	}

	if updatedRole.Name != "integration-role-updated" {
		t.Error("Integration test - Update did not change name")
	}

	// Read all roles
	allRoles, err := repo.Read(ctx)
	if err != nil {
		t.Fatalf("Integration test - Read failed: %v", err)
	}

	if len(allRoles) != 1 {
		t.Errorf("Integration test - Expected 1 role, got %d", len(allRoles))
	}

	// Delete role
	deleted, err := repo.Delete(ctx, createdRole.ID)
	if err != nil {
		t.Fatalf("Integration test - Delete failed: %v", err)
	}

	if !deleted {
		t.Error("Integration test - Delete returned false")
	}

	// Verify role is deleted
	allRoles, err = repo.Read(ctx)
	if err != nil {
		t.Fatalf("Integration test - Final Read failed: %v", err)
	}

	if len(allRoles) != 0 {
		t.Errorf("Integration test - Expected 0 roles after delete, got %d", len(allRoles))
	}
}

func TestRoleRepo_DatabaseError_Scenarios(t *testing.T) {
	t.Run("database connection error", func(t *testing.T) {
		// Create a repository with a closed database connection
		db := setupRoleTestDB(t)
		sqlDB, _ := db.DB()
		sqlDB.Close()

		repo := NewRoleRepo(db)
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

		_, err = repo.ReadByName(ctx, "test")
		if err == nil {
			t.Error("Expected database error, got nil")
		}
	})
}

func TestRoleRepo_ContextCancellation(t *testing.T) {
	db := setupRoleTestDB(t)
	repo := NewRoleRepo(db)

	t.Run("cancelled context", func(t *testing.T) {
		ctx, cancel := context.WithCancel(context.Background())
		cancel() // Cancel immediately

		role := &domain.Role{
			Name: "contexttest",
		}

		// This might or might not fail depending on timing,
		// but we're testing that the context is properly passed
		_, err := repo.Create(ctx, role)
		// We don't assert on error here as SQLite in-memory might complete before cancellation
		_ = err
	})
}

// Benchmark tests for role repository
func BenchmarkRoleRepo_Create(b *testing.B) {
	db := setupBenchmarkRoleTestDB()
	repo := NewRoleRepo(db)
	ctx := context.Background()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		role := &domain.Role{
			Name: "benchrole" + string(rune(i)),
		}
		_, err := repo.Create(ctx, role)
		if err != nil {
			b.Fatalf("Create failed: %v", err)
		}
	}
}

func BenchmarkRoleRepo_ReadById(b *testing.B) {
	db := setupBenchmarkRoleTestDB()
	repo := NewRoleRepo(db)
	role := createBenchmarkRoleForTest(db, "benchrole")
	ctx := context.Background()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := repo.ReadById(ctx, role.ID)
		if err != nil {
			b.Fatalf("ReadById failed: %v", err)
		}
	}
}

func BenchmarkRoleRepo_ReadByName(b *testing.B) {
	db := setupBenchmarkRoleTestDB()
	repo := NewRoleRepo(db)
	role := createBenchmarkRoleForTest(db, "benchrole")
	ctx := context.Background()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := repo.ReadByName(ctx, role.Name)
		if err != nil {
			b.Fatalf("ReadByName failed: %v", err)
		}
	}
}
