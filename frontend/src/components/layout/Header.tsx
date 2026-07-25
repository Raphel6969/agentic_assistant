"use client";

import React from "react";
import type { Task } from "@/lib/types";

interface HeaderProps {
  task: Task | null;
}

export const Header: React.FC<HeaderProps> = ({ task }) => {
  const ceiling = task?.budget_ceiling || 500;
  const spent = task?.budget_spent || 0;
  const percentage = Math.min(100, Math.round((spent / ceiling) * 100));

  const strokeDashoffset = 100 - percentage;

  let ringColor = "var(--color-emerald)";
  if (percentage > 70) ringColor = "var(--color-amber)";
  if (percentage >= 95) ringColor = "var(--color-rose)";

  return (
    <header
      className="glass"
      style={{
        gridColumn: "1 / -1",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        height: "var(--header-height)",
        gap: 16,
        borderBottom: "var(--glass-border)",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "var(--radius-sm)",
            background: "linear-gradient(135deg, var(--color-indigo), var(--color-emerald))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 14,
            color: "#fff",
          }}
        >
          A
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: 16,
            background: "linear-gradient(135deg, #fff, rgba(255,255,255,0.7))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
          }}
        >
          Agentic Assistant
        </span>
      </div>

      {task && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 20 }}>
          <span
            style={{
              fontSize: 13,
              color: "var(--color-text-secondary)",
              maxWidth: 300,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {task.description}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              padding: "2px 8px",
              borderRadius: "var(--radius-sm)",
              background:
                task.status === "done"
                  ? "rgba(16, 185, 129, 0.15)"
                  : task.status === "failed"
                  ? "rgba(244, 63, 94, 0.15)"
                  : "rgba(99, 102, 241, 0.15)",
              color:
                task.status === "done"
                  ? "var(--color-emerald)"
                  : task.status === "failed"
                  ? "var(--color-rose)"
                  : "var(--color-indigo)",
              border: `1px solid ${
                task.status === "done"
                  ? "rgba(16, 185, 129, 0.3)"
                  : task.status === "failed"
                  ? "rgba(244, 63, 94, 0.3)"
                  : "rgba(99, 102, 241, 0.3)"
              }`,
            }}
          >
            {task.status}
          </span>
        </div>
      )}

      {/* Budget Ring & Tracker */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12, flexShrink: 0, whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <span style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>
            Budget Spent
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-mono)" }}>
            ${spent.toFixed(2)} / <span style={{ color: "var(--color-text-secondary)" }}>${ceiling.toFixed(2)}</span>
          </span>
        </div>

        <svg width="32" height="32" viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="3.5"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={ringColor}
            strokeWidth="3.5"
            strokeDasharray="100, 100"
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 300ms ease, stroke 300ms ease" }}
          />
        </svg>
      </div>
    </header>
  );
};
