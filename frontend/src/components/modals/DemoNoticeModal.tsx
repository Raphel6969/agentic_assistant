"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

interface DemoNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export const DemoNoticeModal: React.FC<DemoNoticeModalProps> = ({
  isOpen,
  onClose,
  onProceed,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: isDark ? "#1E293B" : "#FFFFFF",
          color: isDark ? "#F8FAFC" : "#0F172A",
          borderRadius: 24,
          padding: 32,
          width: "100%",
          maxWidth: 540,
          boxShadow: isDark ? "0 24px 80px rgba(0,0,0,0.6)" : "0 24px 80px rgba(0,0,0,0.18)",
          border: isDark ? "1.5px solid rgba(255,255,255,0.12)" : "1.5px solid #E2E8F0",
          position: "relative",
          fontFamily: "var(--font-sans), sans-serif",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: isDark ? "#334155" : "#F1F5F9",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            cursor: "pointer",
            fontSize: 16,
            fontWeight: 700,
            color: isDark ? "#94A3B8" : "#64748B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>

        {/* Modal Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "rgba(99,102,241,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6366F1",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 style={{ fontSize: 19, fontWeight: 700, margin: 0, color: isDark ? "#F8FAFC" : "#0F172A" }}>
                Production Readiness & API Notice
              </h2>
            </div>
            <span style={{ fontSize: 12, color: isDark ? "#94A3B8" : "#64748B" }}>
              Architectural note regarding live APIs vs Sandbox Mocks
            </span>
          </div>
        </div>

        {/* Informative Body Text */}
        <div style={{ fontSize: 13, lineHeight: 1.6, color: isDark ? "#CBD5E1" : "#334155", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: isDark ? "rgba(99,102,241,0.12)" : "#F0F4FF", padding: 14, borderRadius: 14, border: "1px solid rgba(99,102,241,0.2)" }}>
            <strong style={{ color: "#6366F1", display: "block", marginBottom: 4 }}>
              ⚡ Enterprise API Integration Note:
            </strong>
            Production GDS flight booking APIs (Amadeus, Sabre, Skyscanner) and enterprise LLM endpoints require paid credentials and formal SLA agreements.
          </div>

          <p style={{ margin: 0 }}>
            To allow <strong>instant, zero-latency evaluation</strong> for hackathon judges and reviewers, Orcheon operates on a hybrid architecture:
          </p>

          <ul style={{ paddingLeft: 20, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            <li>
              <strong>100% Live REST APIs</strong>: Real weather forecasts via <em>Open-Meteo API</em>, holiday calendars via <em>Nager.Date API</em>, and currency rates via <em>Frankfurter API</em>.
            </li>
            <li>
              <strong>Deterministic Mocks & Rust Policy Engine</strong>: Simulated flight and hotel booking responses scored in real-time by our Rust solver.
            </li>
          </ul>

          <div style={{ background: isDark ? "#0F172A" : "#F8FAFC", padding: 12, borderRadius: 12, border: isDark ? "1px solid #334155" : "1px solid #E2E8F0", fontFamily: "var(--font-mono)", fontSize: 11 }}>
            💡 <strong>Zero-Code Live Upgrade</strong>: Setting <code style={{ color: "#10B981" }}>AMADEUS_API_KEY</code> or <code style={{ color: "#10B981" }}>SKYSCANNER_API_KEY</code> in <code style={{ color: "#6366F1" }}>.env</code> instantly connects live production airline feeds with 0 code changes.
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onProceed}
          style={{
            background: "linear-gradient(135deg, #6366F1, #4F46E5)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 14,
            padding: "14px 0",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
          }}
        >
          Got It! Launch Orcheon Demo Workbench →
        </button>
      </div>
    </div>
  );
};
