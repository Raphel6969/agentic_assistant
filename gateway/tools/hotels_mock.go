package tools

import (
	"fmt"
	"strings"
)

func RegisterHotelsTool(r *Registry) {
	def := ToolDefinition{
		Name:        "search_hotels",
		Description: "Search available hotels in a city for specified dates.",
		InputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"city":        map[string]interface{}{"type": "string", "description": "City name, e.g. Paris, London, Tokyo"},
				"check_in":    map[string]interface{}{"type": "string", "description": "Check-in date YYYY-MM-DD"},
				"check_out":   map[string]interface{}{"type": "string", "description": "Check-out date YYYY-MM-DD"},
				"max_price":   map[string]interface{}{"type": "number", "description": "Maximum price per night"},
			},
			"required": []string{"city"},
		},
		OutputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"hotels": map[string]interface{}{"type": "array"},
			},
		},
		CostEstimate: 0.0,
		RiskTier:     RiskReadOnly,
	}

	r.Register(def, handleSearchHotels)
}

func handleSearchHotels(taskID string, input map[string]interface{}) (map[string]interface{}, error) {
	city, _ := input["city"].(string)
	if city == "" {
		return nil, fmt.Errorf("city is required")
	}

	city = strings.Title(strings.ToLower(city))

	hotels := []map[string]interface{}{
		{
			"id":                "HT-201",
			"name":              fmt.Sprintf("Grand Hotel %s", city),
			"city":              city,
			"rating":            4.7,
			"price_per_night":   125.00,
			"total_price":       250.00,
			"currency":          "USD",
			"amenities":         []string{"Free WiFi", "Breakfast included", "Central location"},
			"convenience_score": 0.90,
			"flexibility_score": 0.85,
		},
		{
			"id":                "HT-202",
			"name":              fmt.Sprintf("%s Central Boutique Stay", city),
			"city":              city,
			"rating":            4.4,
			"price_per_night":   95.00,
			"total_price":       190.00,
			"currency":          "USD",
			"amenities":         []string{"Free WiFi", "City view"},
			"convenience_score": 0.80,
			"flexibility_score": 0.70,
		},
		{
			"id":                "HT-203",
			"name":              fmt.Sprintf("Budget Suites %s", city),
			"city":              city,
			"rating":            4.0,
			"price_per_night":   65.00,
			"total_price":       130.00,
			"currency":          "USD",
			"amenities":         []string{"Free WiFi"},
			"convenience_score": 0.65,
			"flexibility_score": 0.50,
		},
	}

	return map[string]interface{}{
		"count":  len(hotels),
		"hotels": hotels,
	}, nil
}
