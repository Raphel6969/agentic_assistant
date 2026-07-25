package tools

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func RegisterSchedulingTools(r *Registry) {
	// 1. check_calendar_availability
	r.Register(ToolDefinition{
		Name:        "check_calendar_availability",
		Description: "Check calendar availability for participants and query real public holidays via Nager.Date API.",
		InputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"participants": map[string]interface{}{"type": "array", "description": "Email addresses of participants"},
				"date_range":   map[string]interface{}{"type": "string", "description": "Target week or date, e.g. 2026-08-17"},
				"country_code": map[string]interface{}{"type": "string", "description": "2-letter ISO country code for public holiday check, e.g. US, FR, IN"},
			},
			"required": []string{"participants"},
		},
		OutputSchema: map[string]interface{}{"type": "object"},
		CostEstimate: 0.0,
		RiskTier:     RiskReadOnly,
	}, handleCheckCalendarAvailability)

	// 2. draft_invite
	r.Register(ToolDefinition{
		Name:        "draft_invite",
		Description: "Draft a calendar invitation for selected meeting time slot.",
		InputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"title":        map[string]interface{}{"type": "string"},
				"time_slot":    map[string]interface{}{"type": "string"},
				"participants": map[string]interface{}{"type": "array"},
				"agenda":       map[string]interface{}{"type": "string"},
			},
			"required": []string{"title", "time_slot", "participants"},
		},
		OutputSchema: map[string]interface{}{"type": "object"},
		CostEstimate: 0.0,
		RiskTier:     RiskReversible,
	}, handleDraftInvite)

	// 3. send_invite
	r.Register(ToolDefinition{
		Name:        "send_invite",
		Description: "Send calendar invitation to all participants. Tier Irreversible — requires human approval.",
		InputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"invite_id":    map[string]interface{}{"type": "string"},
				"title":        map[string]interface{}{"type": "string"},
				"participants": map[string]interface{}{"type": "array"},
			},
			"required": []string{"invite_id", "participants"},
		},
		OutputSchema: map[string]interface{}{"type": "object"},
		CostEstimate: 0.0,
		RiskTier:     RiskIrreversible,
	}, handleSendInvite)
}

type nagerHoliday struct {
	Date        string `json:"date"`
	LocalName   string `json:"localName"`
	Name        string `json:"name"`
	CountryCode string `json:"countryCode"`
}

func handleCheckCalendarAvailability(taskID string, input map[string]interface{}) (map[string]interface{}, error) {
	countryCode, ok := input["country_code"].(string)
	if !ok || countryCode == "" {
		countryCode = "US"
	}

	// Fetch real public holidays from Nager.Date API (zero auth)
	holidaysURL := fmt.Sprintf("https://date.nager.at/api/v3/PublicHolidays/2026/%s", countryCode)
	client := http.Client{Timeout: 4 * time.Second}
	var holidays []nagerHoliday

	resp, err := client.Get(holidaysURL)
	if err == nil && resp.StatusCode == http.StatusOK {
		_ = json.NewDecoder(resp.Body).Decode(&holidays)
		resp.Body.Close()
	}

	holidayNames := make([]string, 0)
	for _, h := range holidays {
		holidayNames = append(holidayNames, fmt.Sprintf("%s (%s)", h.Name, h.Date))
	}

	// Simulated free slots avoiding holiday conflicts
	freeSlots := []map[string]interface{}{
		{"slot_id": "slot-1", "date": "2026-08-17", "time": "10:00 AM - 11:00 AM", "available_count": 3, "conflict": false},
		{"slot_id": "slot-2", "date": "2026-08-18", "time": "02:00 PM - 03:00 PM", "available_count": 3, "conflict": false},
		{"slot_id": "slot-3", "date": "2026-08-19", "time": "11:30 AM - 12:30 PM", "available_count": 2, "conflict": true},
	}

	return map[string]interface{}{
		"source":                "Nager.Date REST API (Live Public Holidays) + Calendar Service",
		"country_code":          countryCode,
		"public_holidays_count": len(holidays),
		"public_holidays_sample": holidayNames[:min(3, len(holidayNames))],
		"free_slots":            freeSlots,
		"recommended_slot":      "2026-08-17 10:00 AM - 11:00 AM",
	}, nil
}

func handleDraftInvite(taskID string, input map[string]interface{}) (map[string]interface{}, error) {
	title, _ := input["title"].(string)
	timeSlot, _ := input["time_slot"].(string)

	return map[string]interface{}{
		"invite_id": "INV-8842",
		"status":    "drafted",
		"title":     title,
		"time_slot": timeSlot,
		"preview":   fmt.Sprintf("Calendar Invite: '%s' scheduled for %s.", title, timeSlot),
	}, nil
}

func handleSendInvite(taskID string, input map[string]interface{}) (map[string]interface{}, error) {
	inviteID, _ := input["invite_id"].(string)

	return map[string]interface{}{
		"invite_id": inviteID,
		"status":    "sent",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"message":   "Calendar invitation successfully dispatched to all participants.",
	}, nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
