package accesscontrol

import (
	"fmt"
	"log"
	"sync"

	"github.com/casbin/casbin/v2"
	"github.com/joho/godotenv"
)

var PolicySyncInstance *PolicySync

var (
	obj           = []string{"assortment", "roles", "accounts"}
	act           = []string{"read", "write"}
	admin         = "admin"
	defaultPolicy = []Policy{
		{Role: admin, Resource: obj[0], Action: act[0]},
		{Role: admin, Resource: obj[0], Action: act[1]},
	}
)

type PolicySync struct {
	enforcer *casbin.Enforcer
	mutex    sync.RWMutex
}

func (ps *PolicySync) GetSubjects() ([]string, error) {
	ps.mutex.RLock()
	defer ps.mutex.RUnlock()

	return ps.enforcer.GetAllSubjects()
}

type Policy struct {
	Role     string `json:"role"`
	Resource string `json:"resource"`
	Action   string `json:"action"`
}

func newPolicySync(e *casbin.Enforcer) *PolicySync {
	return &PolicySync{
		enforcer: e,
	}
}

// GetPolicies retrieves all current policies
func (ps *PolicySync) GetPolicies() []Policy {
	ps.mutex.RLock()
	defer ps.mutex.RUnlock()

	var policies []Policy = make([]Policy, 0)
	p, err := ps.enforcer.GetPolicy()
	if err != nil {
		return policies
	}

	for _, policy := range p {
		if len(policy) >= 3 {
			policies = append(policies, Policy{
				Role:     policy[0],
				Resource: policy[1],
				Action:   policy[2],
			})
		}
	}
	return policies
}

func (ps *PolicySync) GetRolePolicy(role string) []Policy {
	ps.mutex.RLock()
	defer ps.mutex.RUnlock()
	var policies []Policy
	x, err := ps.enforcer.GetFilteredPolicy(0, role)
	if err != nil {
		return policies
	}

	for _, policy := range x {
		if len(policy) >= 3 {
			policies = append(policies, Policy{
				Role:     policy[0],
				Resource: policy[1],
				Action:   policy[2],
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

func init() {
	if err := godotenv.Load(".env"); err != nil {
		fmt.Println("INFO: No .env file found")
	}
	e, err := enforcer()
	if err != nil {
		log.Fatal(err)
	}

	PolicySyncInstance = newPolicySync(e)
}
