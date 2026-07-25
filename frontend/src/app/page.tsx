"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { DotPattern } from "@/components/magicui/DotPattern";
import { ShimmerButton } from "@/components/magicui/ShimmerButton";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { NumberTicker } from "@/components/magicui/NumberTicker";

export default function LandingPage() {
  const { user, guestLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<"system" | "fsm" | "adrs" | "policy">("system");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #D4E7FE 0%, #EBF4FF 40%, #DBEAFE 100%)",
        fontFamily: "var(--font-sans), sans-serif",
        color: "#1E293B",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <DotPattern width={32} height={32} cr={1.5} />

      {/* Sticky Navigation Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 40px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.8)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "14px",
                background: "#1E293B",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              }}
            >
              🎼
            </div>
            <span
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: 26,
                fontWeight: 700,
                color: "#0F172A",
                letterSpacing: "-0.02em",
              }}
            >
              Maestro
            </span>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: 32, fontSize: 14, fontWeight: 600, color: "#475569" }}>
            <a href="#features" style={{ color: "inherit", textDecoration: "none" }}>Bento Features</a>
            <a href="#architecture" style={{ color: "inherit", textDecoration: "none" }}>Deep Architecture</a>
            <a href="#adrs" style={{ color: "inherit", textDecoration: "none" }}>Decision Log (ADRs)</a>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {user ? (
              <Link href="/app" style={{ textDecoration: "none" }}>
                <ShimmerButton background="#6366F1">
                  Open Maestro Workbench →
                </ShimmerButton>
              </Link>
            ) : (
              <>
                <Link
                  href="/auth"
                  style={{
                    color: "#334155",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                    padding: "8px 16px",
                  }}
                >
                  Sign In
                </Link>
                <Link href="/auth" style={{ textDecoration: "none" }}>
                  <ShimmerButton background="#1E293B">
                    Get Started →
                  </ShimmerButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          maxWidth: 1100,
          margin: "40px auto 60px auto",
          textAlign: "center",
          padding: "0 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            borderRadius: "30px",
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.9)",
            fontSize: 13,
            fontWeight: 700,
            color: "#6366F1",
            boxShadow: "0 4px 16px rgba(99, 102, 241, 0.1)",
          }}
        >
          <span>✨</span> Powered by Rust Core Policy Engine & Polyglot REPL
        </div>

        <h1
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: "4.2rem",
            fontWeight: 400,
            lineHeight: 1.1,
            color: "#0F172A",
            letterSpacing: "-0.03em",
            maxWidth: 950,
            margin: 0,
          }}
        >
          Orchestrate Autonomous AI Agents with Mechanical Precision.
        </h1>

        <p
          style={{
            fontSize: 19,
            color: "#475569",
            maxWidth: 720,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Maestro decomposes high-level instructions over a 5-microservice architecture: Python state machine, Go MCP tool gateway, Rust solver engine, and Next.js flight recorder.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
          <Link href="/auth" style={{ textDecoration: "none" }}>
            <ShimmerButton background="#1E293B" style={{ padding: "16px 36px", fontSize: 16 }}>
              Launch Maestro Workbench →
            </ShimmerButton>
          </Link>
          <button
            onClick={() => {
              guestLogin();
              window.location.href = "/app";
            }}
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              color: "#334155",
              padding: "16px 28px",
              borderRadius: "40px",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
            }}
          >
            ⚡ 1-Click Judge Demo Login
          </button>
        </div>

        {/* Live Metrics Counter Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            marginTop: 24,
            padding: "16px 32px",
            background: "rgba(255, 255, 255, 0.65)",
            backdropFilter: "blur(20px)",
            borderRadius: 30,
            border: "1px solid rgba(255,255,255,0.8)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, color: "#1E293B" }}>
              <NumberTicker value={85} suffix="%" />
            </div>
            <div style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>Deterministic Policy Pass Rate</div>
          </div>
          <div style={{ width: 1, height: 28, background: "rgba(0,0,0,0.08)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, color: "#6366F1" }}>
              <NumberTicker value={5} prefix="<" suffix="ms" />
            </div>
            <div style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>Rust Guardrail Check Latency</div>
          </div>
          <div style={{ width: 1, height: 28, background: "rgba(0,0,0,0.08)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, color: "#10B981" }}>
              <NumberTicker value={100} suffix="%" />
            </div>
            <div style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>Replayable Decision Traces</div>
          </div>
        </div>
      </section>

      {/* Bento Grid Showcase Section */}
      <section
        id="features"
        style={{
          maxWidth: 1200,
          margin: "0 auto 80px auto",
          padding: "0 20px",
          width: "100%",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#6366F1", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Core Capabilities
          </span>
          <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 36, color: "#0F172A", marginTop: 4 }}>
            Designed for Industrial Multi-Agent Execution
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {/* Bento Card 1: Rust Policy Engine */}
          <div
            style={{
              position: "relative",
              background: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderRadius: 24,
              padding: 32,
              boxShadow: "0 10px 35px rgba(0,0,0,0.04)",
              border: "1px solid rgba(255, 255, 255, 0.9)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              overflow: "hidden",
            }}
          >
            <BorderBeam colorFrom="#F59E0B" colorTo="#EF4444" duration={8} />
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              🛡️
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0 }}>Rust Policy Engine</h3>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>
              Hard-coded budget ceiling rules & 3-tier permission checks (<code style={{ fontFamily: "var(--font-mono)", background: "#FEF3C7", padding: "2px 6px", borderRadius: 4 }}>read_only</code>, <code style={{ fontFamily: "var(--font-mono)", background: "#FEF3C7", padding: "2px 6px", borderRadius: 4 }}>reversible</code>, <code style={{ fontFamily: "var(--font-mono)", background: "#FEF3C7", padding: "2px 6px", borderRadius: 4 }}>irreversible</code>). Zero model jailbreaks can breach budget limits.
            </p>
          </div>

          {/* Bento Card 2: Polyglot REPL */}
          <div
            style={{
              position: "relative",
              background: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderRadius: 24,
              padding: 32,
              boxShadow: "0 10px 35px rgba(0,0,0,0.04)",
              border: "1px solid rgba(255, 255, 255, 0.9)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              overflow: "hidden",
            }}
          >
            <BorderBeam colorFrom="#6366F1" colorTo="#3B82F6" duration={7} />
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "#E0E7FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              💻
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0 }}>Polyglot Code Executor</h3>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>
              Native execution engine for Python, JavaScript (Node.js), and Bash. Captures stdout/stderr, execution duration, and outputs copyable syntax-highlighted code blocks.
            </p>
          </div>

          {/* Bento Card 3: Agentic Commerce Protocol (ACP) */}
          <div
            style={{
              position: "relative",
              background: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderRadius: 24,
              padding: 32,
              boxShadow: "0 10px 35px rgba(0,0,0,0.04)",
              border: "1px solid rgba(255, 255, 255, 0.9)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              overflow: "hidden",
            }}
          >
            <BorderBeam colorFrom="#10B981" colorTo="#059669" duration={9} />
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              💳
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0 }}>Agentic Commerce (ACP)</h3>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>
              Authorizes scoped <code style={{ fontFamily: "var(--font-mono)", background: "#D1FAE5", padding: "2px 6px", borderRadius: 4 }}>SharedPaymentTokens</code> (`acp_spt_...`) linked to your bank account (<code style={{ fontFamily: "var(--font-mono)", background: "#D1FAE5", padding: "2px 6px", borderRadius: 4 }}>•••• 3107</code>) with instant booking receipts.
            </p>
          </div>
        </div>
      </section>

      {/* Deep Architecture Exploration Section */}
      <section
        id="architecture"
        style={{
          maxWidth: 1200,
          margin: "0 auto 80px auto",
          padding: "0 20px",
          width: "100%",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: 28,
            padding: 40,
            border: "1px solid rgba(255, 255, 255, 0.95)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#6366F1", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Technical Specification
            </span>
            <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 34, color: "#0F172A", marginTop: 4, margin: 0 }}>
              Maestro System Architecture & Decision Log
            </h2>
          </div>

          {/* Architecture Tabs */}
          <div style={{ display: "flex", gap: 10, borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: 12 }}>
            {[
              { id: "system", label: "5-Microservice System Topology" },
              { id: "fsm", label: "Explicit 6-State Machine" },
              { id: "adrs", label: "Architectural Decision Records (ADRs 1–4)" },
              { id: "policy", label: "Rust Guardrails & Multi-Objective Solver" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: activeTab === tab.id ? "#1E293B" : "transparent",
                  color: activeTab === tab.id ? "#FFFFFF" : "#64748B",
                  border: "none",
                  borderRadius: 20,
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 150ms ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content 1: System Topology */}
          {activeTab === "system" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <pre
                style={{
                  background: "#0F172A",
                  color: "#38BDF8",
                  padding: 24,
                  borderRadius: 16,
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  overflowX: "auto",
                  lineHeight: 1.5,
                  boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)",
                }}
              >
{`┌─────────────────────────────────────────────────────────────────────────────┐
│  Next.js 14 Frontend (:3000)                                                │
│  - Flight Recorder Decision Trace UI  - Human-in-the-Loop Approval Modals    │
└──────────────────────┬──────────────────────────────────────────────────────┘
                       │ REST / WebSockets
┌──────────────────────▼──────────────────────────────────────────────────────┐
│  Python FastAPI Planner Service (:8000)                                      │
│  - Hand-rolled explicit State Machine  - LLM Tool Calling (Groq/Gemini/OR)  │
└───────────────────┬──────────────────────────────────┬──────────────────────┘
                    │                                  │
┌───────────────────▼──────────────────┐   ┌───────────▼──────────────────────┐
│  Go Tool Gateway (:8080)             │   │  Rust Policy & Solver Core (:8090)│
│  - Concurrent Goroutines API Fan-out │   │  - Budget Ceiling Hard-Block     │
│  - MCP Server Tool Exposure          │   │  - Multi-Objective Weighted Score│
│  - Circuit Breaker & Fallback Cache  │   └──────────────────────────────────┘
└───────────────────┬──────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────────────────────────┐
│  Real Live REST APIs: Open-Meteo (Weather), Nager.Date (Holidays),          │
│  Frankfurter (Currency Rates), ACP Payment Token Simulation                 │
└─────────────────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: "auto",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          padding: "28px 40px",
          textAlign: "center",
          fontSize: 13,
          color: "#64748B",
          position: "relative",
          zIndex: 10,
        }}
      >
        Maestro Platform v2026.4 • Powered by Next.js 14, FastAPI, Go 1.23, Rust 1.85, and Postgres 16.
      </footer>
    </div>
  );
}
