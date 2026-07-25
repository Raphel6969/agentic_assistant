// Agentic Assistant — Gateway Service
// Phase 0 scaffold: HTTP server boots, health endpoint returns 200.
// Phase 1: tool registry, fan-out, MCP server, retry/circuit-breaker.
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()

	// Health check — used by Docker Compose and CI
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "ok",
			"service": "gateway",
			"phase":   "0-scaffold",
		})
	})

	// Tool registry stub — Phase 1 will populate this with real tool registrations
	mux.HandleFunc("/tools", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		// Stub: empty tool list until Phase 1
		json.NewEncoder(w).Encode([]interface{}{})
	})

	// Tool invocation stub — Phase 1 will wire fan-out + retry/circuit-breaker
	mux.HandleFunc("/tools/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"output":       nil,
			"latency_ms":   0,
			"cost_actual":  0.0,
			"fallback_used": false,
			"message":      "tool invocation not yet wired (Phase 1)",
		})
	})

	log.Printf("Gateway listening on :%s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("gateway: %v", err)
	}
}
