"use client";

import React from "react";
import type { Domain, Task } from "@/lib/types";
import { ConstraintSlider } from "@/components/solver/ConstraintSlider";

interface LeftSidebarProps {
  selectedDomain: Domain;
  onSelectDomain: (domain: Domain) => void;
  tasksHistory: Task[];
  onSelectTaskSession: (task: Task) => void;
  onOpenSettings: () => void;
  ragDocsCount: number;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  selectedDomain,
  onSelectDomain,
  tasksHistory,
  onSelectTaskSession,
  onOpenSettings,
  ragDocsCount,
}) => {
  const domains: { id: Domain; label: string; icon: string }[] = [
    { id: "trip", label: "Trip Planning", icon: "✈️" },
    { id: "scheduling", label: "Scheduling", icon: "📅" },
    { id: "research", label: "Price Research", icon: "🔍" },
  ];

  return (
    <aside
      className="glass"
      style={{
        gridRow: "2 / 3",
        borderRight: "var(--glass-border)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        overflowY: "auto",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h4 style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>
            Domain Mode
          </h4>
          <button
            onClick={onOpenSettings}
            title="Settings & Integrations"
            style={{ background: "none", border: "none", color: "var(--color-text-secondary)", cursor: "pointer", fontSize: 14 }}
          >
            ⚙️
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {domains.map((d) => (
            <button
              key={d.id}
              onClick={() => onSelectDomain(d.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                background: selectedDomain === d.id ? "rgba(99, 102, 241, 0.15)" : "transparent",
                border: `1px solid ${selectedDomain === d.id ? "rgba(99, 102, 241, 0.3)" : "transparent"}`,
                color: selectedDomain === d.id ? "#fff" : "var(--color-text-secondary)",
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: selectedDomain === d.id ? 600 : 400,
                cursor: "pointer",
                textAlign: "left",
                transition: "all var(--duration-fast) var(--ease-standard)",
              }}
            >
              <span>{d.icon}</span>
              <span>{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Persistent Chat Sessions History */}
      {tasksHistory.length > 0 && (
        <div>
          <h4 style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: 8 }}>
            Recent Assistant Threads
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {tasksHistory.slice(0, 5).map((t) => (
              <button
                key={t.task_id}
                onClick={() => onSelectTaskSession(t)}
                style={{
                  padding: "8px 10px",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-secondary)",
                  fontSize: 12,
                  textAlign: "left",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                }}
              >
                💬 {t.description}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RAG Knowledge Store Indicator */}
      <div className="glass" style={{ padding: 10, borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
        <span style={{ color: "var(--color-text-secondary)" }}>RAG Knowledge Base</span>
        <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-emerald)", fontWeight: 600 }}>
          {ragDocsCount} Docs
        </span>
      </div>

      <div style={{ marginTop: "auto" }}>
        <ConstraintSlider />
      </div>
    </aside>
  );
};
