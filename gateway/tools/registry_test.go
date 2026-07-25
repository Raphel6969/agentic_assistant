package tools

import (
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
