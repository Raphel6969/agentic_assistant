"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { DotPattern } from "@/components/magicui/DotPattern";
import { ShimmerButton } from "@/components/magicui/ShimmerButton";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { NumberTicker } from "@/components/magicui/NumberTicker";
import { OrcheonArchitectureDiagram } from "@/components/workbench/OrcheonArchitectureDiagram";
import { DemoNoticeModal } from "@/components/modals/DemoNoticeModal";

export default function LandingPage() {
  const { user, guestLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [activeArchTab, setActiveArchTab] = useState<"visual" | "fsm" | "adrs" | "policy">("visual");
  const [showDemoNotice, setShowDemoNotice] = useState(false);

  const handleProceedToDemo = () => {
    setShowDemoNotice(false);
    guestLogin();
    window.location.href = "/app";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(180deg, #0F172A 0%, #1E293B 40%, #0A0E17 100%)"
          : "linear-gradient(180deg, #D4E7FE 0%, #EBF4FF 40%, #DBEAFE 100%)",
        fontFamily: "var(--font-sans), sans-serif",
        color: isDark ? "#F8FAFC" : "#1E293B",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflowX: "hidden",
        transition: "background 200ms ease, color 200ms ease",
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
          background: isDark ? "rgba(15, 23, 42, 0.88)" : "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.9)",
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
                background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: 26,
                fontWeight: 700,
                color: isDark ? "#F8FAFC" : "#0F172A",
                letterSpacing: "-0.02em",
              }}
            >
              Orcheon
            </span>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: 32, fontSize: 14, fontWeight: 600, color: isDark ? "#94A3B8" : "#475569" }}>
            <a href="#overview" style={{ color: "inherit", textDecoration: "none" }}>Platform Overview</a>
            <a href="#features" style={{ color: "inherit", textDecoration: "none" }}>Core Architecture</a>
            <a href="#architecture" style={{ color: "inherit", textDecoration: "none" }}>Topology & ADRs</a>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
              style={{
                background: isDark ? "#334155" : "#FFFFFF",
                border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid #E2E8F0",
                color: isDark ? "#F8FAFC" : "#0F172A",
                padding: "8px 14px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 180ms ease",
              }}
            >
              {isDark ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                  <span>Light</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                  <span>Dark</span>
                </>
              )}
            </button>

            {user ? (
              <Link href="/app" style={{ textDecoration: "none" }}>
                <ShimmerButton background="#6366F1">
                  Open Orcheon Workbench →
                </ShimmerButton>
              </Link>
            ) : (
              <>
                <Link
                  href="/auth"
                  style={{
                    color: isDark ? "#CBD5E1" : "#334155",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                    padding: "8px 16px",
                  }}
                >
                  Sign In
                </Link>
                <button
                  onClick={() => setShowDemoNotice(true)}
                  style={{
                    background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: 20,
                    padding: "10px 20px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Get Started →
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          maxWidth: 1120,
          margin: "48px auto 60px auto",
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
            background: isDark ? "rgba(30, 41, 59, 0.85)" : "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px)",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(255, 255, 255, 0.95)",
            fontSize: 13,
            fontWeight: 700,
            color: "#6366F1",
            boxShadow: "0 4px 16px rgba(99, 102, 241, 0.12)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Powered by Rust Core Policy Engine, Agentic Commerce (ACP) & Polyglot REPL
        </div>

        <h1
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: "4.2rem",
            fontWeight: 400,
            lineHeight: 1.1,
            color: isDark ? "#F8FAFC" : "#0F172A",
            letterSpacing: "-0.03em",
            maxWidth: 980,
            margin: 0,
          }}
        >
          Orchestrate Autonomous Multi-Agent Workflows with Uncompromising Mechanical Guardrails.
        </h1>

        <p
          style={{
            fontSize: 19,
            color: isDark ? "#94A3B8" : "#475569",
            maxWidth: 780,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Orcheon is a next-generation autonomous AI agent system that decomposes high-level human instructions into deterministic sub-tasks across a 5-microservice architecture: Python state machine, Go MCP tool gateway, Rust policy solver engine, and Next.js flight recorder.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
          <button
            onClick={() => setShowDemoNotice(true)}
            style={{
              background: isDark ? "#334155" : "#1E293B",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "40px",
              padding: "16px 36px",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Launch Orcheon Workbench →
          </button>
          <button
            onClick={() => setShowDemoNotice(true)}
            style={{
              background: isDark ? "rgba(30, 41, 59, 0.9)" : "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              border: isDark ? "1.5px solid rgba(255,255,255,0.12)" : "1.5px solid #E2E8F0",
              color: isDark ? "#F8FAFC" : "#334155",
              padding: "16px 28px",
              borderRadius: "40px",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            1-Click Demo Login
          </button>
        </div>

        {/* Live Metrics Counter Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            marginTop: 24,
            padding: "18px 36px",
            background: isDark ? "rgba(30, 41, 59, 0.85)" : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            borderRadius: 30,
            border: isDark ? "1.5px solid rgba(255, 255, 255, 0.12)" : "1.5px solid #E2E8F0",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, color: isDark ? "#F8FAFC" : "#0F172A", fontWeight: 800 }}>
              <NumberTicker value={85} suffix="%" />
            </div>
            <div style={{ fontSize: 12, color: isDark ? "#94A3B8" : "#64748B", fontWeight: 600 }}>Deterministic Policy Pass Rate</div>
          </div>
          <div style={{ width: 1, height: 28, background: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, color: "#6366F1", fontWeight: 800 }}>
              <NumberTicker value={5} prefix="<" suffix="ms" />
            </div>
            <div style={{ fontSize: 12, color: isDark ? "#94A3B8" : "#64748B", fontWeight: 600 }}>Rust Guardrail Latency</div>
          </div>
          <div style={{ width: 1, height: 28, background: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, color: "#10B981", fontWeight: 800 }}>
              <NumberTicker value={100} suffix="%" />
            </div>
            <div style={{ fontSize: 12, color: isDark ? "#94A3B8" : "#64748B", fontWeight: 600 }}>Replayable Decision Traces</div>
          </div>
        </div>
      </section>

      {/* Overview Section: Detailed Explanatory Text & Technical Blueprint */}
      <section
        id="overview"
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
            background: isDark ? "#1E293B" : "#FFFFFF",
            borderRadius: 28,
            padding: 44,
            border: isDark ? "1.5px solid rgba(255,255,255,0.12)" : "1.5px solid #E2E8F0",
            boxShadow: "0 16px 45px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#6366F1", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Deep Dive & Project Intent
            </span>
            <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 36, color: isDark ? "#F8FAFC" : "#0F172A", marginTop: 4, margin: 0 }}>
              What is Orcheon?
            </h2>
          </div>

          <div style={{ fontSize: 15, color: isDark ? "#CBD5E1" : "#334155", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ margin: 0 }}>
              <strong>Orcheon</strong> is built to solve the fundamental unreliability of autonomous LLM agents in production environments. Most current agent frameworks rely on unstructured single-prompt loops that suffer from non-deterministic behavior, budget overruns, silent tool hallucinations, and unverified side effects.
            </p>
            <p style={{ margin: 0 }}>
              Orcheon introduces a <strong>mechanically enforced control plane</strong>. Instead of letting the LLM directly execute side-effecting operations (such as making real payments or executing shell code), Orcheon passes every sub-task through an explicit 6-State FSM, a memory-safe Rust Policy Engine, and an Agentic Commerce Protocol (ACP) before any action is executed.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginTop: 10 }}>
            <div style={{ background: isDark ? "#0F172A" : "#F8FAFC", padding: 24, borderRadius: 20, border: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                1. Multi-Agent Task Decomposition
              </div>
              <p style={{ fontSize: 13, color: isDark ? "#94A3B8" : "#64748B", margin: 0, lineHeight: 1.6 }}>
                High-level instructions (e.g. &quot;Plan a trip to Paris under $800&quot;) are broken down into discrete sub-task steps. Each step executes in its own isolated thread context with clean input/output state tracking.
              </p>
            </div>

            <div style={{ background: isDark ? "#0F172A" : "#F8FAFC", padding: 24, borderRadius: 20, border: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                2. Rust Hard-Boundary Policy Engine
              </div>
              <p style={{ fontSize: 13, color: isDark ? "#94A3B8" : "#64748B", margin: 0, lineHeight: 1.6 }}>
                Enforces strict budget ceilings ($50 - $5000) and permission levels (<code style={{ fontFamily: "var(--font-mono)", background: isDark ? "#334155" : "#E2E8F0", padding: "1px 5px", borderRadius: 4 }}>read_only</code>, <code style={{ fontFamily: "var(--font-mono)", background: isDark ? "#334155" : "#E2E8F0", padding: "1px 5px", borderRadius: 4 }}>reversible</code>, <code style={{ fontFamily: "var(--font-mono)", background: isDark ? "#334155" : "#E2E8F0", padding: "1px 5px", borderRadius: 4 }}>irreversible</code>). Zero LLM jailbreaks can bypass budget ceilings.
              </p>
            </div>

            <div style={{ background: isDark ? "#0F172A" : "#F8FAFC", padding: 24, borderRadius: 20, border: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                3. Agentic Commerce Protocol (ACP)
              </div>
              <p style={{ fontSize: 13, color: isDark ? "#94A3B8" : "#64748B", margin: 0, lineHeight: 1.6 }}>
                Authorizes scoped <code style={{ fontFamily: "var(--font-mono)", background: isDark ? "#334155" : "#E2E8F0", padding: "1px 5px", borderRadius: 4 }}>SharedPaymentTokens</code> (`acp_spt_...`) tied to linked checking accounts (`Chase **** 4892`) with real-time ACP bank modals and 2FA authentication flows.
              </p>
            </div>

            <div style={{ background: isDark ? "#0F172A" : "#F8FAFC", padding: 24, borderRadius: 20, border: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                4. Polyglot REPL & Live API Ecosystem
              </div>
              <p style={{ fontSize: 13, color: isDark ? "#94A3B8" : "#64748B", margin: 0, lineHeight: 1.6 }}>
                Native execution engine for Python and Node.js. Integrates with real-world unauthenticated APIs: Open-Meteo Weather, Nager.Date Calendar, and Frankfurter Currency Exchange.
              </p>
            </div>
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
          <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 36, color: isDark ? "#F8FAFC" : "#0F172A", marginTop: 4 }}>
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
              background: isDark ? "#1E293B" : "#FFFFFF",
              borderRadius: 24,
              padding: 32,
              boxShadow: "0 10px 35px rgba(0,0,0,0.04)",
              border: isDark ? "1.5px solid rgba(255,255,255,0.12)" : "1.5px solid #E2E8F0",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              overflow: "hidden",
            }}
          >
            <BorderBeam colorFrom="#F59E0B" colorTo="#EF4444" duration={8} />
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A", margin: 0 }}>Rust Policy Engine</h3>
            <p style={{ fontSize: 14, color: isDark ? "#94A3B8" : "#475569", lineHeight: 1.6, margin: 0 }}>
              Hard-coded budget ceiling rules & 3-tier permission checks (<code style={{ fontFamily: "var(--font-mono)", background: isDark ? "#334155" : "#FEF3C7", padding: "2px 6px", borderRadius: 4 }}>read_only</code>, <code style={{ fontFamily: "var(--font-mono)", background: isDark ? "#334155" : "#FEF3C7", padding: "2px 6px", borderRadius: 4 }}>reversible</code>, <code style={{ fontFamily: "var(--font-mono)", background: isDark ? "#334155" : "#FEF3C7", padding: "2px 6px", borderRadius: 4 }}>irreversible</code>). Zero model jailbreaks can breach budget limits.
            </p>
          </div>

          {/* Bento Card 2: Polyglot REPL */}
          <div
            style={{
              position: "relative",
              background: isDark ? "#1E293B" : "#FFFFFF",
              borderRadius: 24,
              padding: 32,
              boxShadow: "0 10px 35px rgba(0,0,0,0.04)",
              border: isDark ? "1.5px solid rgba(255,255,255,0.12)" : "1.5px solid #E2E8F0",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              overflow: "hidden",
            }}
          >
            <BorderBeam colorFrom="#6366F1" colorTo="#3B82F6" duration={7} />
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A", margin: 0 }}>Polyglot Code Executor</h3>
            <p style={{ fontSize: 14, color: isDark ? "#94A3B8" : "#475569", lineHeight: 1.6, margin: 0 }}>
              Native execution engine for Python, JavaScript (Node.js), and Bash. Captures stdout/stderr, execution duration, and outputs copyable syntax-highlighted code blocks.
            </p>
          </div>

          {/* Bento Card 3: Agentic Commerce Protocol (ACP) */}
          <div
            style={{
              position: "relative",
              background: isDark ? "#1E293B" : "#FFFFFF",
              borderRadius: 24,
              padding: 32,
              boxShadow: "0 10px 35px rgba(0,0,0,0.04)",
              border: isDark ? "1.5px solid rgba(255,255,255,0.12)" : "1.5px solid #E2E8F0",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              overflow: "hidden",
            }}
          >
            <BorderBeam colorFrom="#10B981" colorTo="#059669" duration={9} />
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A", margin: 0 }}>Agentic Commerce (ACP)</h3>
            <p style={{ fontSize: 14, color: isDark ? "#94A3B8" : "#475569", lineHeight: 1.6, margin: 0 }}>
              Authorizes scoped <code style={{ fontFamily: "var(--font-mono)", background: isDark ? "#334155" : "#D1FAE5", padding: "2px 6px", borderRadius: 4 }}>SharedPaymentTokens</code> (`acp_spt_...`) linked to your bank account (<code style={{ fontFamily: "var(--font-mono)", background: isDark ? "#334155" : "#D1FAE5", padding: "2px 6px", borderRadius: 4 }}>•••• 4892</code>) with instant booking receipts.
            </p>
          </div>
        </div>
      </section>

      {/* Deep Architecture Exploration Section with Visual Component */}
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
            background: isDark ? "#1E293B" : "#FFFFFF",
            borderRadius: 28,
            padding: 40,
            border: isDark ? "1.5px solid rgba(255,255,255,0.12)" : "1.5px solid #E2E8F0",
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
            <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 34, color: isDark ? "#F8FAFC" : "#0F172A", marginTop: 4, margin: 0 }}>
              Orcheon System Architecture & Decision Log
            </h2>
          </div>

          {/* Architecture Tabs */}
          <div style={{ display: "flex", gap: 10, borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)", paddingBottom: 12 }}>
            {[
              { id: "visual", label: "Visual System Microservice Map" },
              { id: "fsm", label: "Explicit 6-State Machine" },
              { id: "adrs", label: "Architectural Decision Records (ADRs 1–4)" },
              { id: "policy", label: "Rust Guardrails & Multi-Objective Solver" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveArchTab(tab.id as any)}
                style={{
                  background: activeArchTab === tab.id ? "#6366F1" : "transparent",
                  color: activeArchTab === tab.id ? "#FFFFFF" : isDark ? "#94A3B8" : "#64748B",
                  border: activeArchTab === tab.id ? "1px solid #6366F1" : isDark ? "1px solid #334155" : "1px solid #E2E8F0",
                  borderRadius: 20,
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: activeArchTab === tab.id ? "0 4px 14px rgba(99,102,241,0.25)" : "none",
                  transition: "all 150ms ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Architecture Tab 1: Visual Interactive Diagram Component */}
          {activeArchTab === "visual" && <OrcheonArchitectureDiagram />}

          {/* Architecture Tab 2: FSM Machine Details */}
          {activeArchTab === "fsm" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A", margin: 0 }}>
                Explicit 6-State Finite State Machine (FSM) Execution Flow
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                  { s: "1. INITIALIZING", d: "Loads user prompt, verifies budget parameter, seeds event trace record." },
                  { s: "2. GENERATE_PLAN", d: "LLM decomposes user request into ordered sub-task execution steps." },
                  { s: "3. SELECT_TOOL", d: "Identifies required tool invocation (search_flights, execute_code, check_calendar)." },
                  { s: "4. RUST_GUARDRAIL", d: "Evaluates policy ceiling in Rust <5ms. Blocks if budget or permission breached." },
                  { s: "5. GATEWAY_EXECUTE", d: "Go MCP Gateway dispatches tool request to target service/API concurrently." },
                  { s: "6. SYNTHESIZE", d: "Synthesizes human-friendly summary response and updates UI flight recorder." },
                ].map((item) => (
                  <div key={item.s} style={{ background: isDark ? "#0F172A" : "#F8FAFC", padding: 18, borderRadius: 16, border: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#6366F1", marginBottom: 6 }}>{item.s}</div>
                    <div style={{ fontSize: 12, color: isDark ? "#94A3B8" : "#475569" }}>{item.d}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Architecture Tab 3: Architectural Decision Records */}
          {activeArchTab === "adrs" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A", margin: 0 }}>
                Key Architectural Decision Records (ADRs)
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                {[
                  { id: "ADR-001", t: "Polyglot REPL Code Execution Engine", d: "Chosen over fixed tool wrappers to allow arbitrary algorithm execution in isolated sub-processes." },
                  { id: "ADR-002", t: "Agentic Commerce Protocol (ACP) Tokenization", d: "Decoupled card credentials into single-use cryptographic payment tokens scoped to exact transaction bounds." },
                  { id: "ADR-003", t: "Rust Policy Engine for Hard-Boundary Verification", d: "Offloaded guardrail logic from LLM prompt space to a compiled Rust core for zero-jailbreak guarantees." },
                  { id: "ADR-004", t: "Go MCP Tool Gateway for Concurrent Fan-Out", d: "Leverages Go goroutines to parallelize multi-tool API requests with circuit breakers and fallback caching." },
                ].map((adr) => (
                  <div key={adr.id} style={{ background: isDark ? "#0F172A" : "#F8FAFC", padding: 18, borderRadius: 16, border: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#10B981", fontFamily: "var(--font-mono)", marginBottom: 4 }}>{adr.id}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A", marginBottom: 6 }}>{adr.t}</div>
                    <div style={{ fontSize: 12, color: isDark ? "#94A3B8" : "#475569" }}>{adr.d}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Architecture Tab 4: Policy & Solver Details */}
          {activeArchTab === "policy" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A", margin: 0 }}>
                Rust Guardrails & Multi-Objective Ranking Math
              </h4>
              <p style={{ fontSize: 13, color: isDark ? "#94A3B8" : "#475569", margin: 0 }}>
                The Rust solver ranks options by minimizing a weighted multi-objective cost function:
              </p>
              <div style={{ background: isDark ? "#0F172A" : "#F8FAFC", border: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0", color: "#6366F1", padding: "18px 24px", borderRadius: 16, fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700 }}>
                Score = (Price / Budget) * 0.50 + (Duration_Hours / 24) * 0.30 + (1.0 - Rating / 5.0) * 0.20
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: "auto",
          borderTop: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
          padding: "28px 40px",
          textAlign: "center",
          fontSize: 13,
          color: isDark ? "#94A3B8" : "#64748B",
          position: "relative",
          zIndex: 10,
        }}
      >
        Orcheon Autonomous Multi-Agent Platform v2026.4 • Powered by Next.js 14, FastAPI, Go 1.23, Rust 1.85, and PostgreSQL 16.
      </footer>

      {/* Demo API Disclaimer Modal */}
      <DemoNoticeModal
        isOpen={showDemoNotice}
        onClose={() => setShowDemoNotice(false)}
        onProceed={handleProceedToDemo}
      />
    </div>
  );
}
