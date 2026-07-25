"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS: { id: string; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "tasks",     label: "Tasks"     },
  { id: "chat",      label: "Chat Assistant" },
  { id: "tools",     label: "Tools"     },
  { id: "config",    label: "Config"    },
];

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: isDark ? "rgba(15, 23, 42, 0.88)" : "rgba(255, 255, 255, 0.88)",
        borderBottom: isDark ? "1px solid #334155" : "1px solid rgba(100, 116, 139, 0.18)",
        boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 2px 16px rgba(15, 23, 42, 0.06)",
        transition: "all 180ms ease",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "10px 24px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                padding: "8px 22px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: "14px",
                fontWeight: isActive ? 700 : 600,
                letterSpacing: "0.01em",
                transition: "all 180ms ease",
                background: isActive ? "#6366F1" : "transparent",
                color: isActive ? "#FFFFFF" : isDark ? "#94A3B8" : "#64748B",
                boxShadow: isActive ? "0 4px 14px rgba(99,102,241,0.3)" : "none",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(255,255,255,0.08)" : "rgba(100, 116, 139, 0.10)";
                  (e.currentTarget as HTMLButtonElement).style.color = isDark ? "#F8FAFC" : "#1E293B";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = isDark ? "#94A3B8" : "#64748B";
                }
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
