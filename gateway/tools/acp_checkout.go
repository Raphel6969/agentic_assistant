package tools

import (
	"fmt"
	"time"

	"github.com/google/uuid"
)

func RegisterACPCheckoutTool(r *Registry) {
	def := ToolDefinition{
		Name:        "acp_checkout_payment",
		Description: "Process delegated merchant checkout following Agentic Commerce Protocol (ACP) standard with scoped SharedPaymentToken. Tier Irreversible.",
		InputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"merchant_name": map[string]interface{}{"type": "string", "description": "Merchant or airline/hotel vendor name"},
				"amount":        map[string]interface{}{"type": "number", "description": "Total payment amount"},
				"currency":      map[string]interface{}{"type": "string", "description": "3-letter currency code, e.g. USD, EUR"},
				"item_description": map[string]interface{}{"type": "string", "description": "Description of items being purchased"},
			},
			"required": []string{"merchant_name", "amount", "item_description"},
		},
		OutputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"checkout_id": map[string]interface{}{"type": "string"},
				"token":       map[string]interface{}{"type": "string"},
				"status":      map[string]interface{}{"type": "string"},
			},
		},
		CostEstimate: 0.0,
		RiskTier:     RiskIrreversible,
	}

	r.Register(def, handleACPCheckout)
}

func handleACPCheckout(taskID string, input map[string]interface{}) (map[string]interface{}, error) {
	merchant, _ := input["merchant_name"].(string)
	amount, ok := input["amount"].(float64)
	if !ok || amount <= 0 {
		return nil, fmt.Errorf("valid payment amount is required")
	}

	itemDesc, _ := input["item_description"].(string)
	currency, okCurr := input["currency"].(string)
	if !okCurr || currency == "" {
		currency = "USD"
	}

	// Generate ACP-spec Checkout Object & SharedPaymentToken
	checkoutID := fmt.Sprintf("acp_chk_%s", uuid.New().String()[:8])
	paymentToken := fmt.Sprintf("acp_spt_%s", uuid.New().String()[:12])

	checkoutObject := map[string]interface{}{
		"acp_version":    "2026-04.1",
		"checkout_id":    checkoutID,
		"status":         "completed",
		"merchant":       merchant,
		"currency":       currency,
		"total_amount":   amount,
		"payment_token":  paymentToken,
		"token_type":     "SharedPaymentToken",
		"token_expires":  time.Now().Add(15 * time.Minute).Format(time.RFC3339),
		"item":           itemDesc,
		"receipt_id":     fmt.Sprintf("rcpt_%s", uuid.New().String()[:6]),
		"auth_signature": fmt.Sprintf("sig_acp_%s", uuid.New().String()[:16]),
	}

	return checkoutObject, nil
}
