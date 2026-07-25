"use client";

import React, { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Domain } from "@/lib/types";
import { useTraceStream } from "@/hooks/useTraceStream";
import { VoiceWidget } from "@/components/workbench/VoiceWidget";
import { AssistantMessageCard } from "@/components/chat/AssistantMessageCard";
import { ACPBankModal } from "@/components/modals/ACPBankModal";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { EventDetailPanel } from "@/components/trace/EventDetailPanel";
import { ShimmerButton } from "@/components/magicui/ShimmerButton";
import { NumberTicker } from "@/components/magicui/NumberTicker";

// ── Types ──────────────────────────────────────────────────────────────────────
type NavTab = "dashboard" | "tasks" | "tools" | "config";

interface TaskItem {
  id: string;
  title: string;
  domain: string;
  status: string;
  budget: number;
  messages: Array<{ role: "user" | "ai"; text: string }>;
}

// ── Inline sub-components (avoids import race with new files) ──────────────────

// Minimal TabBar inlined here so page always renders even if subagent files arrive later
function TabBar({ active, onChange }: { active: NavTab; onChange: (t: NavTab) => void }) {
  const tabs: { id: NavTab; label: string; emoji: string }[] = [
    { id: "dashboard", label: "Dashboard", emoji: "🏠" },
    { id: "tasks", label: "Tasks", emoji: "📋" },
    { id: "tools", label: "Tools", emoji: "🛠️" },
    { id: "config", label: "Config", emoji: "⚙️" },
  ];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "10px 36px",
        borderBottom: "1px solid rgba(99,102,241,0.1)",
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(10px)",
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            background: active === t.id ? "#0F172A" : "transparent",
            color: active === t.id ? "#FFFFFF" : "#64748B",
            border: "1px solid " + (active === t.id ? "#0F172A" : "rgba(0,0,0,0.08)"),
            borderRadius: 24,
            padding: "7px 18px",
            fontSize: 13,
            fontWeight: active === t.id ? 700 : 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 180ms ease",
            fontFamily: "var(--font-sans), sans-serif",
          }}
        >
          <span style={{ fontSize: 15 }}>{t.emoji}</span> {t.label}
        </button>
      ))}
    </div>
  );
}

// Sleek bottom chat bar
function BottomChat({ onStartTask }: { onStartTask: (desc: string, domain: Domain, budget: number) => void }) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const getAiReply = useCallback((text: string): { reply: string; isTask: boolean; domain: Domain } => {
    const t = text.toLowerCase();
    const greetings = ["hi", "hello", "hey", "good morning", "good evening", "howdy", "sup"];
    if (greetings.some((g) => t === g || t.startsWith(g + " ") || t.startsWith(g + "!"))) {
      return { reply: "Hey! 👋 I'm Maestro, your personal AI assistant. What can I help you with today?", isTask: false, domain: "trip" };
    }
    if (t.includes("feature") || t.includes("what can you") || t.includes("help me")) {
      return {
        reply: "I can plan trips ✈️, run & debug code 💻, schedule meetings 📅, and research products 🔍. Just describe what you need!",
        isTask: false,
        domain: "trip",
      };
    }
    if (t.includes("plan") || t.includes("book") || t.includes("trip") || t.includes("flight")) {
      return { reply: "Starting your trip planning now! 🚀 Check the task output above.", isTask: true, domain: "trip" };
    }
    if (t.includes("write code") || t.includes("write a") || t.includes("python") || t.includes("script") || t.includes("code")) {
      return { reply: "On it! Generating code for you now 💻 Check the task output above.", isTask: true, domain: "coding" as Domain };
    }
    if (t.includes("schedule") || t.includes("meeting") || t.includes("calendar")) {
      return { reply: "Scheduling that for you 📅 Check the task output above.", isTask: true, domain: "scheduling" as Domain };
    }
    if (t.includes("compare") || t.includes("price") || t.includes("research")) {
      return { reply: "Researching that for you 🔍 Check the task output above.", isTask: true, domain: "research" as Domain };
    }
    return {
      reply: "Got it! You can also type something like 'plan a trip to Tokyo' or 'write Python code' to start an agentic task. 🤖",
      isTask: false,
      domain: "trip",
    };
  }, []);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const next: typeof messages = [...messages.slice(-11), { role: "user", text: trimmed }];
    setInput("");
    setMessages(next);
    setOpen(true);
    const { reply, isTask, domain } = getAiReply(trimmed);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
      if (isTask) {
        onStartTask(trimmed, domain, domain === "trip" ? 600 : 0);
      }
    }, 400);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const shown = messages.slice(-6);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(99,102,241,0.18)",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.08)",
        fontFamily: "var(--font-sans), sans-serif",
      }}
    >
      {/* Thread (toggle) */}
      {open && shown.length > 0 && (
        <div
          style={{
            maxHeight: 240,
            overflowY: "auto",
            padding: "14px 24px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {shown.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "72%",
              }}
            >
              <div
                style={{
                  background: m.role === "user" ? "#6366F1" : "rgba(241,245,249,1)",
                  color: m.role === "user" ? "#FFFFFF" : "#1E293B",
                  borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  padding: "10px 14px",
                  fontSize: 13,
                  lineHeight: 1.5,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 24px",
        }}
      >
        {/* Expand/collapse thread */}
        {messages.length > 0 && (
          <button
            onClick={() => setOpen(!open)}
            title={open ? "Collapse chat" : "Expand chat"}
            style={{
              background: "none",
              border: "none",
              fontSize: 18,
              cursor: "pointer",
              color: "#6366F1",
              padding: 4,
              flexShrink: 0,
            }}
          >
            {open ? "⌄" : "⌃"}
          </button>
        )}

        <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
          <span style={{ position: "absolute", left: 14, fontSize: 16, pointerEvents: "none" }}>✦</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Chat with Maestro... or say 'plan a trip to Tokyo'"
            style={{
              width: "100%",
              background: "rgba(241,245,249,0.9)",
              border: "1.5px solid rgba(99,102,241,0.25)",
              borderRadius: 28,
              padding: "12px 20px 12px 40px",
              fontSize: 14,
              color: "#0F172A",
              outline: "none",
              fontFamily: "var(--font-sans), sans-serif",
              transition: "border-color 180ms ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#6366F1";
              setOpen(true);
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
            }}
          />
        </div>

        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          style={{
            background: input.trim() ? "linear-gradient(135deg, #6366F1, #4F46E5)" : "#E2E8F0",
            color: input.trim() ? "#fff" : "#94A3B8",
            border: "none",
            borderRadius: 24,
            padding: "12px 22px",
            fontSize: 14,
            fontWeight: 600,
            cursor: input.trim() ? "pointer" : "not-allowed",
            transition: "all 180ms ease",
            whiteSpace: "nowrap",
            fontFamily: "var(--font-sans), sans-serif",
          }}
        >
          Send →
        </button>
      </div>
    </div>
  );
}

// Add Task modal (inline)
function AddTaskModal({
  isOpen,
  onClose,
  onAddTask,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (t: TaskItem) => void;
}) {
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState<Domain>("trip");
  const [budget, setBudget] = useState<string>("200");

  if (!isOpen) return null;

  const submit = () => {
    if (!title.trim()) return;
    onAddTask({
      id: crypto.randomUUID(),
      title: title.trim(),
      domain,
      status: "pending",
      budget: Number(budget) || 0,
      messages: [],
    });
    setTitle("");
    onClose();
  };

  const aiGenerate = () => {
    const presets: Record<string, { title: string; budget: number }> = {
      trip: { title: "Plan a 3-day trip to Tokyo 🗼", budget: 800 },
      coding: { title: "Write a Python web scraper for news headlines", budget: 0 },
      scheduling: { title: "Schedule a team standup for next Monday", budget: 0 },
      research: { title: "Compare MacBook Air M3 vs Dell XPS 15", budget: 0 },
      general: { title: "Complete the Q3 project milestone", budget: 100 },
    };
    const p = presets[domain] || presets.general;
    setTitle(p.title);
    setBudget(String(p.budget));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 24,
          padding: 32,
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
          position: "relative",
          fontFamily: "var(--font-sans), sans-serif",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "#F1F5F9",
            border: "none",
            borderRadius: "50%",
            width: 30,
            height: 30,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 700,
            color: "#64748B",
          }}
        >
          ×
        </button>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 24 }}>
          ✨ New Task
        </h2>

        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>
          Task Description
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Describe your task..."
          style={{
            width: "100%",
            border: "1.5px solid #E2E8F0",
            borderRadius: 12,
            padding: "12px 14px",
            fontSize: 14,
            color: "#0F172A",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: 16,
            fontFamily: "var(--font-sans), sans-serif",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#6366F1")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>
              Domain
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value as Domain)}
              style={{
                width: "100%",
                border: "1.5px solid #E2E8F0",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 13,
                color: "#0F172A",
                outline: "none",
                background: "#FAFAFA",
                fontFamily: "var(--font-sans), sans-serif",
              }}
            >
              <option value="trip">✈️ Trip</option>
              <option value="coding">💻 Coding</option>
              <option value="scheduling">📅 Scheduling</option>
              <option value="research">🔍 Research</option>
              <option value="general">🌐 General</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>
              Budget ($)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              min={0}
              placeholder="e.g. 200"
              style={{
                width: "100%",
                border: "1.5px solid #E2E8F0",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 13,
                color: "#0F172A",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "var(--font-sans), sans-serif",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#6366F1")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={aiGenerate}
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #6366F1, #4F46E5)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px 0",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-sans), sans-serif",
            }}
          >
            ✨ AI Generate
          </button>
          <button
            onClick={submit}
            disabled={!title.trim()}
            style={{
              flex: 1,
              background: title.trim() ? "#0F172A" : "#E2E8F0",
              color: title.trim() ? "#fff" : "#94A3B8",
              border: "none",
              borderRadius: 12,
              padding: "12px 0",
              fontSize: 14,
              fontWeight: 600,
              cursor: title.trim() ? "pointer" : "not-allowed",
              fontFamily: "var(--font-sans), sans-serif",
            }}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

// Tasks panel
function TasksPanel({
  tasks,
  onAddTask,
}: {
  tasks: TaskItem[];
  onAddTask: () => void;
}) {
  const [selected, setSelected] = useState<TaskItem | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [localTasks, setLocalTasks] = useState(tasks);

  // sync when parent tasks change
  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sendChat = (task: TaskItem) => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput("");
    setLocalTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              messages: [
                ...t.messages,
                { role: "user" as const, text: msg },
                { role: "ai" as const, text: `Got it! Continuing planning for: "${msg}" — I'm on it! 🚀` },
              ],
            }
          : t
      )
    );
    if (selected?.id === task.id) {
      setSelected((prev) =>
        prev
          ? {
              ...prev,
              messages: [
                ...prev.messages,
                { role: "user", text: msg },
                { role: "ai", text: `Got it! Continuing planning for: "${msg}" — I'm on it! 🚀` },
              ],
            }
          : prev
      );
    }
  };

  const domainColor: Record<string, string> = {
    trip: "#3B82F6",
    coding: "#10B981",
    scheduling: "#F59E0B",
    research: "#8B5CF6",
    general: "#64748B",
  };

  return (
    <div style={{ display: "flex", gap: 0, height: "calc(100vh - 220px)", minHeight: 400 }}>
      {/* Left: task list */}
      <div
        style={{
          width: 320,
          borderRight: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 20px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0F172A" }}>My Tasks</h3>
          <button
            onClick={onAddTask}
            style={{
              background: "linear-gradient(135deg, #6366F1, #4F46E5)",
              color: "#fff",
              border: "none",
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            + New Task
          </button>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "10px 0" }}>
          {localTasks.length === 0 && (
            <div style={{ padding: "24px 20px", textAlign: "center", color: "#94A3B8", fontSize: 13 }}>
              No tasks yet. Click "+ New Task" to get started!
            </div>
          )}
          {localTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelected(t)}
              style={{
                padding: "14px 20px",
                cursor: "pointer",
                background: selected?.id === t.id ? "rgba(99,102,241,0.06)" : "transparent",
                borderLeft: selected?.id === t.id ? "3px solid #6366F1" : "3px solid transparent",
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => {
                if (selected?.id !== t.id) e.currentTarget.style.background = "rgba(0,0,0,0.02)";
              }}
              onMouseLeave={(e) => {
                if (selected?.id !== t.id) e.currentTarget.style.background = "transparent";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", flex: 1, marginRight: 8 }}>
                  {t.title}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: domainColor[t.domain] || "#64748B",
                    color: "#fff",
                    padding: "2px 8px",
                    borderRadius: 8,
                    textTransform: "capitalize",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.domain}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#94A3B8" }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: t.status === "completed" ? "#10B981" : t.status === "running" ? "#F59E0B" : "#CBD5E1",
                    display: "inline-block",
                  }}
                />
                {t.status}
                {t.budget > 0 && <span>· ${t.budget}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: chat for selected task */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {selected ? (
          <>
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0F172A" }}>{selected.title}</h3>
                <span style={{ fontSize: 12, color: "#94A3B8" }}>Continue planning this task</span>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: "#F1F5F9",
                  border: "none",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  cursor: "pointer",
                  fontSize: 13,
                  color: "#64748B",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
              {selected.messages.length === 0 && (
                <div style={{ color: "#94A3B8", fontSize: 13, textAlign: "center", paddingTop: 40 }}>
                  No messages yet. Start chatting to continue planning this task!
                </div>
              )}
              {selected.messages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "75%" }}>
                  <div
                    style={{
                      background: m.role === "user" ? "#6366F1" : "rgba(241,245,249,1)",
                      color: m.role === "user" ? "#fff" : "#1E293B",
                      borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      padding: "10px 14px",
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                padding: "14px 24px",
                borderTop: "1px solid rgba(0,0,0,0.05)",
                display: "flex",
                gap: 10,
              }}
            >
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat(selected)}
                placeholder="Continue planning or ask a question..."
                style={{
                  flex: 1,
                  border: "1.5px solid #E2E8F0",
                  borderRadius: 24,
                  padding: "10px 16px",
                  fontSize: 13,
                  color: "#0F172A",
                  outline: "none",
                  fontFamily: "var(--font-sans), sans-serif",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6366F1")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
              />
              <button
                onClick={() => sendChat(selected)}
                style={{
                  background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 24,
                  padding: "10px 20px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Send →
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#94A3B8",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 48 }}>📋</span>
            <p style={{ fontSize: 14, margin: 0 }}>Select a task on the left to view its chat</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Tools bento grid (inline)
function ToolsPanel() {
  const tools = [
    {
      emoji: "🎤",
      title: "Voice Input",
      desc: "Speak to Maestro. AI understands your intent automatically.",
      color: "#6366F1",
    },
    {
      emoji: "💻",
      title: "Code Runner",
      desc: "Generate, execute, and debug code in any language.",
      color: "#10B981",
    },
    {
      emoji: "✈️",
      title: "Trip Planner",
      desc: "Search flights, hotels and weather for any destination.",
      color: "#3B82F6",
    },
    {
      emoji: "📅",
      title: "Scheduler",
      desc: "Find time slots, draft invites and avoid conflicts.",
      color: "#F59E0B",
    },
  ];

  return (
    <div style={{ padding: "28px 36px" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Tools</h2>
      <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28, marginTop: 0 }}>
        Maestro's built-in capabilities — each powered by AI agents.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20,
        }}
      >
        {tools.map((tool) => (
          <div
            key={tool.title}
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(20px)",
              borderRadius: 20,
              padding: 24,
              border: "1px solid rgba(255,255,255,0.9)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
              cursor: "pointer",
              transition: "transform 200ms ease, box-shadow 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.05)";
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 14 }}>{tool.emoji}</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 6px" }}>
              {tool.title}
            </h3>
            <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.5 }}>{tool.desc}</p>
            <div
              style={{
                marginTop: 16,
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: 20,
                background: `${tool.color}18`,
                color: tool.color,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              Active
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Config placeholder
function ConfigPanel() {
  return (
    <div
      style={{
        padding: "60px 36px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        minHeight: 320,
      }}
    >
      <span style={{ fontSize: 64 }}>🔧</span>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: 0 }}>Configuration</h2>
      <p style={{ fontSize: 14, color: "#94A3B8", margin: 0, textAlign: "center", maxWidth: 320 }}>
        Settings and preferences will appear here soon. Stay tuned!
      </p>
    </div>
  );
}

// ── Main Workbench ─────────────────────────────────────────────────────────────
export default function MaestroWorkbench() {
  const { user, logout } = useAuth();
  const [navTab, setNavTab] = useState<NavTab>("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [acpModalState, setAcpModalState] = useState<{ isOpen: boolean; title: string; amount: number }>({
    isOpen: false,
    title: "",
    amount: 0,
  });

  const { currentTask, events, selectedEvent, setSelectedEvent, isLoading, startTask } = useTraceStream();

  const userName = user?.name || "Marco";

  const handleStartTask = useCallback(
    async (description: string, domain: Domain | string = "trip", budget: number = 0) => {
      await startTask(description, domain as Domain, budget);
    },
    [startTask]
  );

  const handleAddTask = (task: TaskItem) => {
    setTasks((prev) => [task, ...prev]);
    handleStartTask(task.title, task.domain as Domain, task.budget);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #D4E7FE 0%, #EBF4FF 50%, #DBEAFE 100%)",
        fontFamily: "var(--font-sans), sans-serif",
        color: "#1E293B",
        paddingBottom: 120, // space for bottom chat
      }}
    >
      {/* Outer Container */}
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          background: "rgba(255,255,255,0.4)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          minHeight: "100vh",
          borderRadius: 0,
          position: "relative",
        }}
      >
        {/* Sticky Top Header */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 36px",
            borderBottom: "1px solid rgba(255,255,255,0.8)",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>✳</span>
            <span
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              maestro
            </span>
          </div>

          {/* Right: actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => { setShowAddTask(true); setNavTab("tasks"); }}
              style={{
                background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                color: "#fff",
                border: "none",
                borderRadius: 20,
                padding: "8px 18px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + New Task
            </button>

            <button
              onClick={() => setShowSettings(true)}
              title="Settings"
              style={{
                background: "#F1F5F9",
                border: "none",
                width: 34,
                height: 34,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              ⚙️
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img
                src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
                alt={userName}
                style={{ width: 32, height: 32, borderRadius: "50%" }}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{userName}</span>
            </div>

            <button
              onClick={logout}
              style={{ background: "none", border: "none", color: "#94A3B8", fontSize: 12, cursor: "pointer" }}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Tab Bar */}
        <TabBar active={navTab} onChange={setNavTab} />

        {/* ── Dashboard ── */}
        {navTab === "dashboard" && (
          <div style={{ padding: "24px 36px" }}>
            {/* Greeting */}
            <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h1
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontSize: 36,
                    fontWeight: 400,
                    color: "#0F172A",
                    letterSpacing: "-0.02em",
                    margin: 0,
                  }}
                >
                  Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},{" "}
                  {userName}!
                </h1>
                <p style={{ color: "#64748B", fontSize: 14, margin: "6px 0 0" }}>
                  Here&apos;s your workspace overview for today.
                </p>
              </div>
              <button
                onClick={() => setShowAddTask(true)}
                style={{
                  background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 24,
                  padding: "12px 24px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 6px 20px rgba(99,102,241,0.35)",
                }}
              >
                <span>+</span> Add Task
              </button>
            </div>

            {/* 3-column grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "300px 1fr 320px",
                gap: 24,
              }}
            >
              {/* LEFT: Stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Productivity ring */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 24,
                    padding: 24,
                    border: "1px solid rgba(255,255,255,0.9)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontSize: 68,
                      fontWeight: 400,
                      color: "#0F172A",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    <NumberTicker value={85} suffix="%" />
                  </div>
                  <div style={{ fontSize: 13, color: "#64748B", fontWeight: 500, marginTop: 6 }}>
                    Today&apos;s productivity
                  </div>
                </div>

                {/* Project Activity */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #FDE047, #FACC15)",
                    borderRadius: 24,
                    padding: 22,
                    boxShadow: "0 10px 25px rgba(234,179,8,0.25)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Project Activity</span>
                    <span style={{ fontSize: 10, fontWeight: 800, background: "#fff", padding: "2px 8px", borderRadius: 10, color: "#0F172A" }}>
                      Stats 🌿
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {[{ v: "26h", l: "Sync Calls" }, { v: "11h", l: "Workshops" }, { v: "6h", l: "Reviews" }].map((s) => (
                      <div key={s.l}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>{s.v}</div>
                        <div style={{ fontSize: 10, color: "#713F12", fontWeight: 600 }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Voice Widget */}
                <VoiceWidget onSpeechInput={(text) => handleStartTask(text)} />
              </div>

              {/* MIDDLE: Main content area */}
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Weekly Strategy Card */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 24,
                    padding: 22,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
                    border: "1px solid rgba(0,0,0,0.04)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 18 }}>📞</span>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                        Weekly Strategy Sync
                      </h4>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, background: "#10B981", color: "#fff", padding: "3px 10px", borderRadius: 12 }}>
                      Meeting
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, fontSize: 12, color: "#64748B" }}>
                    {[["When", "Today, 10:00 AM"], ["Team", "Marketing & Growth"], ["Reminder", "15 min"]].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ color: "#94A3B8", fontSize: 11 }}>{k}:</div>
                        <div style={{ fontWeight: 600, color: "#334155", marginTop: 2 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Design Review with Ask AI */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 24,
                    padding: 22,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 18 }}>📊</span>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>Design Review</h4>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, background: "#EF4444", color: "#fff", padding: "3px 8px", borderRadius: 10 }}>
                        🔥 High Priority
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 800, background: "#F59E0B", color: "#fff", padding: "3px 8px", borderRadius: 10 }}>
                        Task
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr", gap: 12, fontSize: 12, color: "#64748B", marginBottom: 16 }}>
                    {[["Topic", "VinTeX Website"], ["Description", "Check design of the main page"], ["Deadline", "Mar 22"]].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ color: "#94A3B8", fontSize: 11 }}>{k}:</div>
                        <div style={{ fontWeight: 600, color: "#334155", marginTop: 2 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    <ShimmerButton
                      onClick={() => handleStartTask("Review design of VinTeX main page and validate layout metrics", "coding", 0)}
                      background="#0F172A"
                      style={{ padding: "8px 18px", fontSize: 12 }}
                    >
                      ✨ Ask AI to start
                    </ShimmerButton>
                  </div>
                </div>

                {/* AI task output */}
                {currentTask && (
                  <div style={{ marginTop: 6 }}>
                    <AssistantMessageCard
                      task={currentTask}
                      events={events}
                      onOpenACPBankModal={(title, amount) => setAcpModalState({ isOpen: true, title, amount })}
                      onSelectEvent={setSelectedEvent}
                      selectedEventId={selectedEvent?.event_id}
                    />
                  </div>
                )}
              </div>

              {/* RIGHT: Quick prompts */}
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 20,
                    padding: 20,
                    border: "1px solid rgba(255,255,255,0.9)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>🏵️ Quick Requests</h4>
                    <span
                      onClick={() => setShowAddTask(true)}
                      style={{ fontSize: 12, color: "#6366F1", fontWeight: 600, cursor: "pointer" }}
                    >
                      + Custom
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { icon: "💻", title: "Write a Python Fibonacci script", domain: "coding" as Domain, budget: 0 },
                      { icon: "✈️", title: "Plan BOM → Paris trip under $600", domain: "trip" as Domain, budget: 600 },
                      { icon: "📅", title: "Check calendar for team sync", domain: "scheduling" as Domain, budget: 0 },
                      { icon: "🔍", title: "Compare Sony headphone prices", domain: "research" as Domain, budget: 0 },
                    ].map((r) => (
                      <div
                        key={r.title}
                        onClick={() => handleStartTask(r.title, r.domain, r.budget)}
                        style={{
                          padding: "12px 14px",
                          borderRadius: 12,
                          background: "#FFFFFF",
                          border: "1px solid rgba(0,0,0,0.06)",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          cursor: "pointer",
                          transition: "transform 150ms ease, box-shadow 150ms ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <span style={{ fontSize: 16 }}>{r.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#334155", flex: 1 }}>{r.title}</span>
                        <span style={{ color: "#CBD5E1", fontSize: 12 }}>▶</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Task count stat */}
                {tasks.length > 0 && (
                  <div
                    style={{
                      background: "rgba(99,102,241,0.08)",
                      borderRadius: 20,
                      padding: 20,
                      border: "1px solid rgba(99,102,241,0.15)",
                    }}
                  >
                    <div style={{ fontSize: 36, fontWeight: 800, color: "#6366F1" }}>{tasks.length}</div>
                    <div style={{ fontSize: 13, color: "#6366F1", fontWeight: 500 }}>Active Tasks</div>
                    <button
                      onClick={() => setNavTab("tasks")}
                      style={{
                        marginTop: 10,
                        background: "#6366F1",
                        color: "#fff",
                        border: "none",
                        borderRadius: 12,
                        padding: "8px 14px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      View all →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Tasks ── */}
        {navTab === "tasks" && (
          <TasksPanel tasks={tasks} onAddTask={() => setShowAddTask(true)} />
        )}

        {/* ── Tools ── */}
        {navTab === "tools" && <ToolsPanel />}

        {/* ── Config ── */}
        {navTab === "config" && <ConfigPanel />}
      </div>

      {/* Modals */}
      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        onAddTask={handleAddTask}
      />

      <ACPBankModal
        isOpen={acpModalState.isOpen}
        onClose={() => setAcpModalState({ ...acpModalState, isOpen: false })}
        itemTitle={acpModalState.title}
        amount={acpModalState.amount}
      />

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      {/* Always-visible bottom chat */}
      <BottomChat onStartTask={(desc, domain, budget) => handleStartTask(desc, domain, budget)} />
    </div>
  );
}
