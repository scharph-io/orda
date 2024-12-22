package handler

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/scharph/orda/internal/accesscontrol"
)

// PolicyHandler manages HTTP endpoints for policy management
type PolicyHandler struct {
	PolicySync *accesscontrol.PolicySync
}

// NewPolicyHandler creates a new PolicyHandler
func NewPolicyHandler(ps *accesscontrol.PolicySync) *PolicyHandler {
	return &PolicyHandler{PolicySync: ps}
}

// HandleGetPolicies retrieves current policies
func (ph *PolicyHandler) GetPolicies(c *fiber.Ctx) error {
	// Implement authentication/authorization check here
	return c.JSON(ph.PolicySync.GetPolicies())
}

func (ph *PolicyHandler) GetRolePolicy(c *fiber.Ctx) error {
	role := c.Params("role")
	return c.JSON(ph.PolicySync.GetRolePolicy(role))
}

// HandleUpdatePolicies updates policies
func (ph *PolicyHandler) UpdatePolicies(c *fiber.Ctx) error {
	// Implement admin-only authentication here
	var newPolicies []accesscontrol.Policy
	if err := c.BodyParser(&newPolicies); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid policy data"})
	}

	if err := ph.PolicySync.UpdatePolicies(newPolicies); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update policies"})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{"status": "policies updated"})

}
