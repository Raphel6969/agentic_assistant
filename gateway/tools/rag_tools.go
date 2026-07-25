package tools

import (
	"fmt"
)

func RegisterRAGTools(r *Registry) {
	r.Register(ToolDefinition{
		Name:        "search_knowledge_base",
		Description: "Search indexed user knowledge base documents (RAG) for relevant context, notes, or uploaded files.",
		InputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"query": map[string]interface{}{"type": "string", "description": "Search query or topic"},
			},
			"required": []string{"query"},
		},
		OutputSchema: map[string]interface{}{"type": "object"},
		CostEstimate: 0.0,
		RiskTier:     RiskReadOnly,
	}, handleSearchKnowledgeBase)
}

func handleSearchKnowledgeBase(taskID string, input map[string]interface{}) (map[string]interface{}, error) {
	query, _ := input["query"].(string)

	return map[string]interface{}{
		"query":  query,
		"status": "retrieved",
		"matches": []map[string]interface{}{
			{
				"doc_id":    "doc_pref_01",
				"source":    "User Preferences & Itineraries",
				"relevance": 0.94,
				"snippet":   fmt.Sprintf("Relevant note for '%s': User prefers direct flights, vegetarian meals, and central hotels.", query),
			},
		},
	}, nil
}
