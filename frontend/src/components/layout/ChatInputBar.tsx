"use client";

import React, { useState } from "react";
import type { Domain } from "@/lib/types";

interface ChatInputBarProps {
  onStartTask: (description: string, domain: Domain, budget: number) => void;
  isLoading: boolean;
  selectedDomain: Domain;
  onUploadDoc?: (docName: string, text: string) => void;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onStartTask,
  isLoading,
  selectedDomain,
  onUploadDoc,
}) => {
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || isLoading) return;

    const taskText = description.trim();
    setDescription(""); // Auto-clear input immediately upon submit!
    onStartTask(taskText, selectedDomain, budget);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (onUploadDoc) {
          onUploadDoc(file.name, text);
        }
      };
      reader.readAsText(file);
    }
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
        gap: 12,
        borderTop: "var(--glass-border)",
        background: "rgba(10, 10, 15, 0.9)",
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
        <label
          title="Upload RAG document (.txt, .md, .json)"
          style={{
            cursor: "pointer",
            fontSize: 16,
            padding: "8px 10px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
          }}
        >
          📎
          <input
            type="file"
            accept=".txt,.md,.json,.pdf"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </label>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>$</span>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            min={50}
            max={5000}
            title="Max Task Budget Ceiling"
            style={{
              width: 65,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              padding: "6px 8px",
              color: "#fff",
              fontSize: 12,
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
              ? "Find a free slot next week for team sync..."
              : selectedDomain === "research"
              ? "Compare prices for Sony headphones..."
              : "Ask anything — write Python code, plan trip, schedule meeting..."
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
            padding: "12px 22px",
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            fontWeight: 600,
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all var(--duration-fast) var(--ease-standard)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {isLoading ? "Thinking..." : "Send →"}
        </button>
      </form>
    </footer>
  );
};
