//! Agentic Assistant — Solver Service
//! Phase 0 scaffold: Axum HTTP server boots, health endpoint returns 200.
//! Phase 2: guardrail engine + constraint ranking solver wired in.

use axum::{routing::get, routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/health", get(health))
        .route("/guardrail/check", post(guardrail_check_stub))
        .route("/rank", post(rank_stub));

    let addr = SocketAddr::from(([0, 0, 0, 0], 8090));
    println!("Solver listening on {addr}");

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health() -> Json<Value> {
    Json(json!({
        "status": "ok",
        "service": "solver",
        "phase": "0-scaffold"
    }))
}

/// Phase 2 stub: guardrail check.
/// Returns "allowed" for everything until the real engine is wired.
async fn guardrail_check_stub(Json(body): Json<Value>) -> Json<Value> {
    Json(json!({
        "task_id": body.get("task_id").unwrap_or(&json!("")),
        "action_name": body.get("action_name").unwrap_or(&json!("")),
        "result": "allowed",
        "reason": "stub — real guardrail not yet wired (Phase 2)",
        "budget_remaining": body
            .get("budget_state")
            .and_then(|b| b.get("ceiling"))
            .unwrap_or(&json!(0))
    }))
}

/// Phase 2 stub: multi-objective ranking.
/// Returns options in original order until the solver is wired.
async fn rank_stub(Json(body): Json<Value>) -> Json<Value> {
    let empty: Vec<Value> = vec![];
    let options = body
        .get("options")
        .and_then(|o| o.as_array())
        .unwrap_or(&empty);

    let ranked_ids: Vec<Value> = options
        .iter()
        .filter_map(|o| o.get("id").cloned())
        .collect();

    Json(json!({
        "task_id": body.get("task_id").unwrap_or(&json!("")),
        "ranked_ids": ranked_ids,
        "scores": {},
        "note": "stub — real constraint solver not yet wired (Phase 2)"
    }))
}
