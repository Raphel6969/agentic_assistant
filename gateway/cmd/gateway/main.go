// Agentic Assistant — Gateway Service
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/Raphel6969/agentic_assistant/gateway/tools"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	registry := tools.NewRegistry()

	mux := http.NewServeMux()

	// CORS middleware wrapper
	withCORS := func(h http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}
			h(w, r)
		}
	}

	// Health check
	mux.HandleFunc("/health", withCORS(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "ok",
			"service": "gateway",
			"phase":   "1-core-loop",
		})
	}))

	// Debug failure-injection toggle endpoint for live demo scenario
	mux.HandleFunc("/debug/fail-tool", withCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			Tool string `json:"tool"`
			Fail bool   `json:"fail"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		tools.SetToolFailureMode(req.Tool, req.Fail)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"tool":        req.Tool,
			"forced_fail": req.Fail,
			"message":     fmt.Sprintf("Failure mode for '%s' set to %v", req.Tool, req.Fail),
		})
	}))

	// List registered tools
	mux.HandleFunc("/tools", withCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(registry.List())
	}))

	// Tool invocation endpoint: /tools/{toolName}/invoke
	mux.HandleFunc("/tools/", withCORS(func(w http.ResponseWriter, r *http.Request) {
		path := strings.TrimPrefix(r.URL.Path, "/tools/")
		parts := strings.Split(path, "/")

		if len(parts) == 0 || parts[0] == "" {
			http.Error(w, "tool name required", http.StatusBadRequest)
			return
		}

		toolName := parts[0]

		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req tools.ToolInvokeRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid request json: "+err.Error(), http.StatusBadRequest)
			return
		}

		resp, err := registry.Invoke(toolName, req.TaskID, req.Input)
		w.Header().Set("Content-Type", "application/json")

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(resp)
			return
		}

		json.NewEncoder(w).Encode(resp)
	}))

	log.Printf("Gateway listening on :%s with %d tools registered", port, len(registry.List()))
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("gateway: %v", err)
	}
}
