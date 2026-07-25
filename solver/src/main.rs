//! Agentic Assistant — Solver Service
//! Rust policy engine & multi-objective constraint ranking solver.

mod policy;
mod ranking;

use axum::{routing::get, routing::post, Json, Router};
use policy::{evaluate_policy, PolicyCheckRequest, PolicyCheckResponse};
use ranking::{rank_options, RankRequest, RankResponse};
use serde_json::{json, Value};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/health", get(health))
        .route("/guardrail/check", post(guardrail_check_handler))
        .route("/rank", post(rank_handler))
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8090));
    println!("Solver listening on {addr}");

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health() -> Json<Value> {
    Json(json!({
        "status": "ok",
        "service": "solver",
        "phase": "2-determinism-layer"
    }))
}

async fn guardrail_check_handler(Json(req): Json<PolicyCheckRequest>) -> Json<PolicyCheckResponse> {
    let resp = evaluate_policy(&req);
    Json(resp)
}

async fn rank_handler(Json(req): Json<RankRequest>) -> Json<RankResponse> {
    let resp = rank_options(&req);
    Json(resp)
}
