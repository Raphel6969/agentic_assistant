"use client";

import React, { useState } from "react";
import type { Domain } from "@/lib/types";

interface ChatInputBarProps {
  onStartTask: (description: string, domain: Domain, budget: number) => void;
  isLoading: boolean;
  selectedDomain: Domain;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onStartTask,
  isLoading,
  selectedDomain,
}) => {
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || isLoading) return;
    onStartTask(description.trim(), selectedDomain, budget);
  };

  return (
    <footer
      className="glass"
      style={{
        gridColumn: "1 / -1",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        height: "var(--input-bar-height)",
        gap: 16,
        borderTop: "var(--glass-border)",
        background: "rgba(10, 10, 15, 0.8)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Budget: $</span>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            min={50}
            max={5000}
            style={{
              width: 70,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              padding: "6px 8px",
              color: "#fff",
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              outline: "none",
            }}
          />
        </div>

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={
            selectedDomain === "trip"
              ? "Plan a trip from BOM to CDG Paris under $600..."
              : selectedDomain === "scheduling"
              ? "Find an open slot next week for a 3-person team sync..."
              : "Search product pricing trade-offs across sources..."
          }
          disabled={isLoading}
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            outline: "none",
            transition: "border-color var(--duration-fast) var(--ease-standard)",
          }}
        />

        <button
          type="submit"
          disabled={isLoading || !description.trim()}
          style={{
            background: isLoading ? "rgba(99, 102, 241, 0.4)" : "var(--color-indigo)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-md)",
            padding: "12px 24px",
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            fontWeight: 600,
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all var(--duration-fast) var(--ease-standard)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {isLoading ? "Executing..." : "Execute Task →"}
        </button>
      </form>
    </footer>
  );
};
