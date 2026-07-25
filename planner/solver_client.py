import os
import logging
from typing import Any, Dict
import httpx

logger = logging.getLogger(__name__)

SOLVER_URL = os.getenv("SOLVER_URL", "http://localhost:8090")


class SolverClient:
    def __init__(self, base_url: str = SOLVER_URL):
        self.base_url = base_url.rstrip("/")

    async def check_guardrail(
        self,
        task_id: str,
        action_name: str,
        risk_tier: str,
        cost_estimate: float,
        budget_ceiling: float,
        budget_spent: float,
        input_payload: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Check an action against Rust policy engine before execution.
        """
        async with httpx.AsyncClient(timeout=5.0) as client:
            try:
                resp = await client.post(
                    f"{self.base_url}/guardrail/check",
                    json={
                        "task_id": task_id,
                        "action_name": action_name,
                        "risk_tier": risk_tier,
                        "cost_estimate": cost_estimate,
                        "budget_state": {
                            "ceiling": budget_ceiling,
                            "spent": budget_spent,
                        },
                        "input_payload": input_payload,
                    },
                )
                if resp.status_code == 200:
                    return resp.json()
            except Exception as e:
                logger.error(f"Failed to reach Rust solver ({self.base_url}): {e}")

        # Fallback Python-side rule check if solver service is starting up
        if budget_spent + cost_estimate > budget_ceiling:
            return {
                "task_id": task_id,
                "action_name": action_name,
                "result": "blocked",
                "reason": f"Hard block: action cost ${cost_estimate:.2f} + current spend ${budget_spent:.2f} exceeds ceiling ${budget_ceiling:.2f}",
                "budget_remaining": max(0.0, budget_ceiling - budget_spent),
            }

        if risk_tier == "irreversible":
            return {
                "task_id": task_id,
                "action_name": action_name,
                "result": "requires_approval",
                "reason": f"Action '{action_name}' is tier Irreversible and requires explicit human approval.",
                "budget_remaining": max(0.0, budget_ceiling - budget_spent),
            }

        return {
            "task_id": task_id,
            "action_name": action_name,
            "result": "allowed",
            "reason": "Passed policy check",
            "budget_remaining": max(0.0, budget_ceiling - budget_spent),
        }
