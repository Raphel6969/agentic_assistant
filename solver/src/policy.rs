use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RiskTier {
    ReadOnly,
    Reversible,
    Irreversible,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum GuardrailResultStatus {
    Allowed,
    Blocked,
    RequiresApproval,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BudgetState {
    pub ceiling: f64,
    pub spent: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PolicyCheckRequest {
    pub task_id: String,
    pub action_name: String,
    pub risk_tier: Option<RiskTier>,
    pub cost_estimate: Option<f64>,
    pub budget_state: Option<BudgetState>,
    pub input_payload: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PolicyCheckResponse {
    pub task_id: String,
    pub action_name: String,
    pub result: GuardrailResultStatus,
    pub reason: String,
    pub budget_remaining: f64,
}

/// Evaluates policy rules deterministically. No unwrap/expect!
pub fn evaluate_policy(req: &PolicyCheckRequest) -> PolicyCheckResponse {
    let cost = req.cost_estimate.unwrap_or(0.0);
    let budget = req.budget_state.as_ref().cloned().unwrap_or(BudgetState {
        ceiling: 500.0,
        spent: 0.0,
    });

    let risk = req.risk_tier.as_ref().unwrap_or(&RiskTier::ReadOnly);
    let remaining = (budget.ceiling - budget.spent).max(0.0);

    // Rule 1: Budget Ceiling Enforcement (Hard Block)
    if budget.spent + cost > budget.ceiling {
        let overrun = (budget.spent + cost) - budget.ceiling;
        return PolicyCheckResponse {
            task_id: req.task_id.clone(),
            action_name: req.action_name.clone(),
            result: GuardrailResultStatus::Blocked,
            reason: format!(
                "Hard Block: Action cost ${:.2} + current spend ${:.2} exceeds budget ceiling ${:.2} by ${:.2}",
                cost, budget.spent, budget.ceiling, overrun
            ),
            budget_remaining: remaining,
        };
    }

    // Rule 2: Irreversible Risk Tier Enforcement
    if *risk == RiskTier::Irreversible {
        return PolicyCheckResponse {
            task_id: req.task_id.clone(),
            action_name: req.action_name.clone(),
            result: GuardrailResultStatus::RequiresApproval,
            reason: format!(
                "Action '{}' is tier Irreversible and requires explicit human approval before execution.",
                req.action_name
            ),
            budget_remaining: remaining,
        };
    }

    // Rule 3: Allowed
    PolicyCheckResponse {
        task_id: req.task_id.clone(),
        action_name: req.action_name.clone(),
        result: GuardrailResultStatus::Allowed,
        reason: format!(
            "Policy Passed: Action '{}' within budget ceiling (Remaining: ${:.2})",
            req.action_name,
            remaining - cost
        ),
        budget_remaining: remaining,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_budget_overrun_blocked() {
        let req = PolicyCheckRequest {
            task_id: "t1".to_string(),
            action_name: "confirm_booking".to_string(),
            risk_tier: Some(RiskTier::Reversible),
            cost_estimate: Some(150.0),
            budget_state: Some(BudgetState {
                ceiling: 500.0,
                spent: 400.0,
            }),
            input_payload: None,
        };

        let res = evaluate_policy(&req);
        assert_eq!(res.result, GuardrailResultStatus::Blocked);
        assert!(res.reason.contains("Hard Block"));
    }

    #[test]
    fn test_irreversible_requires_approval() {
        let req = PolicyCheckRequest {
            task_id: "t2".to_string(),
            action_name: "confirm_booking".to_string(),
            risk_tier: Some(RiskTier::Irreversible),
            cost_estimate: Some(50.0),
            budget_state: Some(BudgetState {
                ceiling: 500.0,
                spent: 100.0,
            }),
            input_payload: None,
        };

        let res = evaluate_policy(&req);
        assert_eq!(res.result, GuardrailResultStatus::RequiresApproval);
    }

    #[test]
    fn test_readonly_allowed() {
        let req = PolicyCheckRequest {
            task_id: "t3".to_string(),
            action_name: "search_flights".to_string(),
            risk_tier: Some(RiskTier::ReadOnly),
            cost_estimate: Some(0.0),
            budget_state: Some(BudgetState {
                ceiling: 500.0,
                spent: 50.0,
            }),
            input_payload: None,
        };

        let res = evaluate_policy(&req);
        assert_eq!(res.result, GuardrailResultStatus::Allowed);
    }
}
