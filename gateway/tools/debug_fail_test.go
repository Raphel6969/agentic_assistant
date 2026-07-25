package tools

import (
	"testing"
)

func TestFailureInjectionAndFallbackSubstitution(t *testing.T) {
	reg := NewRegistry()

	// 1. Initial call without failure mode — search_flights should succeed
	resp, err := reg.Invoke("search_flights", "task-normal", map[string]interface{}{
		"origin":      "BOM",
		"destination": "CDG",
	})
	if err != nil {
		t.Fatalf("expected initial success, got %v", err)
	}
	if resp.FallbackUsed {
		t.Errorf("expected FallbackUsed false on normal call")
	}

	// 2. Enable forced failure mode for search_flights
	SetToolFailureMode("search_flights", true)
	defer SetToolFailureMode("search_flights", false) // Reset after test

	// 3. Invoke search_flights — should fail primary API, trigger circuit breaker, and return fallback flight cache!
	respFail, errFail := reg.Invoke("search_flights", "task-forced-fail", map[string]interface{}{
		"origin":      "BOM",
		"destination": "CDG",
	})

	if errFail != nil {
		t.Fatalf("expected fallback response, got error: %v", errFail)
	}

	if !respFail.FallbackUsed {
		t.Errorf("expected FallbackUsed to be true when primary API fails")
	}

	if respFail.Output["source"] != "Fallback Offline Cache (Circuit Breaker Triggered)" {
		t.Errorf("expected output from fallback cache, got %v", respFail.Output)
	}
}
