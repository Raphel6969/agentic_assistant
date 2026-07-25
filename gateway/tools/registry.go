package tools

import (
	"fmt"
	"sync"
	"time"
)

type Registry struct {
	mu       sync.RWMutex
	tools    map[string]ToolDefinition
	handlers map[string]ToolHandler
}

func NewRegistry() *Registry {
	r := &Registry{
		tools:    make(map[string]ToolDefinition),
		handlers: make(map[string]ToolHandler),
	}
	r.registerDefaults()
	return r
}

func (r *Registry) Register(def ToolDefinition, handler ToolHandler) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.tools[def.Name] = def
	r.handlers[def.Name] = handler
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
	r.mu.RUnlock()

	if !exists || !hExists {
		return nil, fmt.Errorf("tool %s not registered", toolName)
	}

	start := time.Now()
	out, err := handler(taskID, input)
	latency := time.Since(start).Milliseconds()

	if err != nil {
		return &ToolInvokeResponse{
			TaskID:       taskID,
			Tool:         toolName,
			Output:       nil,
			LatencyMs:    latency,
			CostActual:   0,
			FallbackUsed: false,
			Error:        err.Error(),
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
}
