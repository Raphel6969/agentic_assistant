package tools

import (
	"bytes"
	"context"
	"fmt"
	"os/exec"
	"time"
)

func RegisterCodingTools(r *Registry) {
	r.Register(ToolDefinition{
		Name:        "execute_code",
		Description: "Execute code snippets in Python, JavaScript (Node.js), or Bash and return standard output, errors, and execution metrics.",
		InputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"language": map[string]interface{}{"type": "string", "description": "Language: python, javascript, or bash"},
				"code":     map[string]interface{}{"type": "string", "description": "Source code snippet to execute"},
			},
			"required": []string{"code"},
		},
		OutputSchema: map[string]interface{}{"type": "object"},
		CostEstimate: 0.0,
		RiskTier:     RiskReversible,
	}, handleExecuteCode)
}

func handleExecuteCode(taskID string, input map[string]interface{}) (map[string]interface{}, error) {
	code, ok := input["code"].(string)
	if !ok || code == "" {
		return nil, fmt.Errorf("code string is required")
	}

	lang, okLang := input["language"].(string)
	if !okLang || lang == "" {
		lang = "python"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var cmd *exec.Cmd
	switch lang {
	case "python", "py":
		cmd = exec.CommandContext(ctx, "python", "-c", code)
	case "javascript", "js", "node":
		cmd = exec.CommandContext(ctx, "node", "-e", code)
	case "bash", "sh":
		cmd = exec.CommandContext(ctx, "bash", "-c", code)
	default:
		cmd = exec.CommandContext(ctx, "python", "-c", code)
	}

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	start := time.Now()
	err := cmd.Run()
	duration := time.Since(start).Milliseconds()

	status := "success"
	if err != nil {
		status = "error"
	}

	outStr := stdout.String()
	errStr := stderr.String()

	if outStr == "" && errStr == "" && err == nil {
		outStr = "Code executed successfully with zero output."
	}

	return map[string]interface{}{
		"language":       lang,
		"status":         status,
		"stdout":         outStr,
		"stderr":         errStr,
		"latency_ms":     duration,
		"code_executed":  code,
		"execution_info": fmt.Sprintf("Executed in %dms via %s interpreter", duration, lang),
	}, nil
}
