package user

import (
	"testing"

	"github.com/scharph/orda/internal/domain"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// TestHelper provides common testing utilities for user repository tests
type TestHelper struct {
	DB *gorm.DB
	T  *testing.T
}

// NewTestHelper creates a new test helper with an in-memory SQLite database
func NewTestHelper(t *testing.T) *TestHelper {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		t.Fatalf("Failed to connect to test database: %v", err)
	}

	// Auto migrate all schemas
	err = db.AutoMigrate(&domain.Role{}, &domain.User{}, &domain.ViewRole{})
	if err != nil {
		t.Fatalf("Failed to migrate test database: %v", err)
	}

	return &TestHelper{
		DB: db,
		T:  t,
	}
}

// CreateTestRole creates a test role with the given name
func (h *TestHelper) CreateTestRole(name string) *domain.Role {
	return h.CreateTestRoleWithID("test-role-"+name, name)
}

// CreateTestRoleWithID creates a test role with specific ID and name
func (h *TestHelper) CreateTestRoleWithID(id, name string) *domain.Role {
	role := &domain.Role{
		Base: domain.Base{ID: id},
		Name: name,
	}
	if err := h.DB.Create(role).Error; err != nil {
		h.T.Fatalf("Failed to create test role '%s': %v", name, err)
	}
	return role
}

// CreateTestUser creates a test user with the given username and role
func (h *TestHelper) CreateTestUser(username string, role *domain.Role) *domain.User {
	return h.CreateTestUserWithID("test-user-"+username, username, role)
}

// CreateTestUserWithID creates a test user with specific ID, username and role
func (h *TestHelper) CreateTestUserWithID(id, username string, role *domain.Role) *domain.User {
	user := &domain.User{
		Base:     domain.Base{ID: id},
		Username: username,
		Password: "testpass123",
		RoleId:   role.ID,
	}
	if err := h.DB.Create(user).Error; err != nil {
		h.T.Fatalf("Failed to create test user '%s': %v", username, err)
	}
	return user
}

// CreateMultipleTestRoles creates multiple test roles with given names
func (h *TestHelper) CreateMultipleTestRoles(names ...string) []*domain.Role {
	roles := make([]*domain.Role, len(names))
	for i, name := range names {
		roles[i] = h.CreateTestRole(name)
	}
	return roles
}

// CreateMultipleTestUsers creates multiple test users for the given role
func (h *TestHelper) CreateMultipleTestUsers(role *domain.Role, usernames ...string) []*domain.User {
	users := make([]*domain.User, len(usernames))
	for i, username := range usernames {
		users[i] = h.CreateTestUser(username, role)
	}
	return users
}

// AssertUserEquals compares two users for equality in tests
func (h *TestHelper) AssertUserEquals(expected, actual domain.User, message string) {
	if expected.ID != actual.ID {
		h.T.Errorf("%s: ID mismatch - expected '%s', got '%s'", message, expected.ID, actual.ID)
	}
	if expected.Username != actual.Username {
		h.T.Errorf("%s: Username mismatch - expected '%s', got '%s'", message, expected.Username, actual.Username)
	}
	if expected.RoleId != actual.RoleId {
		h.T.Errorf("%s: RoleId mismatch - expected '%s', got '%s'", message, expected.RoleId, actual.RoleId)
	}
}

// AssertRoleEquals compares two roles for equality in tests
func (h *TestHelper) AssertRoleEquals(expected, actual domain.Role, message string) {
	if expected.ID != actual.ID {
		h.T.Errorf("%s: ID mismatch - expected '%s', got '%s'", message, expected.ID, actual.ID)
	}
	if expected.Name != actual.Name {
		h.T.Errorf("%s: Name mismatch - expected '%s', got '%s'", message, expected.Name, actual.Name)
	}
}

// AssertUserExistsInDB verifies a user exists in the database
func (h *TestHelper) AssertUserExistsInDB(userID string) {
	var user domain.User
	if err := h.DB.First(&user, "id = ?", userID).Error; err != nil {
		h.T.Errorf("User with ID '%s' should exist in database but was not found: %v", userID, err)
	}
}

// AssertUserNotExistsInDB verifies a user doesn't exist in the database (soft delete)
func (h *TestHelper) AssertUserNotExistsInDB(userID string) {
	var user domain.User
	if err := h.DB.First(&user, "id = ?", userID).Error; err == nil {
		h.T.Errorf("User with ID '%s' should not exist in database but was found", userID)
	}
}

// AssertRoleExistsInDB verifies a role exists in the database
func (h *TestHelper) AssertRoleExistsInDB(roleID string) {
	var role domain.Role
	if err := h.DB.First(&role, "id = ?", roleID).Error; err != nil {
		h.T.Errorf("Role with ID '%s' should exist in database but was not found: %v", roleID, err)
	}
}

// AssertRoleNotExistsInDB verifies a role doesn't exist in the database
func (h *TestHelper) AssertRoleNotExistsInDB(roleID string) {
	var role domain.Role
	if err := h.DB.First(&role, "id = ?", roleID).Error; err == nil {
		h.T.Errorf("Role with ID '%s' should not exist in database but was found", roleID)
	}
}

// CountUsers returns the number of users in the database
func (h *TestHelper) CountUsers() int64 {
	var count int64
	h.DB.Model(&domain.User{}).Count(&count)
	return count
}

// CountRoles returns the number of roles in the database
func (h *TestHelper) CountRoles() int64 {
	var count int64
	h.DB.Model(&domain.Role{}).Count(&count)
	return count
}

// CountUsersForRole returns the number of users assigned to a specific role
func (h *TestHelper) CountUsersForRole(roleID string) int64 {
	var count int64
	h.DB.Model(&domain.User{}).Where("role_id = ?", roleID).Count(&count)
	return count
}

// CleanupDatabase removes all test data from the database
func (h *TestHelper) CleanupDatabase() {
	// Delete in order to respect foreign key constraints
	h.DB.Unscoped().Delete(&domain.User{}, "1 = 1")
	h.DB.Unscoped().Delete(&domain.Role{}, "1 = 1")
	h.DB.Unscoped().Delete(&domain.ViewRole{}, "1 = 1")
}

// Cleanup closes the database connection
func (h *TestHelper) Cleanup() {
	sqlDB, err := h.DB.DB()
	if err == nil {
		sqlDB.Close()
	}
}

// SeedDefaultData creates default test data for complex scenarios
func (h *TestHelper) SeedDefaultData() (*domain.Role, *domain.Role, *domain.User, *domain.User) {
	adminRole := h.CreateTestRole("admin")
	userRole := h.CreateTestRole("user")

	adminUser := h.CreateTestUser("admin", adminRole)
	regularUser := h.CreateTestUser("regularuser", userRole)

	return adminRole, userRole, adminUser, regularUser
}

// CreateUserWithoutRole creates a user struct without persisting it to database
func (h *TestHelper) CreateUserWithoutRole(username, password string) *domain.User {
	return &domain.User{
		Username: username,
		Password: password,
	}
}

// CreateRoleWithoutPersisting creates a role struct without persisting it to database
func (h *TestHelper) CreateRoleWithoutPersisting(name string) *domain.Role {
	return &domain.Role{
		Name: name,
	}
}

// GetUserByUsername retrieves a user by username for verification
func (h *TestHelper) GetUserByUsername(username string) (*domain.User, error) {
	var user domain.User
	err := h.DB.Where("username = ?", username).Preload("Role").First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// GetRoleByName retrieves a role by name for verification
func (h *TestHelper) GetRoleByName(name string) (*domain.Role, error) {
	var role domain.Role
	err := h.DB.Where("name = ?", name).Preload("Users").First(&role).Error
	if err != nil {
		return nil, err
	}
	return &role, nil
}

// EnableVerboseLogging enables verbose database logging for debugging
func (h *TestHelper) EnableVerboseLogging() {
	h.DB.Logger = logger.Default.LogMode(logger.Info)
}

// DisableLogging disables database logging
func (h *TestHelper) DisableLogging() {
	h.DB.Logger = logger.Default.LogMode(logger.Silent)
}
