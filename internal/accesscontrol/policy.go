package accesscontrol

import (
	"log"
	"sync"

	"github.com/casbin/casbin/v2"
)

var PolicySyncInstance *PolicySync

type PolicySync struct {
	Enforcer *casbin.Enforcer
	mutex    sync.RWMutex
}

type Policy struct {
	Role     string `json:"role"`
	Resource string `json:"resource"`
	Action   string `json:"action"`
	// Effect   string `json:"effect"`
}

// NewPolicySync creates a new policy synchronization manager
func NewPolicySync(enforcer *casbin.Enforcer) *PolicySync {
	return &PolicySync{
		Enforcer: enforcer,
	}
}

// GetPolicies retrieves all current policies
func (ps *PolicySync) GetPolicies() []Policy {
	ps.mutex.RLock()
	defer ps.mutex.RUnlock()

	var policies []Policy
	x, err := ps.Enforcer.GetPolicy()
	if err != nil {
		return policies
	}

	for _, policy := range x {
		if len(policy) >= 3 {
			policies = append(policies, Policy{
				Role:     policy[0],
				Resource: policy[1],
				Action:   policy[2],
				// Effect:   "allow", // Simplified for this example
			})
		}
	}
	return policies
}

func (ps *PolicySync) GetRolePolicy(role string, enforcer *casbin.Enforcer) []Policy {
	ps.mutex.RLock()
	defer ps.mutex.RUnlock()
	var policies []Policy
	x, err := enforcer.GetFilteredPolicy(0, role)
	if err != nil {
		return policies
	}

	for _, policy := range x {
		if len(policy) >= 3 {
			policies = append(policies, Policy{
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
func (ps *PolicySync) UpdatePolicies(newPolicies []Policy) error {
	ps.mutex.Lock()
	defer ps.mutex.Unlock()

	// Remove all existing policies
	ps.Enforcer.DeletePermissionsForUser("*")

	// Add new policies
	for _, policy := range newPolicies {
		_, err := ps.Enforcer.AddPolicy(policy.Role, policy.Resource, policy.Action)
		if err != nil {
			return err
		}
	}

	// Persist policies (optional - depends on your storage mechanism)
	return ps.Enforcer.SavePolicy()
}

func init() {
	e, err := Enforcer()

	if err != nil {
		log.Fatal(err)
	}

	PolicySyncInstance = NewPolicySync(e)
}
