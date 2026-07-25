import os
import logging
from typing import Any, Dict, List, Optional
import httpx

logger = logging.getLogger(__name__)

GATEWAY_URL = os.getenv("GATEWAY_URL", "http://localhost:8080")


class GatewayClient:
    def __init__(self, base_url: str = GATEWAY_URL):
        self.base_url = base_url.rstrip("/")

    async def list_tools(self) -> List[Dict[str, Any]]:
        """Fetch registered tools from Go Gateway."""
        async with httpx.AsyncClient(timeout=5.0) as client:
            try:
                resp = await client.get(f"{self.base_url}/tools")
                if resp.status_code == 200:
                    return resp.json()
            except Exception as e:
                logger.error(f"Failed to fetch tools from Gateway ({self.base_url}): {e}")

        # Fallback default definitions if gateway is starting up or unreachable
        return [
            {
                "name": "search_flights",
                "description": "Search flights between origin and destination",
                "input_schema": {"type": "object"},
                "output_schema": {"type": "object"},
                "cost_estimate": 0.0,
                "risk_tier": "read_only",
            },
            {
                "name": "search_hotels",
                "description": "Search hotels in a city",
                "input_schema": {"type": "object"},
                "output_schema": {"type": "object"},
                "cost_estimate": 0.0,
                "risk_tier": "read_only",
            },
            {
                "name": "get_destination_weather",
                "description": "Get destination weather forecast",
                "input_schema": {"type": "object"},
                "output_schema": {"type": "object"},
                "cost_estimate": 0.0,
                "risk_tier": "read_only",
            },
        ]

    async def invoke_tool(self, tool_name: str, task_id: str, tool_input: Dict[str, Any]) -> Dict[str, Any]:
        """Invoke a tool via Go Gateway endpoint /tools/{tool_name}/invoke."""
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                resp = await client.post(
                    f"{self.base_url}/tools/{tool_name}/invoke",
                    json={"task_id": task_id, "input": tool_input},
                )
                if resp.status_code in (200, 400):
                    return resp.json()
                return {"error": f"Gateway HTTP {resp.status_code}: {resp.text}"}
            except Exception as e:
                logger.error(f"Error invoking tool {tool_name} via Gateway: {e}")
                return {"error": f"Gateway connection error: {str(e)}"}
