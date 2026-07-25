"use client";

import React from "react";
import type { TraceEvent } from "@/lib/types";
import { useTheme } from "@/context/ThemeContext";

interface TraceEventNodeProps {
  event: TraceEvent;
  isSelected: boolean;
  onSelect: (event: TraceEvent) => void;
}

export const TraceEventNode: React.FC<TraceEventNodeProps> = ({
  event,
  isSelected,
  onSelect,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  let accentColor = "#6366F1";
  let badgeLabel = "PLAN";
  let icon = "🗺️";

  switch (event.type) {
    case "plan_step":
      accentColor = "#6366F1";
      badgeLabel = "PLANNING";
      icon = "🗺️";
      break;
    case "tool_call":
      accentColor = "#10B981";
      badgeLabel = "TOOL CALL";
      icon = "⚡";
      break;
    case "guardrail_check":
      accentColor = "#F59E0B";
      badgeLabel = "GUARDRAIL";
      icon = "🛡️";
      break;
    case "human_approval":
      accentColor = "#F97316";
      badgeLabel = "APPROVAL REQUIRED";
      icon = "👤";
      break;
    case "error":
    case "fallback":
      accentColor = "#EF4444";
      badgeLabel = event.type.toUpperCase();
      icon = "✕";
      break;
  }

  const timeStr = new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div
      onClick={() => onSelect(event)}
      style={{
        padding: "12px 16px",
        borderRadius: 14,
        borderLeft: `4px solid ${accentColor}`,
        background: isSelected
          ? isDark
            ? "rgba(99,102,241,0.25)"
            : "rgba(99,102,241,0.1)"
          : isDark
          ? "#1E293B"
          : "#FFFFFF",
        borderTop: isDark ? "1px solid #334155" : "1px solid #E2E8F0",
        borderRight: isDark ? "1px solid #334155" : "1px solid #E2E8F0",
        borderBottom: isDark ? "1px solid #334155" : "1px solid #E2E8F0",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        cursor: "pointer",
        transition: "all 150ms ease",
        fontFamily: "var(--font-sans), sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14 }}>{icon}</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: accentColor,
              letterSpacing: "0.05em",
            }}
          >
            {badgeLabel}
          </span>
          {event.tool && (
            <span
              style={{
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                background: isDark ? "#334155" : "#F1F5F9",
                padding: "2px 8px",
                borderRadius: 6,
                color: isDark ? "#F8FAFC" : "#0F172A",
                fontWeight: 600,
              }}
            >
              {event.tool}
            </span>
          )}
        </div>
        <span style={{ fontSize: 11, color: isDark ? "#94A3B8" : "#64748B", fontFamily: "var(--font-mono)" }}>
          {timeStr}
        </span>
      </div>

      {event.reasoning && (
        <div style={{ fontSize: 13, color: isDark ? "#F8FAFC" : "#1E293B", fontWeight: 500, lineHeight: 1.5 }}>
          {event.reasoning}
        </div>
      )}

      {/* Output / Metadata indicators */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, color: isDark ? "#94A3B8" : "#64748B", fontFamily: "var(--font-mono)" }}>
        {event.cost_estimate !== null && event.cost_estimate !== undefined && (
          <span>cost: ${event.cost_estimate.toFixed(2)}</span>
        )}
        {event.latency_ms !== null && event.latency_ms !== undefined && event.latency_ms > 0 && (
          <span>latency: {event.latency_ms}ms</span>
        )}
        {event.guardrail_result && (
          <span
            style={{
              color:
                event.guardrail_result === "allowed"
                  ? "#10B981"
                  : event.guardrail_result === "blocked"
                  ? "#EF4444"
                  : "#F59E0B",
              fontWeight: 700,
            }}
          >
            guardrail: {event.guardrail_result.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};
