# User Repository Tests

This directory contains comprehensive tests for the user and role repositories in the ORDA project.

## Test Files Overview

- `user_repo_test.go` - Tests for the UserRepo implementation
- `role_repo_test.go` - Tests for the RoleRepo implementation  
- `test_helpers.go` - Common testing utilities and helpers

## Running Tests

### Run All Tests
```bash
# From project root
go test ./internal/repository/user/

# With verbose output
go test -v ./internal/repository/user/

# With coverage
go test -cover ./internal/repository/user/
```

### Run Specific Test Files
```bash
# Only user repository tests
go test -v ./internal/repository/user/ -run "TestUserRepo"

# Only role repository tests
go test -v ./internal/repository/user/ -run "TestRoleRepo"
```

### Run Benchmarks
```bash
# Run all benchmarks
go test -bench=. ./internal/repository/user/

# Run specific benchmarks
go test -bench=BenchmarkUserRepo ./internal/repository/user/
```

## Test Structure

### User Repository Tests (`user_repo_test.go`)

#### Test Categories

1. **Constructor Tests**
   - `TestNewUserRepo` - Verifies proper initialization

2. **CRUD Operation Tests**
   - `TestUserRepo_Create` - User creation with validation
   - `TestUserRepo_Read` - Reading all users
   - `TestUserRepo_ReadByUsername` - Finding users by username
   - `TestUserRepo_ReadById` - Finding users by ID
   - `TestUserRepo_Update` - User updates
   - `TestUserRepo_Delete` - User deletion (soft delete)

3. **Edge Case Tests**
   - Duplicate username handling
   - Invalid role assignments
   - Non-existent user operations

4. **Integration Tests**
   - `TestUserRepo_IntegrationScenario` - Full CRUD lifecycle

5. **Error Handling Tests**
   - Database connection errors
   - Context cancellation

6. **Performance Tests**
   - Benchmarks for Create, ReadById, ReadByUsername

#### Test Scenarios Covered

**Create Operations:**
- ✅ Successful user creation
- ✅ Duplicate username rejection
- ✅ Invalid role ID handling
- ✅ Database constraint validation

**Read Operations:**
- ✅ Reading from empty database
- ✅ Reading all users with role preloading
- ✅ Finding user by username
- ✅ Finding user by ID
- ✅ Handling non-existent users

**Update Operations:**
- ✅ Successful user updates
- ✅ Non-existent user updates
- ✅ Username change validation

**Delete Operations:**
- ✅ Successful soft delete
- ✅ Non-existent user deletion
- ✅ Verification of soft delete behavior

### Role Repository Tests (`role_repo_test.go`)

#### Test Categories

1. **Constructor Tests**
   - `TestNewRoleRepo` - Verifies proper initialization

2. **CRUD Operation Tests**
   - `TestRoleRepo_Create` - Role creation
   - `TestRoleRepo_Read` - Reading all roles
   - `TestRoleRepo_ReadById` - Finding roles by ID
   - `TestRoleRepo_ReadByName` - Finding roles by name
   - `TestRoleRepo_Update` - Role updates
   - `TestRoleRepo_Delete` - Role deletion with cascade handling

3. **Integration Tests**
   - `TestRoleRepo_IntegrationScenario` - Full CRUD lifecycle

4. **Error Handling Tests**
   - Database connection errors
   - Context cancellation

5. **Performance Tests**
   - Benchmarks for Create, ReadById, ReadByName

#### Test Scenarios Covered

**Create Operations:**
- ✅ Successful role creation
- ✅ Empty name handling
- ✅ ID generation verification

**Read Operations:**
- ✅ Reading from empty database
- ✅ Reading all roles
- ✅ Finding role by ID with user preloading
- ✅ Finding role by name
- ✅ Handling non-existent roles

**Update Operations:**
- ✅ Successful role updates
- ✅ Non-existent role updates

**Delete Operations:**
- ✅ Successful role deletion
- ✅ Role deletion with assigned users
- ✅ Non-existent role deletion
- ✅ ViewRole cascade deletion

## Test Helpers (`test_helpers.go`)

The test helpers provide utilities for:

### Database Setup
- `NewTestHelper(t)` - Creates in-memory SQLite database
- `CleanupDatabase()` - Removes all test data
- `Cleanup()` - Closes database connection

### Test Data Creation
- `CreateTestRole(name)` - Creates role with auto-generated ID
- `CreateTestRoleWithID(id, name)` - Creates role with specific ID
- `CreateTestUser(username, role)` - Creates user with auto-generated ID
- `CreateTestUserWithID(id, username, role)` - Creates user with specific ID
- `CreateMultipleTestRoles(names...)` - Bulk role creation
- `CreateMultipleTestUsers(role, usernames...)` - Bulk user creation

### Assertions
- `AssertUserEquals(expected, actual, message)` - Compare users
- `AssertRoleEquals(expected, actual, message)` - Compare roles
- `AssertUserExistsInDB(userID)` - Verify user exists
- `AssertUserNotExistsInDB(userID)` - Verify user deleted
- `AssertRoleExistsInDB(roleID)` - Verify role exists
- `AssertRoleNotExistsInDB(roleID)` - Verify role deleted

### Utilities
- `CountUsers()` - Get total user count
- `CountRoles()` - Get total role count
- `CountUsersForRole(roleID)` - Count users per role
- `SeedDefaultData()` - Create default test dataset
- `EnableVerboseLogging()` - Enable DB query logging
- `DisableLogging()` - Disable DB logging

## Test Database

Tests use an in-memory SQLite database that:
- Is created fresh for each test
- Automatically migrates schemas
- Provides fast test execution
- Requires no external dependencies

## Coverage

The tests provide comprehensive coverage of:

### Functional Coverage
- ✅ All public methods
- ✅ All CRUD operations
- ✅ All error conditions
- ✅ Interface compliance

### Edge Case Coverage
- ✅ Empty/nil inputs
- ✅ Non-existent resources
- ✅ Database constraints
- ✅ Foreign key relationships
- ✅ Concurrent operations (context cancellation)

### Integration Coverage
- ✅ Full CRUD workflows
- ✅ Cross-repository interactions
- ✅ Database transaction behavior
- ✅ Preloading relationships

## Benchmarks

Performance benchmarks measure:
- Repository creation overhead
- Database query performance
- Memory allocation patterns
- Throughput under load

### Running Benchmarks

```bash
# Run all benchmarks with memory stats
go test -bench=. -benchmem ./internal/repository/user/

# Run specific benchmark
go test -bench=BenchmarkUserRepo_Create -benchmem ./internal/repository/user/

# Run benchmarks multiple times for stability
go test -bench=. -count=5 ./internal/repository/user/
```

## Test Data Patterns

### Consistent Naming
- Test roles: `"test-role-{name}"`
- Test users: `"test-user-{username}"`
- ID prefixes help identify test data

### Isolation
- Each test gets fresh database
- No shared state between tests
- Parallel execution safe

### Realistic Data
- Valid usernames and passwords
- Proper foreign key relationships
- Realistic edge cases

## Common Testing Patterns

### Setup Pattern
```go
func TestSomething(t *testing.T) {
    db := setupTestDB(t)
    repo := NewUserRepo(db)
    role := createTestRole(t, db)
    ctx := context.Background()
    
    // Test logic here
}
```

### Subtests Pattern
```go
func TestUserRepo_SomeOperation(t *testing.T) {
    t.Run("success case", func(t *testing.T) {
        // Success scenario
    })
    
    t.Run("error case", func(t *testing.T) {
        // Error scenario
    })
}
```

### Helper Usage Pattern
```go
func TestWithHelpers(t *testing.T) {
    helper := NewTestHelper(t)
    defer helper.Cleanup()
    
    role := helper.CreateTestRole("admin")
    user := helper.CreateTestUser("testuser", role)
    
    // Test operations
    helper.AssertUserExistsInDB(user.ID)
}
```

## Best Practices

### Test Organization
1. One test file per repository
2. Group related tests with subtests
3. Use descriptive test names
4. Include both positive and negative cases

### Test Data
1. Use helpers for consistent data creation
2. Clean up after tests
3. Use realistic but minimal data
4. Test edge cases and boundaries

### Assertions
1. Use helper assertions for consistency
2. Provide meaningful error messages
3. Test both success and failure paths
4. Verify database state changes

### Performance
1. Use in-memory database for speed
2. Keep tests focused and fast
3. Benchmark critical paths
4. Monitor memory usage

## Integration with CI/CD

These tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions configuration
- name: Run Repository Tests
  run: |
    go test -v -cover ./internal/repository/user/
    go test -bench=. -benchmem ./internal/repository/user/
```

## Troubleshooting

### Common Issues

1. **Test Failures Due to Database Setup**
   - Ensure SQLite is available
   - Check GORM version compatibility
   - Verify schema migrations

2. **Race Conditions**
   - Tests use fresh database instances
   - No shared state between tests
   - Context cancellation might be timing-dependent

3. **Performance Issues**
   - In-memory SQLite should be fast
   - Check for resource leaks
   - Monitor memory usage in benchmarks

### Debugging Tips

1. **Enable Verbose Logging**
   ```go
   helper.EnableVerboseLogging()
   ```

2. **Check Database State**
   ```go
   fmt.Printf("User count: %d\n", helper.CountUsers())
   ```

3. **Use Test Helpers**
   ```go
   helper.AssertUserExistsInDB(userID)
   ```

## Future Improvements

1. **Additional Test Cases**
   - Concurrent access patterns
   - Large dataset performance
   - Memory usage optimization

2. **Enhanced Helpers**
   - Factory pattern for test data
   - Custom matchers
   - Snapshot testing

3. **Integration Tests**
   - Real database testing
   - Cross-service interactions
   - End-to-end scenarios

4. **Property-Based Testing**
   - Generated test cases
   - Invariant checking
   - Fuzz testing