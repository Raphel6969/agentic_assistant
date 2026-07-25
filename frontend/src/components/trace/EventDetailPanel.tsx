"use client";

import React from "react";
import type { TraceEvent } from "@/lib/types";

interface EventDetailPanelProps {
  event: TraceEvent | null;
  onClose: () => void;
}

export const EventDetailPanel: React.FC<EventDetailPanelProps> = ({
  event,
  onClose,
}) => {
  if (!event) return null;

  return (
    <aside
      className="glass"
      style={{
        position: "fixed",
        right: 0,
        top: "var(--header-height)",
        bottom: "var(--input-bar-height)",
        width: "var(--detail-width)",
        borderLeft: "var(--glass-border)",
        background: "rgba(10, 10, 15, 0.95)",
        zIndex: 20,
        padding: 20,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h4 style={{ fontSize: 13, textTransform: "uppercase", color: "var(--color-text-muted)" }}>
          Event Inspector
        </h4>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--color-text-muted)",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ borderBottom: "var(--glass-border)", pb: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
          {event.type.toUpperCase()}
          {event.tool && <span style={{ color: "var(--color-indigo)", marginLeft: 8 }}>• {event.tool}</span>}
        </div>
        <div style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
          ID: {event.event_id}
        </div>
      </div>

      {event.reasoning && (
        <div>
          <label style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Reasoning</label>
          <div style={{ fontSize: 13, color: "#fff", marginTop: 4, background: "rgba(255,255,255,0.04)", padding: 10, borderRadius: "var(--radius-sm)" }}>
            {event.reasoning}
          </div>
        </div>
      )}

      {event.input && (
        <div>
          <label style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Input Payload</label>
          <pre
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              background: "#050508",
              padding: 10,
              borderRadius: "var(--radius-sm)",
              overflowX: "auto",
              color: "var(--color-emerald)",
              marginTop: 4,
            }}
          >
            {JSON.stringify(event.input, null, 2)}
          </pre>
        </div>
      )}

      {event.output && (
        <div>
          <label style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Output Result</label>
          <pre
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              background: "#050508",
              padding: 10,
              borderRadius: "var(--radius-sm)",
              overflowX: "auto",
              color: "#60A5FA",
              marginTop: 4,
            }}
          >
            {JSON.stringify(event.output, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12, fontFamily: "var(--font-mono)", marginTop: "auto" }}>
        <div className="glass" style={{ padding: 8, borderRadius: "var(--radius-sm)" }}>
          <div style={{ color: "var(--color-text-muted)", fontSize: 10 }}>COST ESTIMATE</div>
          <div style={{ fontWeight: 600, color: "#fff" }}>${(event.cost_estimate || 0).toFixed(2)}</div>
        </div>
        <div className="glass" style={{ padding: 8, borderRadius: "var(--radius-sm)" }}>
          <div style={{ color: "var(--color-text-muted)", fontSize: 10 }}>LATENCY</div>
          <div style={{ fontWeight: 600, color: "#fff" }}>{event.latency_ms || 0}ms</div>
        </div>
      </div>
    </aside>
  );
};
