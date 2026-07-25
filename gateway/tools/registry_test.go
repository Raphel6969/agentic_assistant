package tools

import (
	"errors"
	"testing"
)

func TestRegistryTools(t *testing.T) {
	reg := NewRegistry()
	list := reg.List()

	if len(list) < 3 {
		t.Fatalf("expected at least 3 tools registered, got %d", len(list))
	}

	// Test invoking search_flights
	resp, err := reg.Invoke("search_flights", "test-task-1", map[string]interface{}{
		"origin":      "BOM",
		"destination": "CDG",
	})

	if err != nil {
		t.Fatalf("search_flights failed: %v", err)
	}

	if resp.Tool != "search_flights" {
		t.Errorf("expected tool search_flights, got %s", resp.Tool)
	}

	flights, ok := resp.Output["flights"].([]map[string]interface{})
	if !ok || len(flights) == 0 {
		t.Errorf("expected non-empty flights array")
	}
}

func TestCircuitBreakerAndFallbackSubstitution(t *testing.T) {
	reg := NewRegistry()

	// Register primary tool that always fails
	reg.Register(ToolDefinition{
		Name:         "failing_primary",
		Description:  "Primary tool that fails",
		CostEstimate: 1.0,
		RiskTier:     RiskReadOnly,
	}, func(taskID string, input map[string]interface{}) (map[string]interface{}, error) {
		return nil, errors.New("primary service unavailable")
	})

	// Register fallback tool
	reg.Register(ToolDefinition{
		Name:         "cached_fallback",
		Description:  "Fallback cached tool",
		CostEstimate: 0.5,
		RiskTier:     RiskReadOnly,
	}, func(taskID string, input map[string]interface{}) (map[string]interface{}, error) {
		return map[string]interface{}{
			"source": "fallback_cache",
			"data":   "cached_result",
		}, nil
	})

	// Register fallback association
	reg.RegisterFallback("failing_primary", "cached_fallback")

	// Invoke primary tool — should fail 3 times, trip circuit breaker, and invoke fallback
	resp, err := reg.Invoke("failing_primary", "task-fallback-1", map[string]interface{}{})
	if err != nil {
		t.Fatalf("expected fallback success, got error: %v", err)
	}

	if !resp.FallbackUsed {
		t.Errorf("expected FallbackUsed to be true")
	}

	if resp.Output["source"] != "fallback_cache" {
		t.Errorf("expected output from fallback tool, got %v", resp.Output)
	}
}
