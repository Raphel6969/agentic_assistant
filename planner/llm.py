import os
import json
import logging
from typing import Any, Dict, List, Literal, Optional
import openai

logger = logging.getLogger(__name__)


def get_llm_client(backend: Optional[str] = None) -> Optional[openai.AsyncOpenAI]:
    selected_backend = backend or os.getenv("LLM_BACKEND", "groq")

    if selected_backend == "groq":
        api_key = os.getenv("GROQ_API_KEY")
        base_url = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
        if api_key:
            return openai.AsyncOpenAI(api_key=api_key, base_url=base_url)
        logger.warning("GROQ_API_KEY not found. Checking OpenRouter fallback...")

    # Fallback to OpenRouter
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    openrouter_url = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
    if openrouter_key:
        return openai.AsyncOpenAI(api_key=openrouter_key, base_url=openrouter_url)

    logger.warning("No LLM API keys provided (GROQ_API_KEY or OPENROUTER_API_KEY). Using heuristic planner mode.")
    return None


async def generate_plan_steps(
    task_description: str,
    domain: str,
    tools: List[Dict[str, Any]],
    budget_ceiling: float,
) -> List[str]:
    """
    Decompose a high-level task into concrete sub-task steps.
    If LLM is available, uses Groq/OpenRouter.
    Otherwise uses deterministic domain-aware fallback.
    """
    client = get_llm_client()
    if client:
        model = os.getenv("PLANNER_MODEL", "llama-3.3-70b-versatile")
        tool_names = [t["name"] for t in tools]
        prompt = (
            f"You are an autonomous planner agent. Decompose the following task into 2 to 4 clear sequential sub-tasks.\n"
            f"Available tools: {tool_names}\n"
            f"Budget ceiling: ${budget_ceiling}\n"
            f"Task: {task_description}\n\n"
            f"Return a JSON array of string steps, e.g. [\"Search flights from BOM to CDG\", \"Search hotels in Paris\", \"Get weather for Paris\"]"
        )

        try:
            resp = await client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                response_format={"type": "json_object"},
            )
            content = resp.choices[0].message.content or "{}"
            parsed = json.loads(content)
            if isinstance(parsed, list):
                return parsed
            if isinstance(parsed, dict) and "steps" in parsed:
                return parsed["steps"]
        except Exception as e:
            logger.error(f"LLM plan generation failed: {e}. Falling back to heuristic plan.")

    # Heuristic fallback planning if LLM not configured or API call fails
    if "flight" in task_description.lower() or "trip" in task_description.lower() or domain == "trip":
        return [
            "Search for flights to Paris within budget",
            "Search for hotels in Paris within budget",
            "Get live weather forecast for Paris destination",
        ]
    elif domain == "scheduling":
        return [
            "Check calendar availability for next week",
            "Draft calendar invitation for meeting",
        ]
    else:
        return [
            "Search available options for task",
            "Analyze and rank trade-offs",
        ]


async def select_tool_call(
    step_description: str,
    available_tools: List[Dict[str, Any]],
    budget_remaining: float,
) -> Optional[Dict[str, Any]]:
    """
    Select which tool to call and construct arguments.
    """
    client = get_llm_client()
    if client:
        model = os.getenv("FAST_MODEL", "gpt-oss-20b")
        prompt = (
            f"Select the best tool for this step: '{step_description}'.\n"
            f"Available tools and schemas: {json.dumps(available_tools)}\n"
            f"Remaining budget: ${budget_remaining}\n\n"
            f"Return JSON object with fields: 'tool' (string tool name), 'arguments' (dict of args), 'reasoning' (one sentence string)."
        )
        try:
            resp = await client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                response_format={"type": "json_object"},
            )
            content = resp.choices[0].message.content or "{}"
            parsed = json.loads(content)
            if "tool" in parsed and "arguments" in parsed:
                return parsed
        except Exception as e:
            logger.error(f"LLM tool selection failed: {e}. Using heuristic selection.")

    # Heuristic tool selection fallback
    step_lower = step_description.lower()
    if "flight" in step_lower:
        return {
            "tool": "search_flights",
            "arguments": {"origin": "BOM", "destination": "CDG", "date": "2026-08-15", "max_price": budget_remaining},
            "reasoning": "Searching direct and 1-stop flights from BOM to CDG within declared budget limit.",
        }
    elif "hotel" in step_lower:
        return {
            "tool": "search_hotels",
            "arguments": {"city": "Paris", "check_in": "2026-08-15", "check_out": "2026-08-18", "max_price": budget_remaining},
            "reasoning": "Searching centrally located hotels in Paris for 3 nights within remaining budget.",
        }
    elif "weather" in step_lower:
        return {
            "tool": "get_destination_weather",
            "arguments": {"latitude": 48.8566, "longitude": 2.3522, "city": "Paris"},
            "reasoning": "Fetching 7-day live weather forecast for Paris from Open-Meteo REST API.",
        }

    return None
