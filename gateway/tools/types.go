package tools

type RiskTier string

const (
	RiskReadOnly     RiskTier = "read_only"
	RiskReversible   RiskTier = "reversible"
	RiskIrreversible RiskTier = "irreversible"
)

type ToolDefinition struct {
	Name         string                 `json:"name"`
	Description  string                 `json:"description"`
	InputSchema  map[string]interface{} `json:"input_schema"`
	OutputSchema map[string]interface{} `json:"output_schema"`
	CostEstimate float64                `json:"cost_estimate"`
	RiskTier     RiskTier               `json:"risk_tier"`
}

type ToolInvokeRequest struct {
	TaskID string                 `json:"task_id"`
	Input  map[string]interface{} `json:"input"`
}

type ToolInvokeResponse struct {
	TaskID       string                 `json:"task_id"`
	Tool         string                 `json:"tool"`
	Output       map[string]interface{} `json:"output"`
	LatencyMs    int64                  `json:"latency_ms"`
	CostActual   float64                `json:"cost_actual"`
	FallbackUsed bool                   `json:"fallback_used"`
	Error        string                 `json:"error,omitempty"`
}

type ToolHandler func(taskID string, input map[string]interface{}) (map[string]interface{}, error)
