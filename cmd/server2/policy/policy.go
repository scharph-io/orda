package policy

import (
	"net/http"
	"sync"

	"github.com/casbin/casbin/v2"
	"github.com/gofiber/fiber/v2"
)

type PolicySync struct {
	enforcer *casbin.Enforcer
	mutex    sync.RWMutex
}

type PolicyDTO struct {
	Role     string `json:"role"`
	Resource string `json:"resource"`
	Action   string `json:"action"`
	// Effect   string `json:"effect"`
}

// NewPolicySync creates a new policy synchronization manager
func NewPolicySync(enforcer *casbin.Enforcer) *PolicySync {
	return &PolicySync{
		enforcer: enforcer,
	}
}

// GetPolicies retrieves all current policies
func (ps *PolicySync) GetPolicies() []PolicyDTO {
	ps.mutex.RLock()
	defer ps.mutex.RUnlock()

	var policies []PolicyDTO
	x, err := ps.enforcer.GetPolicy()
	if err != nil {
		return policies
	}

	for _, policy := range x {
		if len(policy) >= 3 {
			policies = append(policies, PolicyDTO{
				Role:     policy[0],
				Resource: policy[1],
				Action:   policy[2],
				// Effect:   "allow", // Simplified for this example
			})
		}
	}
	return policies
}

func (ps *PolicySync) GetRolePolicy(role string, enforcer *casbin.Enforcer) []PolicyDTO {
	ps.mutex.RLock()
	defer ps.mutex.RUnlock()
	var policies []PolicyDTO
	x, err := enforcer.GetFilteredPolicy(0, role)
	if err != nil {
		return policies
	}

	for _, policy := range x {
		if len(policy) >= 3 {
			policies = append(policies, PolicyDTO{
				Role:     policy[0],
				Resource: policy[1],
				Action:   policy[2],
				// Effect:   "allow", // Simplified for this example
			})
		}
	}
	return policies
}

// UpdatePolicies replaces existing policies
func (ps *PolicySync) UpdatePolicies(newPolicies []PolicyDTO) error {
	ps.mutex.Lock()
	defer ps.mutex.Unlock()

	// Remove all existing policies
	ps.enforcer.DeletePermissionsForUser("*")

	// Add new policies
	for _, policy := range newPolicies {
		_, err := ps.enforcer.AddPolicy(policy.Role, policy.Resource, policy.Action)
		if err != nil {
			return err
		}
	}

	// Persist policies (optional - depends on your storage mechanism)
	return ps.enforcer.SavePolicy()
}

// PolicyHandler manages HTTP endpoints for policy management
type PolicyHandler struct {
	PolicySync *PolicySync
}

// HandleGetPolicies retrieves current policies
func (ph *PolicyHandler) HandleGetPolicies(c *fiber.Ctx) error {
	// Implement authentication/authorization check here
	return c.JSON(ph.PolicySync.GetPolicies())
}

func (ph *PolicyHandler) HandleGetRolePolicy(c *fiber.Ctx) error {
	role := c.Params("role")
	return c.JSON(ph.PolicySync.GetRolePolicy(role, ph.PolicySync.enforcer))
}

// HandleUpdatePolicies updates policies
func (ph *PolicyHandler) HandleUpdatePolicies(c *fiber.Ctx) error {
	// Implement admin-only authentication here
	var newPolicies []PolicyDTO
	if err := c.BodyParser(&newPolicies); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid policy data"})
	}

	if err := ph.PolicySync.UpdatePolicies(newPolicies); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update policies"})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{"status": "policies updated"})

}
