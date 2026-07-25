package tools

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func RegisterWeatherTool(r *Registry) {
	def := ToolDefinition{
		Name:        "get_destination_weather",
		Description: "Fetch real live weather forecast for destination coordinates using Open-Meteo API.",
		InputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"latitude":  map[string]interface{}{"type": "number", "description": "Latitude coordinate, e.g. 48.8566 for Paris, 19.0760 for Mumbai"},
				"longitude": map[string]interface{}{"type": "number", "description": "Longitude coordinate, e.g. 2.3522 for Paris, 72.8777 for Mumbai"},
				"city":      map[string]interface{}{"type": "string", "description": "Optional city name for display"},
			},
			"required": []string{"latitude", "longitude"},
		},
		OutputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"weather": map[string]interface{}{"type": "object"},
			},
		},
		CostEstimate: 0.0,
		RiskTier:     RiskReadOnly,
	}

	r.Register(def, handleGetWeather)
}

type openMeteoResponse struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Timezone  string  `json:"timezone"`
	Daily     struct {
		Time             []string  `json:"time"`
		TemperatureMax   []float64 `json:"temperature_2m_max"`
		TemperatureMin   []float64 `json:"temperature_2m_min"`
		PrecipitationSum []float64 `json:"precipitation_sum"`
	} `json:"daily"`
}

func handleGetWeather(taskID string, input map[string]interface{}) (map[string]interface{}, error) {
	lat, ok1 := input["latitude"].(float64)
	lon, ok2 := input["longitude"].(float64)

	if !ok1 || !ok2 {
		// Try fallback lookup for common cities
		city, _ := input["city"].(string)
		if city != "" {
			switch city {
			case "Paris", "paris":
				lat, lon = 48.8566, 2.3522
			case "Mumbai", "mumbai", "BOM":
				lat, lon = 19.0760, 72.8777
			case "London", "london":
				lat, lon = 51.5074, -0.1278
			case "Tokyo", "tokyo":
				lat, lon = 35.6762, 139.6503
			case "New York", "NYC":
				lat, lon = 40.7128, -74.0060
			default:
				return nil, fmt.Errorf("latitude and longitude coordinates are required")
			}
		} else {
			return nil, fmt.Errorf("latitude and longitude coordinates are required")
		}
	}

	url := fmt.Sprintf(
		"https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto",
		lat, lon,
	)

	client := http.Client{Timeout: 5 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch weather data: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("open-meteo returned status %d", resp.StatusCode)
	}

	var data openMeteoResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, fmt.Errorf("failed to decode weather response: %w", err)
	}

	city, _ := input["city"].(string)

	return map[string]interface{}{
		"source":      "Open-Meteo REST API (Live)",
		"city":        city,
		"latitude":    data.Latitude,
		"longitude":   data.Longitude,
		"timezone":    data.Timezone,
		"dates":       data.Daily.Time,
		"temp_max_c":  data.Daily.TemperatureMax,
		"temp_min_c":  data.Daily.TemperatureMin,
		"rain_mm":     data.Daily.PrecipitationSum,
	}, nil
}
