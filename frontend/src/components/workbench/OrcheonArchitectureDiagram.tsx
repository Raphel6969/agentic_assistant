"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export const OrcheonArchitectureDiagram: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: "var(--font-sans), sans-serif", color: isDark ? "#F8FAFC" : "#0F172A" }}>
      {/* Visual System Topology Map */}
      <div
        style={{
          background: isDark ? "#1E293B" : "#F8FAFC",
          borderRadius: 24,
          padding: 32,
          boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.03)",
          border: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20, color: "#6366F1" }}>✳</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A" }}>
              Orcheon Microservice Topology Map
            </span>
          </div>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "#6366F1", background: "rgba(99,102,241,0.15)", padding: "4px 12px", borderRadius: 12 }}>
            Click any layer node to inspect internals
          </span>
        </div>

        {/* Nodes Grid Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, position: "relative", zIndex: 10 }}>
          {/* Node 1: Web Client */}
          <div
            onClick={() => setActiveNode("frontend")}
            style={{
              background: activeNode === "frontend" ? (isDark ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.06)") : isDark ? "#0F172A" : "#FFFFFF",
              border: activeNode === "frontend" ? "2px solid #6366F1" : isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
              borderRadius: 18,
              padding: 20,
              cursor: "pointer",
              transition: "all 200ms ease",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: "#6366F1", textTransform: "uppercase", marginBottom: 6 }}>
              Layer 1 • Web Client (:3000)
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A" }}>Next.js 14 Workbench</div>
            <div style={{ fontSize: 12, color: isDark ? "#94A3B8" : "#64748B", marginTop: 4 }}>Flight Recorder UI & Interactive Modals</div>
          </div>

          {/* Node 2: Planner & FSM */}
          <div
            onClick={() => setActiveNode("planner")}
            style={{
              background: activeNode === "planner" ? (isDark ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.06)") : isDark ? "#0F172A" : "#FFFFFF",
              border: activeNode === "planner" ? "2px solid #6366F1" : isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
              borderRadius: 18,
              padding: 20,
              cursor: "pointer",
              transition: "all 200ms ease",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: "#3B82F6", textTransform: "uppercase", marginBottom: 6 }}>
              Layer 2 • Brain & FSM (:8000)
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A" }}>Python FastAPI Planner</div>
            <div style={{ fontSize: 12, color: isDark ? "#94A3B8" : "#64748B", marginTop: 4 }}>Explicit 6-State Machine & Multi-LLM</div>
          </div>

          {/* Node 3: Policy Core */}
          <div
            onClick={() => setActiveNode("solver")}
            style={{
              background: activeNode === "solver" ? (isDark ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.06)") : isDark ? "#0F172A" : "#FFFFFF",
              border: activeNode === "solver" ? "2px solid #6366F1" : isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
              borderRadius: 18,
              padding: 20,
              cursor: "pointer",
              transition: "all 200ms ease",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: "#F59E0B", textTransform: "uppercase", marginBottom: 6 }}>
              Layer 3 • Policy Core (:8090)
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A" }}>Rust Solver & Policy Engine</div>
            <div style={{ fontSize: 12, color: isDark ? "#94A3B8" : "#64748B", marginTop: 4 }}>Budget Guardrails & Multi-Objective Ranking</div>
          </div>

          {/* Node 4: Tool Hub */}
          <div
            onClick={() => setActiveNode("gateway")}
            style={{
              background: activeNode === "gateway" ? (isDark ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.06)") : isDark ? "#0F172A" : "#FFFFFF",
              border: activeNode === "gateway" ? "2px solid #6366F1" : isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
              borderRadius: 18,
              padding: 20,
              cursor: "pointer",
              transition: "all 200ms ease",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: "#10B981", textTransform: "uppercase", marginBottom: 6 }}>
              Layer 4 • Tool Hub (:8080)
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A" }}>Go MCP Tool Gateway</div>
            <div style={{ fontSize: 12, color: isDark ? "#94A3B8" : "#64748B", marginTop: 4 }}>Goroutine Fan-out & MCP Server</div>
          </div>

          {/* Node 5: Persistence */}
          <div
            onClick={() => setActiveNode("postgres")}
            style={{
              background: activeNode === "postgres" ? (isDark ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.06)") : isDark ? "#0F172A" : "#FFFFFF",
              border: activeNode === "postgres" ? "2px solid #6366F1" : isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
              borderRadius: 18,
              padding: 20,
              cursor: "pointer",
              transition: "all 200ms ease",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: "#8B5CF6", textTransform: "uppercase", marginBottom: 6 }}>
              Layer 5 • Persistence (:5432)
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A" }}>PostgreSQL Database</div>
            <div style={{ fontSize: 12, color: isDark ? "#94A3B8" : "#64748B", marginTop: 4 }}>Structured Audit & Decision Log Storage</div>
          </div>

          {/* Node 6: External Live APIs */}
          <div
            onClick={() => setActiveNode("apis")}
            style={{
              background: activeNode === "apis" ? (isDark ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.06)") : isDark ? "#0F172A" : "#FFFFFF",
              border: activeNode === "apis" ? "2px solid #6366F1" : isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
              borderRadius: 18,
              padding: 20,
              cursor: "pointer",
              transition: "all 200ms ease",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: "#EC4899", textTransform: "uppercase", marginBottom: 6 }}>
              Live Tools • External APIs
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A" }}>REST API Ecosystem</div>
            <div style={{ fontSize: 12, color: isDark ? "#94A3B8" : "#64748B", marginTop: 4 }}>Open-Meteo, Nager.Date, Frankfurter</div>
          </div>
        </div>
      </div>

      {/* Selected Node Inspector Detail Card */}
      <div
        style={{
          background: isDark ? "#1E293B" : "#FFFFFF",
          borderRadius: 24,
          padding: 28,
          boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.04)",
          border: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A" }}>
              {nodeDetails[activeNode].title}
            </h3>
            <span style={{ fontSize: 12, color: isDark ? "#94A3B8" : "#64748B", fontFamily: "var(--font-mono)" }}>
              Tech Stack: {nodeDetails[activeNode].tech}
            </span>
          </div>
          <span
            style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              background: isDark ? "#0F172A" : "#F8FAFC",
              border: isDark ? "1px solid #334155" : "1px solid #E2E8F0",
              padding: "4px 10px",
              borderRadius: 8,
              color: isDark ? "#CBD5E1" : "#475569",
            }}
          >
            {nodeDetails[activeNode].port}
          </span>
        </div>

        <p style={{ margin: 0, fontSize: 13.5, color: isDark ? "#CBD5E1" : "#475569", lineHeight: 1.6 }}>
          {nodeDetails[activeNode].desc}
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 4 }}>
          {nodeDetails[activeNode].metrics.map((m, idx) => (
            <span
              key={idx}
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#6366F1",
                background: "rgba(99,102,241,0.12)",
                padding: "6px 12px",
                borderRadius: 10,
              }}
            >
              ✓ {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
