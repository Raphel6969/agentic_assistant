"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const { user, guestLogin } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #D4E7FE 0%, #EBF4FF 50%, #DBEAFE 100%)",
        fontFamily: "'Inter', sans-serif",
        color: "#1E293B",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navigation Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 40px",
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "12px",
              background: "#1E293B",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            🎼
          </div>
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 24,
              fontWeight: 700,
              color: "#0F172A",
              letterSpacing: "-0.02em",
            }}
          >
            Maestro
          </span>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 14, fontWeight: 500, color: "#475569" }}>
          <a href="#features" style={{ color: "inherit", textDecoration: "none" }}>Features</a>
          <a href="#architecture" style={{ color: "inherit", textDecoration: "none" }}>Architecture</a>
          <a href="#demo" style={{ color: "inherit", textDecoration: "none" }}>Interactive Demo</a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {user ? (
            <Link
              href="/app"
              style={{
                background: "#6366F1",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "30px",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.3)",
              }}
            >
              Open Workbench →
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
              <Link
                href="/auth"
                style={{
                  background: "#1E293B",
                  color: "#fff",
                  padding: "10px 22px",
                  borderRadius: "30px",
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                }}
              >
                Get Started →
              </Link>
            </>
          )}
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
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: "30px",
            background: "rgba(255, 255, 255, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.9)",
            fontSize: 13,
            fontWeight: 600,
            color: "#6366F1",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          <span>✨</span> Autonomous Multi-Agent Orchestrator Platform
        </div>

        <h1
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "3.8rem",
            fontWeight: 400,
            lineHeight: 1.1,
            color: "#0F172A",
            letterSpacing: "-0.03em",
            maxWidth: 900,
          }}
        >
          Orchestrate Autonomous AI Agents with Mechanical Precision.
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "#475569",
            maxWidth: 680,
            lineHeight: 1.6,
          }}
        >
          Maestro decomposes high-level instructions into deterministic sub-tasks over a Rust policy engine, polyglot REPL, replayable flight recorder trace, and Agentic Commerce Protocol.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
          <Link
            href="/auth"
            style={{
              background: "#1E293B",
              color: "#fff",
              padding: "16px 36px",
              borderRadius: "40px",
              fontWeight: 700,
              fontSize: 16,
              textDecoration: "none",
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.2)",
            }}
          >
            Launch Maestro Workbench →
          </Link>
          <button
            onClick={() => {
              guestLogin();
              window.location.href = "/app";
            }}
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              border: "1px solid rgba(0, 0, 0, 0.1)",
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
      </section>

      {/* Bento Grid Showcase Section */}
      <section
        id="features"
        style={{
          maxWidth: 1200,
          margin: "0 auto 80px auto",
          padding: "0 20px",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 32, color: "#0F172A" }}>
            Engineered for Industrial-Grade Agentic Workflows
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {/* Card 1: Rust Policy Engine */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 24,
              padding: 30,
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              🛡️
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>Rust Policy Engine</h3>
            <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>
              Hard-coded budget ceiling enforcement and approval gating in Rust. Zero model jailbreaks can breach your budget ceiling.
            </p>
          </div>

          {/* Card 2: Polyglot REPL */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 24,
              padding: 30,
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "#E0E7FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              💻
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>Polyglot Code Executor</h3>
            <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>
              Execute Python, JavaScript (Node.js), and Bash scripts with real-time stdout capture, execution metrics, and copyable code blocks.
            </p>
          </div>

          {/* Card 3: Agentic Commerce (ACP) */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 24,
              padding: 30,
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              💳
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>Agentic Commerce (ACP)</h3>
            <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>
              Authorizes scoped SharedPaymentTokens (`acp_spt_...`) linked to your bank account (`•••• 3107`) with instant booking receipts.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: "auto",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          padding: "24px 40px",
          textAlign: "center",
          fontSize: 13,
          color: "#64748B",
        }}
      >
        Maestro Platform v2026.4 • Built with Next.js, FastAPI, Go, and Rust.
      </footer>
    </div>
  );
}
