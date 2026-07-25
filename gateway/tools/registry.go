package tools

import (
	"fmt"
	"sync"
	"time"

	"github.com/Raphel6969/agentic_assistant/gateway/middleware"
)

type Registry struct {
	mu            sync.RWMutex
	tools         map[string]ToolDefinition
	handlers      map[string]ToolHandler
	fallbacks     map[string]string // toolName -> fallbackToolName
	breakers      map[string]*middleware.CircuitBreaker
	retryBackoff  time.Duration
}

func NewRegistry() *Registry {
	r := &Registry{
		tools:        make(map[string]ToolDefinition),
		handlers:     make(map[string]ToolHandler),
		fallbacks:    make(map[string]string),
		breakers:     make(map[string]*middleware.CircuitBreaker),
		retryBackoff: 10 * time.Millisecond,
	}
	r.registerDefaults()
	return r
}

func (r *Registry) Register(def ToolDefinition, handler ToolHandler) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.tools[def.Name] = def
	r.handlers[def.Name] = handler
	r.breakers[def.Name] = middleware.NewCircuitBreaker(def.Name, 3, 10*time.Second)
}

func (r *Registry) RegisterFallback(primaryToolName, fallbackToolName string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.fallbacks[primaryToolName] = fallbackToolName
}

func (r *Registry) List() []ToolDefinition {
	r.mu.RLock()
	defer r.mu.RUnlock()
	list := make([]ToolDefinition, 0, len(r.tools))
	for _, t := range r.tools {
		list = append(list, t)
	}
	return list
}

func (r *Registry) Invoke(toolName, taskID string, input map[string]interface{}) (*ToolInvokeResponse, error) {
	r.mu.RLock()
	def, exists := r.tools[toolName]
	handler, hExists := r.handlers[toolName]
	cb, cbExists := r.breakers[toolName]
	fallbackName, hasFallback := r.fallbacks[toolName]
	r.mu.RUnlock()

	if !exists || !hExists || !cbExists {
		return nil, fmt.Errorf("tool %s not registered", toolName)
	}

	start := time.Now()

	// Execute with 3 retries & exponential backoff
	out, retries, err := middleware.InvokeWithRetry(cb, 3, r.retryBackoff, func(attempt int) (map[string]interface{}, error) {
		return handler(taskID, input)
	})

	latency := time.Since(start).Milliseconds()

	// If primary tool failed after retries / circuit breaker tripped, attempt Fallback Tool Substitution
	if err != nil && hasFallback {
		r.mu.RLock()
		fbHandler, fbExists := r.handlers[fallbackName]
		r.mu.RUnlock()

		if fbExists {
			fbOut, fbErr := fbHandler(taskID, input)
			fbLatency := time.Since(start).Milliseconds()
			if fbErr == nil {
				return &ToolInvokeResponse{
					TaskID:       taskID,
					Tool:         toolName,
					Output:       fbOut,
					LatencyMs:    fbLatency,
					CostActual:   def.CostEstimate,
					FallbackUsed: true,
				}, nil
			}
		}
	}

	if err != nil {
		return &ToolInvokeResponse{
			TaskID:       taskID,
			Tool:         toolName,
			Output:       nil,
			LatencyMs:    latency,
			CostActual:   0,
			FallbackUsed: false,
			Error:        fmt.Sprintf("Failed after %d retries: %v", retries, err),
		}, err
	}

	return &ToolInvokeResponse{
		TaskID:       taskID,
		Tool:         toolName,
		Output:       out,
		LatencyMs:    latency,
		CostActual:   def.CostEstimate,
		FallbackUsed: false,
	}, nil
}

func (r *Registry) registerDefaults() {
	RegisterFlightsTool(r)
	RegisterHotelsTool(r)
	RegisterWeatherTool(r)
	RegisterSchedulingTools(r)
	RegisterACPCheckoutTool(r)
	RegisterResearchTools(r)
	RegisterFailureInjectionTools(r)
}
