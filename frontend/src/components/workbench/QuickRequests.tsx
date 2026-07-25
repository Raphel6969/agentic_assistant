"use client";

import React from "react";

interface QuickRequestsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const QuickRequests: React.FC<QuickRequestsProps> = ({ onSelectPrompt }) => {
  const requests = [
    {
      id: "code",
      title: "Write a Python script to calculate Fibonacci sequence",
      icon: "💻",
      tag: "Coding REPL",
    },
    {
      id: "trip",
      title: "Plan a 3-day trip from BOM to CDG Paris under $600",
      icon: "✈️",
      tag: "Trip Planning",
    },
    {
      id: "calendar",
      title: "Check calendar availability for team strategy sync",
      icon: "📅",
      tag: "Scheduling",
    },
    {
      id: "research",
      title: "Compare prices for Sony headphones across vendors",
      icon: "🔍",
      tag: "Price Research",
    },
  ];

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "20px",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        border: "1px solid rgba(255, 255, 255, 0.8)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🏵️</span>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1E293B" }}>Quick requests</h4>
        </div>
        <span style={{ fontSize: 12, color: "#6366F1", fontWeight: 600, cursor: "pointer" }}>+ Custom Task</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {requests.map((r) => (
          <div
            key={r.id}
            onClick={() => onSelectPrompt(r.title)}
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              background: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              transition: "transform 150ms ease, boxShadow 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>{r.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>{r.title}</span>
            </div>
            <span style={{ fontSize: 14, color: "#64748B" }}>▶</span>
          </div>
        ))}
      </div>
    </div>
  );
};
