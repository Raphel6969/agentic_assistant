package tools

import (
	"fmt"
	"strings"
)

func RegisterFlightsTool(r *Registry) {
	def := ToolDefinition{
		Name:        "search_flights",
		Description: "Search available flights between origin and destination for specified dates.",
		InputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"origin":      map[string]interface{}{"type": "string", "description": "Origin IATA code or city name, e.g. BOM, NYC, PAR"},
				"destination": map[string]interface{}{"type": "string", "description": "Destination IATA code or city name, e.g. CDG, LON, DEL"},
				"date":        map[string]interface{}{"type": "string", "description": "Travel date YYYY-MM-DD"},
				"max_price":   map[string]interface{}{"type": "number", "description": "Maximum budget for flight"},
			},
			"required": []string{"origin", "destination"},
		},
		OutputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"flights": map[string]interface{}{"type": "array"},
			},
		},
		CostEstimate: 0.0,
		RiskTier:     RiskReadOnly,
	}

	r.Register(def, handleSearchFlights)
}

func handleSearchFlights(taskID string, input map[string]interface{}) (map[string]interface{}, error) {
	if IsToolForcedToFail("search_flights") {
		return nil, fmt.Errorf("Primary flight search API timed out (503 Service Unavailable)")
	}

	origin, _ := input["origin"].(string)
	dest, _ := input["destination"].(string)

	if origin == "" || dest == "" {
		return nil, fmt.Errorf("origin and destination are required")
	}

	origin = strings.ToUpper(origin)
	dest = strings.ToUpper(dest)

	// Seeded deterministic flight data
	flights := []map[string]interface{}{
		{
			"id":                "FL-101",
			"airline":           "Air France",
			"flight_number":     "AF224",
			"origin":            origin,
			"destination":       dest,
			"departure_time":    "08:30 AM",
			"arrival_time":      "02:15 PM",
			"duration":          "8h 45m",
			"price":             487.00,
			"currency":          "USD",
			"direct":            true,
			"convenience_score": 0.95,
			"flexibility_score": 0.8,
		},
		{
			"id":                "FL-102",
			"airline":           "Lufthansa",
			"flight_number":     "LH755",
			"origin":            origin,
			"destination":       dest,
			"departure_time":    "06:00 AM",
			"arrival_time":      "01:00 PM",
			"duration":          "10h 00m",
			"price":             440.00,
			"currency":          "USD",
			"direct":            false,
			"layover":           "FRA (1h 30m)",
			"convenience_score": 0.70,
			"flexibility_score": 0.6,
		},
		{
			"id":                "FL-103",
			"airline":           "Emirates",
			"flight_number":     "EK501",
			"origin":            origin,
			"destination":       dest,
			"departure_time":    "11:15 PM",
			"arrival_time":      "07:45 AM+1",
			"duration":          "11h 30m",
			"price":             520.00,
			"currency":          "USD",
			"direct":            false,
			"layover":           "DXB (2h 10m)",
			"convenience_score": 0.85,
			"flexibility_score": 0.9,
		},
	}

	return map[string]interface{}{
		"count":   len(flights),
		"flights": flights,
	}, nil
}
