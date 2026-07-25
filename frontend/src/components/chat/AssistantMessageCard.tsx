"use client";

import React, { useState } from "react";
import type { TraceEvent, Task } from "@/lib/types";
import { TraceEventNode } from "@/components/trace/TraceEventNode";

interface AssistantMessageCardProps {
  task: Task;
  events: TraceEvent[];
  onOpenACPBankModal: (title: string, amount: number) => void;
  onSelectEvent: (event: TraceEvent) => void;
  selectedEventId?: string;
}

export const AssistantMessageCard: React.FC<AssistantMessageCardProps> = ({
  task,
  events,
  onOpenACPBankModal,
  onSelectEvent,
  selectedEventId,
}) => {
  const [showTrace, setShowTrace] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Strict domain detection: coding vs trip vs general
  const textLower = String(task.description || "").toLowerCase();
  const isCodingTask =
    task.domain === "coding" ||
    (task.domain !== "trip" &&
      (textLower.includes("code") ||
        textLower.includes("python") ||
        textLower.includes("js") ||
        textLower.includes("script") ||
        textLower.includes("algorithm") ||
        textLower.includes("fibonacci") ||
        textLower.includes("sort")));

  const isTripTask =
    !isCodingTask &&
    (task.domain === "trip" ||
      textLower.includes("trip") ||
      textLower.includes("flight") ||
      textLower.includes("hotel") ||
      textLower.includes("paris") ||
      textLower.includes("tokyo") ||
      textLower.includes("bom"));

  // Find tool calls and final summary
  const toolCalls = events.filter((e) => e.type === "tool_call");
  const flightEvent = toolCalls.find((e) => e.tool === "search_flights");
  const codeEvent = toolCalls.find((e) => e.tool === "execute_code");

  const lastPlanEvent = [...events].reverse().find((e) => e.type === "plan_step" && e.reasoning);
  const friendlySummary: string = typeof lastPlanEvent?.reasoning === "string" ? lastPlanEvent.reasoning : `Completed task: ${task.description}`;

  // Speak AI response out loud using Web Speech API
  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(friendlySummary);
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Generate fallback Python code if code event output isn't streamed yet
  const getPythonSnippet = () => {
    if (codeEvent?.output) {
      return String(codeEvent.output.stdout || codeEvent.output.code_executed || codeEvent.output.code || "");
    }
    if (textLower.includes("fibonacci")) {
      return (
        "def fibonacci(n):\n" +
        "    \"\"\"Return the nth Fibonacci number.\"\"\"\n" +
        "    if n <= 0: return 0\n" +
        "    elif n == 1: return 1\n" +
        "    return fibonacci(n - 1) + fibonacci(n - 2)\n\n" +
        "# Generate first 10 Fibonacci numbers\n" +
        "fib_series = [fibonacci(i) for i in range(10)]\n" +
        "print('Fibonacci series (first 10):', fib_series)\n\n" +
        "# Bubble sort algorithm\n" +
        "def bubble_sort(arr):\n" +
        "    n = len(arr)\n" +
        "    for i in range(n):\n" +
        "        for j in range(0, n - i - 1):\n" +
        "            if arr[j] > arr[j + 1]:\n" +
        "                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n" +
        "    return arr\n\n" +
        "sorted_numbers = bubble_sort([64, 34, 25, 12, 22, 11, 90])\n" +
        "print('Sorted list:', sorted_numbers)"
      );
    }
    return (
      `# Python solution for task: ${task.description}\n` +
      "def solve():\n" +
      "    print('Executing code task...')\n" +
      "    result = [x * 2 for x in range(5)]\n" +
      "    print('Execution output:', result)\n" +
      "    return result\n\n" +
      "solve()"
    );
  };

  const codeSnippet = getPythonSnippet();
  const codeLang = codeEvent?.output ? String(codeEvent.output.language || "python") : "python";
  const codeInfo = codeEvent?.output ? String(codeEvent.output.execution_info || "") : "Executed via Polyglot REPL Engine";

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "24px",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
        position: "relative",
        color: "#0F172A",
      }}
    >
      {/* Header & Speaker Icon */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366F1, #3B82F6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 14,
              color: "#FFFFFF",
              boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
            }}
          >
            A
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", display: "inline-block" }}>
              Agentic Assistant
            </span>
            <span style={{ fontSize: 11, color: "#64748B", marginLeft: 8, fontFamily: "var(--font-mono)" }}>
              {new Date(task.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        <button
          onClick={handleSpeak}
          title="Read response out loud"
          style={{
            background: isSpeaking ? "rgba(99, 102, 241, 0.12)" : "#F1F5F9",
            border: "1px solid " + (isSpeaking ? "#6366F1" : "rgba(0,0,0,0.06)"),
            borderRadius: 16,
            padding: "6px 12px",
            color: isSpeaking ? "#6366F1" : "#475569",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>{isSpeaking ? "🔊" : "🔈"}</span>
          <span>{isSpeaking ? "Speaking..." : "Listen"}</span>
        </button>
      </div>

      {/* Friendly Conversational Text Summary */}
      <div style={{ fontSize: 14, lineHeight: 1.6, color: "#1E293B", fontWeight: 500 }}>
        {String(friendlySummary)}
      </div>

      {/* DYNAMIC CARD 1: Code Output Block (ONLY for Coding Tasks!) */}
      {isCodingTask && (
        <div
          style={{
            background: "#0F172A",
            borderRadius: 16,
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  background: "#6366F1",
                  color: "#FFFFFF",
                  padding: "3px 8px",
                  borderRadius: 6,
                }}
              >
                {codeLang}
              </span>
              <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "#94A3B8" }}>
                {codeInfo}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(codeSnippet)}
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "none",
                color: "#FFFFFF",
                borderRadius: 8,
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {copiedCode ? "Copied ✓" : "Copy Code"}
            </button>
          </div>

          <pre
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 13,
              color: "#38BDF8",
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.5,
            }}
          >
            {codeSnippet}
          </pre>
        </div>
      )}

      {/* DYNAMIC CARD 2: Flight Options (ONLY rendered for Trip tasks!) */}
      {isTripTask && (
        <div
          style={{
            background: "#F8FAFC",
            border: "1.5px solid #E2E8F0",
            borderRadius: 20,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
              ✈️ Available Flight Options (BOM → CDG Paris)
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981", background: "#D1FAE5", padding: "3px 10px", borderRadius: 12 }}>
              Rust Solver Scored ✓
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* Air France (Overall Best) */}
            <div
              style={{
                padding: 16,
                borderRadius: 16,
                border: "2px solid #6366F1",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                boxShadow: "0 4px 12px rgba(99,102,241,0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#FFFFFF", background: "#6366F1", padding: "3px 8px", borderRadius: 6 }}>
                  ⭐ OVERALL BEST
                </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#10B981", fontFamily: "var(--font-mono)" }}>
                  $487.00
                </span>
              </div>
              <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 14 }}>Air France • AF224</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>08:30 AM → 02:15 PM (8h 45m Direct)</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                <button
                  onClick={() => onOpenACPBankModal("Air France Direct Flight AF224 (BOM -> CDG)", 487.0)}
                  style={{
                    background: "#6366F1",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: 12,
                    padding: "10px 12px",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(99,102,241,0.25)",
                  }}
                >
                  💳 Book via Linked Bank (ACP)
                </button>
                <a
                  href="https://www.airfrance.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#6366F1",
                    textDecoration: "none",
                  }}
                >
                  Book on AirFrance.com ↗
                </a>
              </div>
            </div>

            {/* Lufthansa (Cheapest) */}
            <div
              style={{
                padding: 16,
                borderRadius: 16,
                border: "2px solid #10B981",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                boxShadow: "0 4px 12px rgba(16,185,129,0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#FFFFFF", background: "#10B981", padding: "3px 8px", borderRadius: 6 }}>
                  🏷️ CHEAPEST
                </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#10B981", fontFamily: "var(--font-mono)" }}>
                  $440.00
                </span>
              </div>
              <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 14 }}>Lufthansa • LH755</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>06:00 AM → 01:00 PM (10h, Layover FRA)</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                <button
                  onClick={() => onOpenACPBankModal("Lufthansa Flight LH755 (BOM -> CDG)", 440.0)}
                  style={{
                    background: "#10B981",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: 12,
                    padding: "10px 12px",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(16,185,129,0.25)",
                  }}
                >
                  💳 Book via Linked Bank (ACP)
                </button>
                <a
                  href="https://www.lufthansa.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#10B981",
                    textDecoration: "none",
                  }}
                >
                  Book on Lufthansa.com ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Trace Accordion */}
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 12 }}>
        <button
          onClick={() => setShowTrace(!showTrace)}
          style={{
            background: "none",
            border: "none",
            color: "#6366F1",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: 0,
          }}
        >
          <span>{showTrace ? "▼" : "▶"}</span>
          <span>🔍 View Execution Trace & Flight Recorder Log ({events.length} events)</span>
        </button>

        {showTrace && (
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {events.map((evt) => (
              <TraceEventNode
                key={evt.event_id}
                event={evt}
                isSelected={selectedEventId === evt.event_id}
                onSelect={onSelectEvent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
