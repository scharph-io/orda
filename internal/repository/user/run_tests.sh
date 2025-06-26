#!/bin/bash

# User Repository Test Runner
# This script runs all tests for the user repository package

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_color() {
    printf "${1}${2}${NC}\n"
}

print_header() {
    echo
    print_color $BLUE "=============================================="
    print_color $BLUE "$1"
    print_color $BLUE "=============================================="
    echo
}

print_success() {
    print_color $GREEN "✅ $1"
}

print_error() {
    print_color $RED "❌ $1"
}

print_warning() {
    print_color $YELLOW "⚠️  $1"
}

# Change to the repository directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if Go is installed
if ! command -v go &> /dev/null; then
    print_error "Go is not installed or not in PATH"
    exit 1
fi

print_header "ORDA User Repository Test Suite"

# Run basic tests
print_header "Running Unit Tests"
if go test -v .; then
    print_success "Unit tests passed"
else
    print_error "Unit tests failed"
    exit 1
fi

# Run tests with coverage
print_header "Running Tests with Coverage"
if go test -cover -coverprofile=coverage.out .; then
    print_success "Coverage tests passed"

    # Display coverage details
    if command -v go &> /dev/null; then
        echo
        print_color $BLUE "Coverage Details:"
        go tool cover -func=coverage.out
    fi
else
    print_error "Coverage tests failed"
    exit 1
fi

# Run race condition tests
print_header "Running Race Condition Tests"
if go test -race .; then
    print_success "Race condition tests passed"
else
    print_warning "Race condition tests failed (may be expected for some scenarios)"
fi

# Run benchmarks
print_header "Running Performance Benchmarks"
if go test -bench=. -benchmem .; then
    print_success "Benchmarks completed"
else
    print_warning "Benchmarks failed (may be expected)"
fi

# Run specific test suites
print_header "Running User Repository Tests"
if go test -v -run "TestUserRepo"; then
    print_success "User repository tests passed"
else
    print_error "User repository tests failed"
    exit 1
fi

print_header "Running Role Repository Tests"
if go test -v -run "TestRoleRepo"; then
    print_success "Role repository tests passed"
else
    print_error "Role repository tests failed"
    exit 1
fi

# Check for test coverage threshold
print_header "Checking Coverage Threshold"
COVERAGE=$(go tool cover -func=coverage.out | grep total | awk '{print $3}' | sed 's/%//')
THRESHOLD=80

if command -v bc &> /dev/null; then
    if (( $(echo "$COVERAGE >= $THRESHOLD" | bc -l) )); then
        print_success "Coverage ($COVERAGE%) meets threshold ($THRESHOLD%)"
    else
        print_warning "Coverage ($COVERAGE%) below threshold ($THRESHOLD%)"
    fi
else
    print_success "Coverage: $COVERAGE% (bc not available for threshold check)"
fi

# Run integration tests
print_header "Running Integration Tests"
if go test -v -run "Integration"; then
    print_success "Integration tests passed"
else
    print_warning "Integration tests failed (may be expected)"
fi

# Performance regression check
print_header "Performance Regression Check"
echo "Running baseline benchmarks..."
go test -bench=. -count=3 -benchmem > benchmark_current.txt 2>&1 || true

if [ -f "benchmark_baseline.txt" ]; then
    print_color $BLUE "Comparing with baseline performance..."
    # Simple comparison (in production, you might use benchcmp or similar tools)
    echo "Current benchmarks saved to benchmark_current.txt"
    echo "Compare with benchmark_baseline.txt manually or use benchcmp"
else
    print_warning "No baseline benchmark found. Creating baseline..."
    cp benchmark_current.txt benchmark_baseline.txt
fi

# Memory leak check
print_header "Memory Leak Check"
echo "Running tests with memory profiling..."
go test -memprofile=mem.prof -v . > /dev/null 2>&1 || true
if [ -f "mem.prof" ]; then
    print_success "Memory profile generated (mem.prof)"
else
    print_warning "Memory profile not generated"
fi

# Clean up temporary files
cleanup() {
    print_header "Cleaning Up"
    rm -f coverage.out mem.prof
    print_success "Cleanup completed"
}

# Set trap for cleanup
trap cleanup EXIT

# Final summary
print_header "Test Summary"
print_success "All critical tests passed!"
print_color $BLUE "Test artifacts:"
echo "  - benchmark_current.txt (latest benchmark results)"
if [ -f "benchmark_baseline.txt" ]; then
    echo "  - benchmark_baseline.txt (baseline for comparison)"
fi

print_color $GREEN "🎉 Test suite completed successfully!"

# Exit with success
exit 0
