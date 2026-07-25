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
import { GeneralChatBot } from "@/components/workbench/GeneralChatBot";

// ── Types ──────────────────────────────────────────────────────────────────────
type NavTab = "dashboard" | "tasks" | "tools" | "config";

export interface TaskItem {
  id: string;
  title: string;
  domain: Domain;
  status: string;
  budget: number;
  messages: Array<{ role: "user" | "ai"; text: string }>;
  created_at: string;
}

// ── Header Navigation TabBar ───────────────────────────────────────────────────
function TabBar({ active, onChange }: { active: NavTab; onChange: (t: NavTab) => void }) {
  const tabs: { id: NavTab; label: string; emoji: string }[] = [
    { id: "dashboard", label: "Dashboard", emoji: "🏠" },
    { id: "tasks", label: "Tasks Window", emoji: "📋" },
    { id: "tools", label: "Tools & AI Chat", emoji: "🛠️" },
    { id: "config", label: "Config", emoji: "⚙️" },
  ];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 36px",
        borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
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
            padding: "8px 20px",
            fontSize: 13,
            fontWeight: active === t.id ? 700 : 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 180ms ease",
            fontFamily: "var(--font-sans), sans-serif",
          }}
        >
          <span style={{ fontSize: 16 }}>{t.emoji}</span> {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Floating Tasks Window Modal ─────────────────────────────────────────────────
function TaskWindowModal({
  isOpen,
  onClose,
  tasks,
  selectedTaskId,
  onSelectTask,
  onAddTaskClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  tasks: TaskItem[];
  selectedTaskId: string | null;
  onSelectTask: (t: TaskItem) => void;
  onAddTaskClick: () => void;
}) {
  const [localTasks, setLocalTasks] = useState<TaskItem[]>(tasks);
  const [chatInput, setChatInput] = useState("");
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);

  React.useEffect(() => {
    setLocalTasks(tasks);
    if (selectedTaskId) {
      const found = tasks.find((t) => t.id === selectedTaskId);
      if (found) setActiveTask(found);
    } else if (tasks.length > 0 && !activeTask) {
      setActiveTask(tasks[0]);
    }
  }, [tasks, selectedTaskId]);

  if (!isOpen) return null;

  const currentSelected = activeTask || (localTasks.length > 0 ? localTasks[0] : null);

  const sendChat = () => {
    if (!chatInput.trim() || !currentSelected) return;
    const msg = chatInput.trim();
    setChatInput("");

    const userMsg = { role: "user" as const, text: msg };
    const aiMsg = { role: "ai" as const, text: `Got it! Continuing planning for "${msg}" — updating your task state! 🚀` };

    setLocalTasks((prev) =>
      prev.map((t) =>
        t.id === currentSelected.id
          ? { ...t, messages: [...t.messages, userMsg, aiMsg] }
          : t
      )
    );

    setActiveTask((prev) =>
      prev && prev.id === currentSelected.id
        ? { ...prev, messages: [...prev.messages, userMsg, aiMsg] }
        : prev
    );
  };

  const domainColor: Record<string, string> = {
    trip: "#3B82F6",
    coding: "#10B981",
    scheduling: "#F59E0B",
    research: "#8B5CF6",
    general: "#64748B",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 350,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 24,
          width: "100%",
          maxWidth: 960,
          height: 600,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 80px rgba(0,0,0,0.25)",
          overflow: "hidden",
          position: "relative",
          fontFamily: "var(--font-sans), sans-serif",
          border: "1px solid rgba(255,255,255,0.8)",
        }}
      >
        {/* Window Top Bar */}
        <div
          style={{
            background: "linear-gradient(135deg, #0F172A, #1E293B)",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>📋</span>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#FFFFFF" }}>Tasks & Planning Window</h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={onAddTaskClick}
              style={{
                background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 20,
                padding: "6px 16px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + New Task
            </button>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "50%",
                width: 30,
                height: 30,
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Window Body: 2 Columns */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left: Task List */}
          <div
            style={{
              width: 340,
              borderRight: "1px solid #E2E8F0",
              background: "#F8FAFC",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            {localTasks.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "#64748B", fontSize: 13 }}>
                No active tasks yet. Click "+ New Task" to create one!
              </div>
            ) : (
              localTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => { setActiveTask(t); onSelectTask(t); }}
                  style={{
                    padding: "16px 20px",
                    cursor: "pointer",
                    background: currentSelected?.id === t.id ? "#FFFFFF" : "transparent",
                    borderLeft: currentSelected?.id === t.id ? "4px solid #6366F1" : "4px solid transparent",
                    borderBottom: "1px solid #F1F5F9",
                    transition: "all 150ms ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", flex: 1, marginRight: 8 }}>
                      {t.title}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        background: domainColor[t.domain] || "#64748B",
                        color: "#FFFFFF",
                        padding: "2px 8px",
                        borderRadius: 8,
                        textTransform: "capitalize",
                      }}
                    >
                      {t.domain}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748B", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
                    {t.status}
                    {t.budget > 0 && <span>· ${t.budget}</span>}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: Selected Task Chat Stream */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFFFFF" }}>
            {currentSelected ? (
              <>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #E2E8F0", background: "#FFFFFF" }}>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0F172A" }}>{currentSelected.title}</h4>
                  <span style={{ fontSize: 12, color: "#64748B" }}>Continue planning and executing this task</span>
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                  {currentSelected.messages.length === 0 && (
                    <div style={{ textAlign: "center", color: "#64748B", fontSize: 13, paddingTop: 40 }}>
                      Task created! Type below to continue planning or asking questions.
                    </div>
                  )}
                  {currentSelected.messages.map((m, i) => (
                    <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "75%" }}>
                      <div
                        style={{
                          background: m.role === "user" ? "#6366F1" : "#F1F5F9",
                          color: m.role === "user" ? "#FFFFFF" : "#0F172A",
                          borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                          padding: "12px 16px",
                          fontSize: 13,
                          lineHeight: 1.5,
                          border: m.role === "ai" ? "1px solid #E2E8F0" : "none",
                        }}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: "16px 24px", borderTop: "1px solid #E2E8F0", display: "flex", gap: 10 }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                    placeholder="Continue planning or refine instructions..."
                    style={{
                      flex: 1,
                      border: "1.5px solid #E2E8F0",
                      borderRadius: 24,
                      padding: "12px 18px",
                      fontSize: 13,
                      color: "#0F172A",
                      outline: "none",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#6366F1")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
                  />
                  <button
                    onClick={sendChat}
                    style={{
                      background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: 24,
                      padding: "12px 24px",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Send →
                  </button>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", fontSize: 14 }}>
                Select a task on the left to view its chat
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Add Task Modal ─────────────────────────────────────────────────────────────
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
      status: "running",
      budget: Number(budget) || 0,
      messages: [{ role: "ai", text: `Task "${title.trim()}" initialized! Ready to execute.` }],
      created_at: new Date().toISOString(),
    });
    setTitle("");
    onClose();
  };

  const aiGenerate = () => {
    const presets: Record<string, { title: string; budget: number }> = {
      trip: { title: "Plan a 3-day trip to Tokyo 🗼", budget: 800 },
      coding: { title: "Write a Python script for Fibonacci & sorting", budget: 0 },
      scheduling: { title: "Schedule team strategy sync for next week", budget: 0 },
      research: { title: "Compare MacBook Air M3 vs Dell XPS 15", budget: 0 },
      general: { title: "Complete Q3 project milestones", budget: 100 },
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
        zIndex: 400,
        background: "rgba(15,23,42,0.65)",
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
          boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
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
          ✨ Create New Task
        </h2>

        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>
          Task Description
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Write a Python script to sort items..."
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
              color: "#FFFFFF",
              border: "none",
              borderRadius: 12,
              padding: "12px 0",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
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
              color: title.trim() ? "#FFFFFF" : "#94A3B8",
              border: "none",
              borderRadius: 12,
              padding: "12px 0",
              fontSize: 14,
              fontWeight: 700,
              cursor: title.trim() ? "pointer" : "not-allowed",
            }}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Workbench Component ────────────────────────────────────────────────────
export default function MaestroWorkbench() {
  const { user, logout } = useAuth();
  const [navTab, setNavTab] = useState<NavTab>("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showTaskWindow, setShowTaskWindow] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [acpModalState, setAcpModalState] = useState<{ isOpen: boolean; title: string; amount: number }>({
    isOpen: false,
    title: "",
    amount: 0,
  });

  const { currentTask, events, selectedEvent, setSelectedEvent, startTask } = useTraceStream();

  const userName = user?.name || "Marco";

  const handleStartTask = useCallback(
    async (description: string, domain: Domain | string = "trip", budget: number = 0) => {
      await startTask(description, domain as Domain, budget);
    },
    [startTask]
  );

  const handleAddTask = (newTask: TaskItem) => {
    setTasks((prev) => [newTask, ...prev]);
    setSelectedTaskId(newTask.id);
    handleStartTask(newTask.title, newTask.domain, newTask.budget);
  };

  // Launch a tool directly from Tools Bento Grid
  const handleToolClick = (toolTitle: string, domain: Domain, sampleDesc: string, defaultBudget: number = 0) => {
    const newTask: TaskItem = {
      id: crypto.randomUUID(),
      title: sampleDesc,
      domain,
      status: "running",
      budget: defaultBudget,
      messages: [{ role: "ai", text: `Tool "${toolTitle}" activated! Running "${sampleDesc}"...` }],
      created_at: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setSelectedTaskId(newTask.id);
    handleStartTask(sampleDesc, domain, defaultBudget);
    setShowTaskWindow(true);
  };

  // Handle nav tab switching: clicking "tasks" tab pops open the window overlay
  const handleTabChange = (tab: NavTab) => {
    if (tab === "tasks") {
      setShowTaskWindow(true);
    } else {
      setNavTab(tab);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #D4E7FE 0%, #EBF4FF 50%, #DBEAFE 100%)",
        fontFamily: "var(--font-sans), sans-serif",
        color: "#1E293B",
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
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>✳</span>
            <span
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: 24,
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              maestro
            </span>
          </div>

          {/* Right Header Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={() => setShowAddTask(true)}
              style={{
                background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 20,
                padding: "8px 18px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(99,102,241,0.25)",
              }}
            >
              + New Task
            </button>

            <button
              onClick={() => setShowSettings(true)}
              title="Settings"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.08)",
                width: 36,
                height: 36,
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
                style={{ width: 34, height: 34, borderRadius: "50%" }}
              />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{userName}</span>
            </div>

            <button
              onClick={logout}
              style={{
                background: "none",
                border: "none",
                color: "#64748B",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Tab Bar */}
        <TabBar active={navTab} onChange={handleTabChange} />

        {/* ── DASHBOARD TAB ── */}
        {navTab === "dashboard" && (
          <div style={{ padding: "24px 36px" }}>
            {/* Greeting Header */}
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
                  Hi, {userName}!
                </h1>
                <p style={{ color: "#64748B", fontSize: 14, margin: "6px 0 0" }}>
                  Here is your workspace overview for today.
                </p>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setShowTaskWindow(true)}
                  style={{
                    background: "#FFFFFF",
                    color: "#0F172A",
                    border: "1.5px solid rgba(0,0,0,0.1)",
                    borderRadius: 24,
                    padding: "12px 20px",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  📋 Open Tasks Window ({tasks.length})
                </button>

                <button
                  onClick={() => setShowAddTask(true)}
                  style={{
                    background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: 24,
                    padding: "12px 24px",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 6px 20px rgba(99,102,241,0.3)",
                  }}
                >
                  <span>+</span> Add Task
                </button>
              </div>
            </div>

            {/* 3-Column Grid Layout */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "300px 1fr 320px",
                gap: 24,
              }}
            >
              {/* LEFT COLUMN: Productivity Ring & Stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* 85% Productivity Ring */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 24,
                    padding: 24,
                    border: "1px solid rgba(0, 0, 0, 0.08)",
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
                  <div style={{ fontSize: 13, color: "#64748B", fontWeight: 600, marginTop: 6 }}>
                    Today&apos;s productivity
                  </div>
                </div>

                {/* Project Activity Card */}
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
                    <span style={{ fontSize: 10, fontWeight: 800, background: "#FFFFFF", padding: "2px 8px", borderRadius: 10, color: "#0F172A" }}>
                      Stats 🌿
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {[{ v: "26h", l: "Sync Calls" }, { v: "11h", l: "Workshops" }, { v: "6h", l: "Reviews" }].map((s) => (
                      <div key={s.l}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>{s.v}</div>
                        <div style={{ fontSize: 10, color: "#713F12", fontWeight: 700 }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Voice Widget */}
                <VoiceWidget onSpeechInput={(text) => handleStartTask(text)} />
              </div>

              {/* MIDDLE COLUMN: Task Cards & Live AI Execution */}
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Task Card 1: Strategy Sync */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 24,
                    padding: 22,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 18 }}>📞</span>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                        Weekly Strategy Sync
                      </h4>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, background: "#10B981", color: "#FFFFFF", padding: "3px 10px", borderRadius: 12 }}>
                      Meeting
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, fontSize: 12, color: "#64748B" }}>
                    {[["When", "Today, 10:00 AM"], ["Team", "Marketing & Growth"], ["Reminder", "15 min"]].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ color: "#94A3B8", fontSize: 11 }}>{k}:</div>
                        <div style={{ fontWeight: 700, color: "#0F172A", marginTop: 2 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Task Card 2: Design Review */}
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
                      <span style={{ fontSize: 10, fontWeight: 800, background: "#EF4444", color: "#FFFFFF", padding: "3px 8px", borderRadius: 10 }}>
                        🔥 High Priority
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 800, background: "#F59E0B", color: "#FFFFFF", padding: "3px 8px", borderRadius: 10 }}>
                        Task
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr", gap: 12, fontSize: 12, color: "#64748B", marginBottom: 16 }}>
                    {[["Topic", "VinTeX Website"], ["Description", "Check design of the main page"], ["Deadline", "Mar 22"]].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ color: "#94A3B8", fontSize: 11 }}>{k}:</div>
                        <div style={{ fontWeight: 700, color: "#0F172A", marginTop: 2 }}>{v}</div>
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

                {/* AI Execution Trace Card */}
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

              {/* RIGHT COLUMN: Quick Requests */}
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 24,
                    padding: 20,
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>🏵️ Quick Requests</h4>
                    <span
                      onClick={() => setShowAddTask(true)}
                      style={{ fontSize: 12, color: "#6366F1", fontWeight: 700, cursor: "pointer" }}
                    >
                      + Custom Task
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
                          borderRadius: 14,
                          background: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          cursor: "pointer",
                          transition: "all 150ms ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.borderColor = "#6366F1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.borderColor = "#E2E8F0";
                        }}
                      >
                        <span style={{ fontSize: 16 }}>{r.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", flex: 1 }}>{r.title}</span>
                        <span style={{ color: "#6366F1", fontSize: 12 }}>▶</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TOOLS & AI CHAT TAB ── */}
        {navTab === "tools" && (
          <div style={{ padding: "28px 36px" }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0F172A", margin: "0 0 6px" }}>
              🛠️ Maestro Tools & General AI Chat
            </h2>
            <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 28px" }}>
              Click any tool to launch a saved agentic task window instantly, or ask General AI any question below!
            </p>

            {/* Tool Bento Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 20,
                marginBottom: 36,
              }}
            >
              {[
                {
                  title: "Voice Input",
                  emoji: "🎤",
                  desc: "Speak directly to Maestro. Converts speech to autonomous task execution.",
                  domain: "coding" as Domain,
                  sampleDesc: "Voice task: Write a Python script to sort items",
                  color: "#6366F1",
                },
                {
                  title: "Code Runner",
                  emoji: "💻",
                  desc: "Generate, run, and debug Python code snippets in real-time.",
                  domain: "coding" as Domain,
                  sampleDesc: "Write Python code for Fibonacci & sorting algorithm",
                  color: "#10B981",
                },
                {
                  title: "Trip Planner",
                  emoji: "✈️",
                  desc: "Find flights, hotels, and live weather for any destination.",
                  domain: "trip" as Domain,
                  sampleDesc: "Plan a 3-day trip to Tokyo under $800",
                  defaultBudget: 800,
                  color: "#3B82F6",
                },
                {
                  title: "Scheduler",
                  emoji: "📅",
                  desc: "Check calendar slots, draft invites, and coordinate team syncs.",
                  domain: "scheduling" as Domain,
                  sampleDesc: "Check calendar availability for team strategy sync",
                  color: "#F59E0B",
                },
              ].map((tool) => (
                <div
                  key={tool.title}
                  onClick={() => handleToolClick(tool.title, tool.domain, tool.sampleDesc, tool.defaultBudget || 0)}
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 20,
                    padding: 24,
                    border: "1.5px solid #E2E8F0",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
                    cursor: "pointer",
                    transition: "transform 200ms ease, border-color 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = tool.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "#E2E8F0";
                  }}
                >
                  <div style={{ fontSize: 44, marginBottom: 14 }}>{tool.emoji}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", margin: "0 0 6px" }}>
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
                      fontWeight: 800,
                    }}
                  >
                    Click to Launch →
                  </div>
                </div>
              ))}
            </div>

            {/* General AI Chatbot */}
            <GeneralChatBot onStartTask={(desc, dom, bdg) => handleStartTask(desc, dom, bdg)} />
          </div>
        )}

        {/* ── CONFIG TAB ── */}
        {navTab === "config" && (
          <div
            style={{
              padding: "60px 36px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              minHeight: 360,
            }}
          >
            <span style={{ fontSize: 64 }}>🔧</span>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0F172A", margin: 0 }}>Configuration</h2>
            <p style={{ fontSize: 14, color: "#64748B", margin: 0, textAlign: "center", maxWidth: 360 }}>
              Settings, API keys, and workspace preferences will be configured here. Stay tuned!
            </p>
          </div>
        )}
      </div>

      {/* Floating Task Window Modal */}
      <TaskWindowModal
        isOpen={showTaskWindow}
        onClose={() => setShowTaskWindow(false)}
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        onSelectTask={(t) => setSelectedTaskId(t.id)}
        onAddTaskClick={() => { setShowTaskWindow(false); setShowAddTask(true); }}
      />

      {/* Add Task Modal */}
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
    </div>
  );
}
