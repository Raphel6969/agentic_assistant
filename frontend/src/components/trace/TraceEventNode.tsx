"use client";

import React from "react";
import type { TraceEvent } from "@/lib/types";

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
  let accentColor = "var(--color-indigo)";
  let badgeLabel = "PLAN";
  let icon = "🗺️";

  switch (event.type) {
    case "plan_step":
      accentColor = "var(--color-indigo)";
      badgeLabel = "PLANNING";
      icon = "🗺️";
      break;
    case "tool_call":
      accentColor = "var(--color-emerald)";
      badgeLabel = "TOOL CALL";
      icon = "⚡";
      break;
    case "guardrail_check":
      accentColor = "var(--color-amber)";
      badgeLabel = "GUARDRAIL";
      icon = "🛡️";
      break;
    case "human_approval":
      accentColor = "var(--color-orange)";
      badgeLabel = "APPROVAL REQUIRED";
      icon = "👤";
      break;
    case "error":
    case "fallback":
      accentColor = "var(--color-rose)";
      badgeLabel = event.type.toUpperCase();
      icon = "✕";
      break;
  }

  const timeStr = new Date(event.timestamp).toLocaleTimeString();

  return (
    <div
      onClick={() => onSelect(event)}
      className="glass trace-slide-in card-interactive"
      style={{
        padding: "14px 18px",
        borderRadius: "var(--radius-md)",
        borderLeft: `4px solid ${accentColor}`,
        background: isSelected ? "rgba(255,255,255,0.07)" : "var(--glass-bg)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span>{icon}</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: accentColor,
              letterSpacing: "0.05em",
            }}
          >
            {badgeLabel}
          </span>
          {event.tool && (
            <span
              style={{
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                background: "rgba(255,255,255,0.06)",
                padding: "2px 6px",
                borderRadius: "var(--radius-sm)",
                color: "#fff",
              }}
            >
              {event.tool}
            </span>
          )}
        </div>
        <span style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
          {timeStr}
        </span>
      </div>

      {event.reasoning && (
        <div style={{ fontSize: 13, color: "var(--color-text-primary)" }}>{event.reasoning}</div>
      )}

      {/* Output / Metadata indicators */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
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
                  ? "var(--color-emerald)"
                  : event.guardrail_result === "blocked"
                  ? "var(--color-rose)"
                  : "var(--color-amber)",
              fontWeight: 600,
            }}
          >
            guardrail: {event.guardrail_result.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};
