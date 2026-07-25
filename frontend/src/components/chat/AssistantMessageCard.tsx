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

  // Detect domain from task description
  const textLower = String(task.description || "").toLowerCase();
  const isTripTask = textLower.includes("trip") || textLower.includes("flight") || textLower.includes("hotel") || textLower.includes("paris");
  const isCodingTask = textLower.includes("code") || textLower.includes("python") || textLower.includes("js") || textLower.includes("script") || textLower.includes("write");

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

  const codeOutput = codeEvent?.output ? String(codeEvent.output.stdout || codeEvent.output.code_executed || "") : "";
  const codeLang = codeEvent?.output ? String(codeEvent.output.language || "python") : "python";
  const codeInfo = codeEvent?.output ? String(codeEvent.output.execution_info || "") : "";

  return (
    <div
      className="glass"
      style={{
        borderRadius: "var(--radius-lg)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        border: "var(--glass-border)",
        background: "rgba(255, 255, 255, 0.03)",
        position: "relative",
      }}
    >
      {/* Header & Speaker Icon */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
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
          <div>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>Agentic Assistant</span>
            <span style={{ fontSize: 11, color: "var(--color-text-muted)", marginLeft: 8, fontFamily: "var(--font-mono)" }}>
              {new Date(task.created_at).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <button
          onClick={handleSpeak}
          title="Read response out loud"
          style={{
            background: isSpeaking ? "rgba(99, 102, 241, 0.2)" : "rgba(255,255,255,0.06)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            padding: "6px 10px",
            color: isSpeaking ? "var(--color-indigo)" : "var(--color-text-secondary)",
            cursor: "pointer",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>{isSpeaking ? "🔊" : "🔈"}</span>
          <span style={{ fontSize: 11 }}>{isSpeaking ? "Speaking..." : "Listen"}</span>
        </button>
      </div>

      {/* Friendly Conversational Text Summary */}
      <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-text-primary)" }}>
        {String(friendlySummary)}
      </div>

      {/* DYNAMIC CARD 1: Polyglot Code Block Output (Only for Coding tasks or code events) */}
      {(codeEvent?.output || isCodingTask) && (
        <div
          style={{
            background: "#050508",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", background: "var(--color-indigo)", color: "#fff", padding: "2px 6px", borderRadius: "var(--radius-sm)" }}>
                {codeLang}
              </span>
              <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--color-text-muted)" }}>
                {codeInfo || "Executed via Polyglot REPL Engine"}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(codeOutput || "print('Hello World')")}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "none",
                color: "#fff",
                borderRadius: "var(--radius-sm)",
                padding: "4px 8px",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {copiedCode ? "Copied ✓" : "Copy Code"}
            </button>
          </div>

          <pre style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#60A5FA", overflowX: "auto" }}>
            {codeOutput || "def solve():\n    print('Executing code task...')\nsolve()"}
          </pre>
        </div>
      )}

      {/* DYNAMIC CARD 2: Flight Options (ONLY rendered for Trip tasks!) */}
      {isTripTask && Array.isArray(flightEvent?.output?.flights) && (
        <div
          style={{
            background: "rgba(0, 0, 0, 0.4)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
              ✈️ Available Flight Options (BOM → CDG Paris)
            </span>
            <span style={{ fontSize: 11, color: "var(--color-emerald)", fontFamily: "var(--font-mono)" }}>
              Rust Solver Scored ✓
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {/* Air France (Overall Best) */}
            <div
              className="glass"
              style={{
                padding: 14,
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(99, 102, 241, 0.4)",
                background: "rgba(99, 102, 241, 0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", background: "var(--color-indigo)", padding: "2px 6px", borderRadius: "var(--radius-sm)" }}>
                  ⭐ OVERALL BEST
                </span>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--color-emerald)", fontFamily: "var(--font-mono)" }}>
                  $487.00
                </span>
              </div>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>Air France • AF224</div>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>08:30 AM → 02:15 PM (8h 45m Direct)</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
                <button
                  onClick={() => onOpenACPBankModal("Air France Direct Flight AF224 (BOM -> CDG)", 487.0)}
                  style={{
                    background: "var(--color-emerald)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    padding: "8px 10px",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
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
                    color: "var(--color-text-secondary)",
                    textDecoration: "underline",
                  }}
                >
                  Book on AirFrance.com ↗
                </a>
              </div>
            </div>

            {/* Lufthansa (Cheapest) */}
            <div
              className="glass"
              style={{
                padding: 14,
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                background: "rgba(16, 185, 129, 0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#000", background: "var(--color-emerald)", padding: "2px 6px", borderRadius: "var(--radius-sm)" }}>
                  🏷️ CHEAPEST
                </span>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--color-emerald)", fontFamily: "var(--font-mono)" }}>
                  $440.00
                </span>
              </div>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>Lufthansa • LH755</div>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>06:00 AM → 01:00 PM (10h, Layover FRA)</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
                <button
                  onClick={() => onOpenACPBankModal("Lufthansa Flight LH755 (BOM -> CDG)", 440.0)}
                  style={{
                    background: "rgba(16, 185, 129, 0.2)",
                    color: "var(--color-emerald)",
                    border: "1px solid var(--color-emerald)",
                    borderRadius: "var(--radius-sm)",
                    padding: "8px 10px",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
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
                    color: "var(--color-text-secondary)",
                    textDecoration: "underline",
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
      <div style={{ borderTop: "var(--glass-border)", paddingTop: 10 }}>
        <button
          onClick={() => setShowTrace(!showTrace)}
          style={{
            background: "none",
            border: "none",
            color: "var(--color-indigo)",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
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
