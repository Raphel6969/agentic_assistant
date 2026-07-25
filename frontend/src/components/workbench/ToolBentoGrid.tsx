"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface Tool {
  emoji: string;
  title: string;
  description: string;
}

const TOOLS: Tool[] = [
  {
    emoji: "🎤",
    title: "Voice Input",
    description: "Speak to Orcheon. AI understands your intent automatically.",
  },
  {
    emoji: "💻",
    title: "Code Runner",
    description: "Generate, run, and debug Python and JavaScript code algorithms.",
  },
  {
    emoji: "✈️",
    title: "Trip Planner",
    description: "Search flights, hotels and live weather for any destination.",
  },
  {
    emoji: "📅",
    title: "Scheduler",
    description: "Find time slots, draft invites and resolve calendar conflicts.",
  },
];

function ToolCard({ tool }: { tool: Tool }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: isDark ? "#1E293B" : "rgba(255,255,255,0.85)",
        border: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
        borderRadius: "24px",
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        boxShadow: hovered
          ? isDark
            ? "0 12px 40px rgba(99,102,241,0.25)"
            : "0 12px 40px rgba(99,102,241,0.14)"
          : isDark
          ? "0 4px 20px rgba(0,0,0,0.3)"
          : "0 4px 20px rgba(15,23,42,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.22s ease",
        cursor: "pointer",
        color: isDark ? "#F8FAFC" : "#0F172A",
      }}
    >
      <span style={{ fontSize: "48px", lineHeight: 1 }}>{tool.emoji}</span>
      <div>
        <p
          style={{
            margin: "0 0 6px",
            fontWeight: 700,
            fontSize: "18px",
            color: isDark ? "#F8FAFC" : "#0F172A",
            letterSpacing: "0.01em",
          }}
        >
          {tool.title}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "13.5px",
            color: isDark ? "#94A3B8" : "#64748B",
            lineHeight: 1.6,
          }}
        >
          {tool.description}
        </p>
      </div>
    </div>
  );
}

export default function ToolBentoGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "20px",
        padding: "24px 0",
      }}
    >
      {TOOLS.map((tool) => (
        <ToolCard key={tool.title} tool={tool} />
      ))}
    </div>
  );
}
