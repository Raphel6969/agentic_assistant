"use client";

import React from "react";
import type { TraceEvent } from "@/lib/types";
import { useTheme } from "@/context/ThemeContext";

interface EventDetailPanelProps {
  event: TraceEvent | null;
  onClose: () => void;
}

export const EventDetailPanel: React.FC<EventDetailPanelProps> = ({
  event,
  onClose,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!event) return null;

  return (
    <aside
      style={{
        position: "fixed",
        right: 24,
        top: 80,
        bottom: 24,
        width: 420,
        borderRadius: 24,
        border: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
        background: isDark ? "#1E293B" : "#FFFFFF",
        boxShadow: isDark ? "0 20px 60px rgba(0, 0, 0, 0.6)" : "0 20px 60px rgba(0, 0, 0, 0.12)",
        zIndex: 300,
        padding: 24,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        fontFamily: "var(--font-sans), sans-serif",
        color: isDark ? "#F8FAFC" : "#0F172A",
      }}
    >
      {/* Header Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h4 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#6366F1", margin: 0, letterSpacing: "0.06em" }}>
          Trace Event Inspector
        </h4>
        <button
          onClick={onClose}
          style={{
            background: isDark ? "#334155" : "#F1F5F9",
            border: "none",
            borderRadius: "50%",
            width: 28,
            height: 28,
            color: isDark ? "#CBD5E1" : "#64748B",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
      </div>

      {/* Event Title Block */}
      <div style={{ borderBottom: isDark ? "1px solid #334155" : "1px solid #E2E8F0", paddingBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: isDark ? "#F8FAFC" : "#0F172A" }}>
          {event.type.toUpperCase()}
          {event.tool && <span style={{ color: "#6366F1", marginLeft: 8 }}>• {event.tool}</span>}
        </div>
        <div style={{ fontSize: 11, color: isDark ? "#94A3B8" : "#64748B", fontFamily: "var(--font-mono)", marginTop: 4 }}>
          ID: {event.event_id}
        </div>
      </div>

      {/* Reasoning Block */}
      {event.reasoning && (
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: isDark ? "#94A3B8" : "#64748B", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
            Reasoning & Intent
          </label>
          <div
            style={{
              fontSize: 13,
              color: isDark ? "#F8FAFC" : "#0F172A",
              background: isDark ? "#0F172A" : "#F8FAFC",
              border: isDark ? "1px solid #334155" : "1.5px solid #E2E8F0",
              padding: 12,
              borderRadius: 12,
              lineHeight: 1.5,
            }}
          >
            {event.reasoning}
          </div>
        </div>
      )}

      {/* Input Payload JSON Block */}
      {event.input && (
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: isDark ? "#94A3B8" : "#64748B", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
            Input Payload
          </label>
          <pre
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              background: isDark ? "#0F172A" : "#F8FAFC",
              border: isDark ? "1px solid #334155" : "1.5px solid #E2E8F0",
              padding: 12,
              borderRadius: 12,
              overflowX: "auto",
              color: isDark ? "#34D399" : "#059669",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {JSON.stringify(event.input, null, 2)}
          </pre>
        </div>
      )}

      {/* Output Result JSON Block */}
      {event.output && (
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: isDark ? "#94A3B8" : "#64748B", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
            Output Result
          </label>
          <pre
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              background: isDark ? "#0F172A" : "#F8FAFC",
              border: isDark ? "1px solid #334155" : "1.5px solid #E2E8F0",
              padding: 12,
              borderRadius: 12,
              overflowX: "auto",
              color: isDark ? "#38BDF8" : "#2563EB",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {JSON.stringify(event.output, null, 2)}
          </pre>
        </div>
      )}

      {/* Cost & Latency Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12, fontFamily: "var(--font-mono)", marginTop: "auto", paddingTop: 10 }}>
        <div style={{ background: isDark ? "#0F172A" : "#F8FAFC", border: isDark ? "1px solid #334155" : "1.5px solid #E2E8F0", padding: 10, borderRadius: 12 }}>
          <div style={{ color: isDark ? "#94A3B8" : "#64748B", fontSize: 10, fontWeight: 700 }}>COST ESTIMATE</div>
          <div style={{ fontWeight: 800, color: isDark ? "#F8FAFC" : "#0F172A", marginTop: 2 }}>${(event.cost_estimate || 0).toFixed(2)}</div>
        </div>
        <div style={{ background: isDark ? "#0F172A" : "#F8FAFC", border: isDark ? "1px solid #334155" : "1.5px solid #E2E8F0", padding: 10, borderRadius: 12 }}>
          <div style={{ color: isDark ? "#94A3B8" : "#64748B", fontSize: 10, fontWeight: 700 }}>LATENCY</div>
          <div style={{ fontWeight: 800, color: isDark ? "#F8FAFC" : "#0F172A", marginTop: 2 }}>{event.latency_ms || 0}ms</div>
        </div>
      </div>
    </aside>
  );
};
