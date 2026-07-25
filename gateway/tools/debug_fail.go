package tools

import (
	"sync"
)

var (
	failureMu      sync.RWMutex
	forcedFailures = make(map[string]bool)
)

func SetToolFailureMode(toolName string, shouldFail bool) {
	failureMu.Lock()
	defer failureMu.Unlock()
	forcedFailures[toolName] = shouldFail
}

func IsToolForcedToFail(toolName string) bool {
	failureMu.RLock()
	defer failureMu.RUnlock()
	return forcedFailures[toolName]
}

func RegisterFailureInjectionTools(r *Registry) {
	// Register fallback tool for live demo recovery
	r.Register(ToolDefinition{
		Name:        "fallback_flight_cache",
		Description: "Fallback cached flight inventory tool when primary API trips circuit breaker.",
		InputSchema: map[string]interface{}{"type": "object"},
		OutputSchema: map[string]interface{}{"type": "object"},
		CostEstimate: 0.0,
		RiskTier:     RiskReadOnly,
	}, handleFallbackFlightCache)

	// Associate fallback with search_flights
	r.RegisterFallback("search_flights", "fallback_flight_cache")
}

func handleFallbackFlightCache(taskID string, input map[string]interface{}) (map[string]interface{}, error) {
	return map[string]interface{}{
		"source":        "Fallback Offline Cache (Circuit Breaker Triggered)",
		"note":          "Primary flight search service was unreachable after 3 retries. Using verified offline inventory snapshot.",
		"fallback_used": true,
		"flights": []map[string]interface{}{
			{
				"id":             "FL-FB-99",
				"airline":        "Air France (Cached)",
				"flight_number":  "AF224-C",
				"origin":         "BOM",
				"destination":    "CDG",
				"departure_time": "08:30 AM",
				"price":          475.00,
				"currency":       "USD",
				"direct":         true,
			},
		},
	}, nil
}
