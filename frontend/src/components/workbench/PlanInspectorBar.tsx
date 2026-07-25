"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface StepItem {
  id: number;
  description: string;
  tool: string;
  status: "pending" | "approved" | "skipped" | "executing" | "completed";
}

interface PlanInspectorBarProps {
  taskTitle: string;
  domain: string;
  steps: StepItem[];
  onApproveAll: () => void;
  onSkipStep: (stepId: number) => void;
  onEditParameters: () => void;
}

export const PlanInspectorBar: React.FC<PlanInspectorBarProps> = ({
  taskTitle,
  domain,
  steps: initialSteps,
  onApproveAll,
  onSkipStep,
  onEditParameters,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [steps, setSteps] = useState<StepItem[]>(initialSteps);
  const [isApproved, setIsApproved] = useState(false);

  const handleApprove = () => {
    setIsApproved(true);
    setSteps((prev) => prev.map((s) => ({ ...s, status: "approved" })));
    onApproveAll();
  };

  const handleSkip = (stepId: number) => {
    setSteps((prev) => prev.map((s) => (s.id === stepId ? { ...s, status: "skipped" } : s)));
    onSkipStep(stepId);
  };

  return (
    <div
      style={{
        background: isDark ? "#1E293B" : "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        border: isDark ? "1.5px solid rgba(99,102,241,0.3)" : "1.5px solid #C7D2FE",
        boxShadow: "0 8px 24px rgba(99,102,241,0.08)",
        marginBottom: 20,
        fontFamily: "var(--font-sans), sans-serif",
      }}
    >
      {/* Inspector Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "rgba(99,102,241,0.15)",
              color: "#6366F1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#6366F1", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Human-in-the-Loop Plan Inspector
            </span>
            <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: isDark ? "#F8FAFC" : "#0F172A" }}>
              FSM Step Decomposition for: {taskTitle}
            </h4>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={onEditParameters}
            style={{
              background: isDark ? "#334155" : "#F1F5F9",
              color: isDark ? "#CBD5E1" : "#475569",
              border: "none",
              borderRadius: 12,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ⚙️ Edit Params
          </button>
          {!isApproved ? (
            <button
              onClick={handleApprove}
              style={{
                background: "linear-gradient(135deg, #10B981, #059669)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 12,
                padding: "6px 16px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
              }}
            >
              ✓ Approve & Execute All
            </button>
          ) : (
            <span style={{ fontSize: 12, fontWeight: 700, color: "#10B981", background: "rgba(16,185,129,0.12)", padding: "4px 12px", borderRadius: 10 }}>
              ✓ Approved & Executing
            </span>
          )}
        </div>
      </div>

      {/* Decomposed Steps List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {steps.map((step, idx) => (
          <div
            key={step.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: isDark ? "#0F172A" : "#F8FAFC",
              border: isDark ? "1px solid #334155" : "1px solid #E2E8F0",
              borderRadius: 12,
              padding: "10px 14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: step.status === "skipped" ? "#94A3B8" : step.status === "approved" ? "#10B981" : "#6366F1",
                  color: "#FFFFFF",
                  fontSize: 11,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {idx + 1}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: step.status === "skipped" ? "#94A3B8" : isDark ? "#F8FAFC" : "#1E293B",
                  textDecoration: step.status === "skipped" ? "line-through" : "none",
                }}
              >
                {step.description}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  background: isDark ? "#334155" : "#E2E8F0",
                  padding: "2px 8px",
                  borderRadius: 6,
                  color: isDark ? "#CBD5E1" : "#475569",
                }}
              >
                tool: {step.tool}
              </span>
              {step.status !== "skipped" && !isApproved && (
                <button
                  onClick={() => handleSkip(step.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#EF4444",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Skip
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
