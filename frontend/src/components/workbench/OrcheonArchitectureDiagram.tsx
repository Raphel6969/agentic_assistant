"use client";

import React, { useState } from "react";

export const OrcheonArchitectureDiagram: React.FC = () => {
  const [activeNode, setActiveNode] = useState<"frontend" | "planner" | "solver" | "gateway" | "postgres" | "apis">("planner");

  const nodeDetails = {
    frontend: {
      title: "Next.js 14 Web Workbench & Flight Recorder",
      port: ":3000",
      tech: "Next.js 14, React, TypeScript, Glassmorphism UI",
      desc: "Provides a real-time visual workbench with sticky top navigation, per-task execution thread isolation, interactive parameter modals, and step-by-step decision flight recorder logs.",
      metrics: ["< 16ms Frame Render", "WebSocket Live Event Stream", "Persistent Chat Session"],
    },
    planner: {
      title: "Orcheon Python FastAPI Planner & State Machine",
      port: ":8000",
      tech: "FastAPI, Python 3.12, Uvicorn, LangChain / LLM Gateway",
      desc: "Orchestrates an explicit 6-State FSM (Init -> Plan -> Select Tool -> Execute -> Validate -> Synthesize). Uses multi-provider failover (Gemini 429 quota fallback to Groq Llama-3.3-70B).",
      metrics: ["6-State FSM Engine", "Multi-Provider LLM Failover", "Async Event Emission"],
    },
    solver: {
      title: "Rust Core Policy Engine & Solver",
      port: ":8090",
      tech: "Rust 1.85, Tokio, Serde, Custom Weighted Scoring",
      desc: "Enforces deterministic hard budget ceilings and 3-tier permission checks (Read-Only, Reversible, Irreversible). Evaluates multi-objective weighted utility functions for flight/hotel options in under 5ms.",
      metrics: ["< 5ms Guardrail Check", "100% Deterministic Security", "Multi-Objective Ranking"],
    },
    gateway: {
      title: "Go MCP Tool Gateway & Concurrent Fan-Out",
      port: ":8080",
      tech: "Go 1.23, Model Context Protocol (MCP), Goroutines",
      desc: "Hosts MCP tool servers and executes concurrent tool calls (flights, hotels, weather, calendar, code execution) with built-in circuit breakers and in-memory fallback caches.",
      metrics: ["Concurrent Goroutine Fan-Out", "MCP Standard Server", "Circuit Breaker Protection"],
    },
    postgres: {
      title: "PostgreSQL Database & Replayable Decision Logs",
      port: ":5432",
      tech: "PostgreSQL 16, JSONB Schema, Asyncpg",
      desc: "Stores full structured task state, permission audit logs, and replayable execution traces for post-execution compliance and debugging.",
      metrics: ["Replayable Event Sourcing", "ACID Compliant Audit", "JSONB Trace Logs"],
    },
    apis: {
      title: "External Live REST APIs & Real-World Tools",
      port: "Public Endpoints",
      tech: "Open-Meteo REST API, Nager.Date API, Frankfurter Currency API",
      desc: "Direct unauthenticated live REST integrations fetching real global weather forecasts, public holiday calendars, and live exchange rates without key bottlenecks.",
      metrics: ["Open-Meteo Weather API", "Nager.Date Calendar API", "Frankfurter Currency API"],
    },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: "var(--font-sans), sans-serif" }}>
      {/* Visual System Topology Map (Light Glass Theme) */}
      <div
        style={{
          background: "#F8FAFC",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          border: "1.5px solid #E2E8F0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20, color: "#6366F1" }}>✳</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
              Orcheon Microservice Topology Map
            </span>
          </div>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "#6366F1", background: "rgba(99,102,241,0.1)", padding: "4px 12px", borderRadius: 12 }}>
            Click any layer node to inspect internals
          </span>
        </div>

        {/* Nodes Grid Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, position: "relative", zIndex: 10 }}>
          {/* Layer 1: Next.js Frontend */}
          <div
            onClick={() => setActiveNode("frontend")}
            style={{
              background: activeNode === "frontend" ? "#FFFFFF" : "#F1F5F9",
              border: activeNode === "frontend" ? "2px solid #6366F1" : "1.5px solid #E2E8F0",
              borderRadius: 18,
              padding: 20,
              cursor: "pointer",
              transition: "all 180ms ease",
              boxShadow: activeNode === "frontend" ? "0 6px 20px rgba(99,102,241,0.15)" : "none",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: "#6366F1", textTransform: "uppercase", marginBottom: 6 }}>
              Layer 1 • Web Client (:3000)
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
              Next.js 14 Workbench
            </div>
            <div style={{ fontSize: 12, color: "#64748B" }}>Flight Recorder UI & Interactive Modals</div>
          </div>

          {/* Layer 2: Python Planner */}
          <div
            onClick={() => setActiveNode("planner")}
            style={{
              background: activeNode === "planner" ? "#FFFFFF" : "#F1F5F9",
              border: activeNode === "planner" ? "2px solid #6366F1" : "1.5px solid #E2E8F0",
              borderRadius: 18,
              padding: 20,
              cursor: "pointer",
              transition: "all 180ms ease",
              boxShadow: activeNode === "planner" ? "0 6px 20px rgba(99,102,241,0.15)" : "none",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: "#0284C7", textTransform: "uppercase", marginBottom: 6 }}>
              Layer 2 • Brain & FSM (:8000)
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
              Python FastAPI Planner
            </div>
            <div style={{ fontSize: 12, color: "#64748B" }}>Explicit 6-State Machine & Multi-LLM</div>
          </div>

          {/* Layer 3: Rust Solver */}
          <div
            onClick={() => setActiveNode("solver")}
            style={{
              background: activeNode === "solver" ? "#FFFFFF" : "#F1F5F9",
              border: activeNode === "solver" ? "2px solid #F59E0B" : "1.5px solid #E2E8F0",
              borderRadius: 18,
              padding: 20,
              cursor: "pointer",
              transition: "all 180ms ease",
              boxShadow: activeNode === "solver" ? "0 6px 20px rgba(245,158,11,0.15)" : "none",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: "#D97706", textTransform: "uppercase", marginBottom: 6 }}>
              Layer 3 • Policy Core (:8090)
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
              Rust Solver & Policy Engine
            </div>
            <div style={{ fontSize: 12, color: "#64748B" }}>Budget Guardrails & Multi-Objective Ranking</div>
          </div>

          {/* Layer 4: Go Tool Gateway */}
          <div
            onClick={() => setActiveNode("gateway")}
            style={{
              background: activeNode === "gateway" ? "#FFFFFF" : "#F1F5F9",
              border: activeNode === "gateway" ? "2px solid #10B981" : "1.5px solid #E2E8F0",
              borderRadius: 18,
              padding: 20,
              cursor: "pointer",
              transition: "all 180ms ease",
              boxShadow: activeNode === "gateway" ? "0 6px 20px rgba(16,185,129,0.15)" : "none",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: "#059669", textTransform: "uppercase", marginBottom: 6 }}>
              Layer 4 • Tool Hub (:8080)
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
              Go MCP Tool Gateway
            </div>
            <div style={{ fontSize: 12, color: "#64748B" }}>Goroutine Fan-out & MCP Server</div>
          </div>

          {/* Layer 5: PostgreSQL Database */}
          <div
            onClick={() => setActiveNode("postgres")}
            style={{
              background: activeNode === "postgres" ? "#FFFFFF" : "#F1F5F9",
              border: activeNode === "postgres" ? "2px solid #8B5CF6" : "1.5px solid #E2E8F0",
              borderRadius: 18,
              padding: 20,
              cursor: "pointer",
              transition: "all 180ms ease",
              boxShadow: activeNode === "postgres" ? "0 6px 20px rgba(139,92,246,0.15)" : "none",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: "#7C3AED", textTransform: "uppercase", marginBottom: 6 }}>
              Layer 5 • Persistence (:5432)
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
              PostgreSQL Database
            </div>
            <div style={{ fontSize: 12, color: "#64748B" }}>Structured Audit & Decision Log Storage</div>
          </div>

          {/* Layer 6: Live APIs */}
          <div
            onClick={() => setActiveNode("apis")}
            style={{
              background: activeNode === "apis" ? "#FFFFFF" : "#F1F5F9",
              border: activeNode === "apis" ? "2px solid #EC4899" : "1.5px solid #E2E8F0",
              borderRadius: 18,
              padding: 20,
              cursor: "pointer",
              transition: "all 180ms ease",
              boxShadow: activeNode === "apis" ? "0 6px 20px rgba(236,72,153,0.15)" : "none",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: "#DB2777", textTransform: "uppercase", marginBottom: 6 }}>
              Live Tools • External APIs
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
              REST API Ecosystem
            </div>
            <div style={{ fontSize: 12, color: "#64748B" }}>Open-Meteo, Nager.Date, Frankfurter</div>
          </div>
        </div>
      </div>

      {/* Active Node Detail Card */}
      {nodeDetails[activeNode] && (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 20,
            padding: 24,
            border: "1.5px solid #E2E8F0",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", margin: 0 }}>
              {nodeDetails[activeNode].title}
            </h3>
            <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", background: "#F1F5F9", padding: "4px 10px", borderRadius: 8, color: "#475569" }}>
              {nodeDetails[activeNode].port}
            </span>
          </div>

          <div style={{ fontSize: 13, color: "#64748B" }}>
            <strong>Tech Stack:</strong> {nodeDetails[activeNode].tech}
          </div>

          <p style={{ fontSize: 14, color: "#1E293B", margin: 0, lineHeight: 1.6 }}>
            {nodeDetails[activeNode].desc}
          </p>

          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            {nodeDetails[activeNode].metrics.map((m) => (
              <span
                key={m}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  background: "rgba(99,102,241,0.1)",
                  color: "#6366F1",
                  padding: "4px 10px",
                  borderRadius: 10,
                }}
              >
                ✓ {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
