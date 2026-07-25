"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Domain, Task, TraceEvent } from "@/lib/types";
import { useTraceStream } from "@/hooks/useTraceStream";
import { VoiceWidget } from "@/components/workbench/VoiceWidget";
import { ACPBankModal } from "@/components/modals/ACPBankModal";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { EventDetailPanel } from "@/components/trace/EventDetailPanel";
import { NumberTicker } from "@/components/magicui/NumberTicker";
import { GeneralChatBot, type ChatMessage } from "@/components/workbench/GeneralChatBot";
import { ToolParameterModal, type ToolModalConfig } from "@/components/workbench/ToolParameterModal";
import { ConfigPanel } from "@/components/workbench/ConfigPanel";
import { AssistantMessageCard } from "@/components/chat/AssistantMessageCard";

// ── Types ──────────────────────────────────────────────────────────────────────
type NavTab = "dashboard" | "tasks" | "chat" | "tools" | "config";

export interface LocalTaskItem {
  id: string;
  title: string;
  domain: Domain;
  status: string;
  budget: number;
  created_at: string;
  summaryText?: string;
  bookedDetails?: string;
  task_id?: string;
  taskObj?: Task;
  events?: TraceEvent[];
}

// ── Header Navigation TabBar ───────────────────────────────────────────────────
function TabBar({ active, onChange }: { active: NavTab; onChange: (t: NavTab) => void }) {
  const tabs: { id: NavTab; label: string; emoji: string }[] = [
    { id: "dashboard", label: "Dashboard", emoji: "🏠" },
    { id: "tasks", label: "Tasks", emoji: "📋" },
    { id: "chat", label: "Chat Assistant", emoji: "💬" },
    { id: "tools", label: "Tools", emoji: "🛠️" },
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
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(16px)",
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

// ── Dedicated Tasks Panel Component ─────────────────────────────────────────────
function DedicatedTasksPanel({
  tasks,
  selectedTask,
  onSelectTask,
  onAddTaskClick,
  onOpenACPBankModal,
  onSelectEvent,
  selectedEventId,
}: {
  tasks: LocalTaskItem[];
  selectedTask: LocalTaskItem | null;
  onSelectTask: (t: LocalTaskItem) => void;
  onAddTaskClick: () => void;
  onOpenACPBankModal: (title: string, amount: number) => void;
  onSelectEvent: (event: TraceEvent) => void;
  selectedEventId?: string;
}) {
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
        display: "flex",
        gap: 0,
        height: "calc(100vh - 160px)",
        minHeight: 520,
        background: "#FFFFFF",
        borderRadius: 24,
        margin: "24px 36px",
        border: "1px solid #E2E8F0",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      {/* Left Column: Task List */}
      <div
        style={{
          width: 320,
          borderRight: "1px solid #E2E8F0",
          background: "#F8FAFC",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0F172A" }}>My Active Tasks</h3>
          <button
            onClick={onAddTaskClick}
            style={{
              background: "linear-gradient(135deg, #6366F1, #4F46E5)",
              color: "#FFFFFF",
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

        <div style={{ flex: 1, overflowY: "auto" }}>
          {tasks.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "#64748B", fontSize: 13 }}>
              No tasks created yet. Click "+ New Task" to start one!
            </div>
          ) : (
            tasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTask(t)}
                style={{
                  padding: "16px 20px",
                  cursor: "pointer",
                  background: selectedTask?.id === t.id ? "#FFFFFF" : "transparent",
                  borderLeft: selectedTask?.id === t.id ? "4px solid #6366F1" : "4px solid transparent",
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
      </div>

      {/* Right Column: Task Output & Execution Chat (Per-task execution output!) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFFFFF", overflowY: "auto" }}>
        {selectedTask ? (
          <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Selected Task Top Banner */}
            <div style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 20 }}>📌</span>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{selectedTask.title}</h3>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
                Domain: <strong style={{ color: "#0F172A", textTransform: "capitalize" }}>{selectedTask.domain}</strong> · Status: <span style={{ color: "#10B981", fontWeight: 700 }}>Executing</span>
              </p>
            </div>

            {/* Render per-task AssistantMessageCard explicitly bound to selectedTask */}
            <AssistantMessageCard
              task={{
                task_id: selectedTask.task_id || selectedTask.id,
                status: "running",
                domain: selectedTask.domain,
                description: selectedTask.title,
                budget_ceiling: selectedTask.budget,
                budget_spent: 0,
                created_at: selectedTask.created_at,
              }}
              events={selectedTask.events || []}
              onOpenACPBankModal={onOpenACPBankModal}
              onSelectEvent={onSelectEvent}
              selectedEventId={selectedEventId}
            />
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#64748B", gap: 12 }}>
            <span style={{ fontSize: 48 }}>📋</span>
            <p style={{ fontSize: 14, margin: 0, fontWeight: 600 }}>Select a task on the left to view flight tickets, code output, or trace logs.</p>
          </div>
        )}
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
  onAddTask: (t: LocalTaskItem) => void;
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
      created_at: new Date().toISOString(),
    });
    setTitle("");
    onClose();
  };

  const aiGenerate = () => {
    const presets: Record<string, { title: string; budget: number }> = {
      trip: { title: "Plan a trip from BOM to PAR on 2026-09-15 under $800", budget: 800 },
      coding: { title: "Write a Python script for Fibonacci sequence & sorting algorithm", budget: 0 },
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
  const [activeToolModal, setActiveToolModal] = useState<ToolModalConfig | null>(null);
  const [selectedTask, setSelectedTask] = useState<LocalTaskItem | null>(null);
  const [tasks, setTasks] = useState<LocalTaskItem[]>([
    {
      id: "demo-task-1",
      title: "Plan a trip from BOM to PAR on 2026-09-15 under $800",
      domain: "trip",
      status: "completed",
      budget: 800,
      created_at: new Date().toISOString(),
      summaryText: "Air France AF224 $487 & Grand Hotel $180 booked via Linked Bank (ACP)",
    },
    {
      id: "demo-task-2",
      title: "Write a Python script for Fibonacci sequence & sorting algorithm",
      domain: "coding",
      status: "completed",
      budget: 0,
      created_at: new Date().toISOString(),
      summaryText: "Python REPL script executed with stdout output and bubble sort algorithm",
    },
  ]);

  const [persistentChatMessages, setPersistentChatMessages] = useState<ChatMessage[]>([]);
  const [acpModalState, setAcpModalState] = useState<{ isOpen: boolean; title: string; amount: number }>({
    isOpen: false,
    title: "",
    amount: 0,
  });

  const { currentTask, events, selectedEvent, setSelectedEvent, startTask } = useTraceStream();

  const userName = user?.name || "Marco";

  // Sync currentTask and events strictly into the selectedTask local item object
  useEffect(() => {
    if (currentTask && selectedTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTask.id
            ? {
                ...t,
                task_id: currentTask.task_id,
                taskObj: currentTask,
                events: events,
              }
            : t
        )
      );
      setSelectedTask((prev) =>
        prev && prev.id === selectedTask.id
          ? {
              ...prev,
              task_id: currentTask.task_id,
              taskObj: currentTask,
              events: events,
            }
          : prev
      );
    }
  }, [currentTask, events]);

  // Start task handler
  const handleStartTask = useCallback(
    async (description: string, domain: Domain | string = "trip", budget: number = 0) => {
      await startTask(description, domain as Domain, budget);
    },
    [startTask]
  );

  // Add task handler: immediately launches task and switches to Tasks view
  const handleAddTask = (newTask: LocalTaskItem) => {
    setTasks((prev) => [newTask, ...prev]);
    setSelectedTask(newTask);
    handleStartTask(newTask.title, newTask.domain, newTask.budget);
    setNavTab("tasks");
  };

  // Launch interactive tool parameter modal
  const openToolModal = (toolType: "flight" | "full_trip" | "coding" | "scheduling", title: string, emoji: string) => {
    setActiveToolModal({ toolType, title, emoji });
  };

  const handleTaskClickRedirect = (task: LocalTaskItem) => {
    setSelectedTask(task);
    setNavTab("tasks");
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
      {/* Outer Container Frame */}
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
        {/* Sticky Top Header Bar */}
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

          {/* Header Right Actions */}
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

        {/* Tab Bar with Dashboard, Tasks, Chat, Tools, Config */}
        <TabBar active={navTab} onChange={setNavTab} />

        {/* ── 1. DASHBOARD TAB ── */}
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
                <VoiceWidget
                  onSpeechInput={(text) => {
                    const newTask: LocalTaskItem = {
                      id: crypto.randomUUID(),
                      title: text,
                      domain: "trip",
                      status: "running",
                      budget: 500,
                      created_at: new Date().toISOString(),
                    };
                    handleAddTask(newTask);
                  }}
                />
              </div>

              {/* MIDDLE COLUMN: Compact Recent Task Summary Activity Cards (No Huge Cards!) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 24,
                    padding: 22,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                      📌 Recent Task Activity & Bookings
                    </h3>
                    <span style={{ fontSize: 12, color: "#6366F1", fontWeight: 700, cursor: "pointer" }} onClick={() => setNavTab("tasks")}>
                      View All ({tasks.length}) →
                    </span>
                  </div>

                  {/* Compact list of summary task links */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {tasks.map((taskItem) => (
                      <div
                        key={taskItem.id}
                        onClick={() => handleTaskClickRedirect(taskItem)}
                        style={{
                          background: "#F8FAFC",
                          border: "1.5px solid #E2E8F0",
                          borderRadius: 16,
                          padding: "14px 18px",
                          cursor: "pointer",
                          transition: "all 150ms ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
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
                        <div style={{ flex: 1, marginRight: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 16 }}>
                              {taskItem.domain === "trip" ? "✈️" : taskItem.domain === "coding" ? "💻" : "📅"}
                            </span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                              {taskItem.title}
                            </span>
                          </div>
                          <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                            {taskItem.summaryText || (taskItem.domain === "trip" ? "Air France AF224 $487.00 & Grand Hotel $180 booked via Linked Bank (ACP)" : "Code execution completed successfully.")}
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#6366F1",
                            background: "rgba(99,102,241,0.1)",
                            padding: "6px 12px",
                            borderRadius: 12,
                            whiteSpace: "nowrap",
                          }}
                        >
                          View Chat →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
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
                        onClick={() => {
                          const newTask: LocalTaskItem = {
                            id: crypto.randomUUID(),
                            title: r.title,
                            domain: r.domain,
                            status: "running",
                            budget: r.budget,
                            created_at: new Date().toISOString(),
                          };
                          handleAddTask(newTask);
                        }}
                        style={{
                          padding: "12px 14px",
                          borderRadius: 14,
                          background: "#F8FAFC",
                          border: "1.5px solid #E2E8F0",
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

        {/* ── 2. TASKS TAB ── */}
        {navTab === "tasks" && (
          <DedicatedTasksPanel
            tasks={tasks}
            selectedTask={selectedTask}
            onSelectTask={setSelectedTask}
            onAddTaskClick={() => setShowAddTask(true)}
            onOpenACPBankModal={(title, amount) => setAcpModalState({ isOpen: true, title, amount })}
            onSelectEvent={setSelectedEvent}
            selectedEventId={selectedEvent?.event_id}
          />
        )}

        {/* ── 3. CHAT ASSISTANT TAB ── */}
        {navTab === "chat" && (
          <div style={{ padding: "28px 36px", maxWidth: 960, margin: "0 auto" }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0F172A", margin: "0 0 6px" }}>
              💬 Maestro AI Chat Assistant
            </h2>
            <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 24px" }}>
              Ask general questions, check current date/time, request coding advice, or give Maestro tasks to execute.
            </p>
            <GeneralChatBot
              messages={persistentChatMessages}
              onUpdateMessages={setPersistentChatMessages}
              onStartTask={(desc, dom, bdg) => {
                const newTask: LocalTaskItem = {
                  id: crypto.randomUUID(),
                  title: desc,
                  domain: dom,
                  status: "running",
                  budget: bdg,
                  created_at: new Date().toISOString(),
                };
                handleAddTask(newTask);
              }}
            />
          </div>
        )}

        {/* ── 4. TOOLS TAB ── */}
        {navTab === "tools" && (
          <div style={{ padding: "28px 36px" }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0F172A", margin: "0 0 6px" }}>
              🛠️ Maestro Tools
            </h2>
            <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 28px" }}>
              Select a specialized tool below to configure your parameters and launch an autonomous task!
            </p>

            {/* Tool Bento Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 24,
              }}
            >
              {[
                {
                  title: "Flight Ticket Search",
                  emoji: "✈️",
                  desc: "Search & compare flight tickets between origin and destination with direct ACP bank booking.",
                  toolType: "flight" as const,
                  color: "#3B82F6",
                },
                {
                  title: "Full Trip & Hotel Planner",
                  emoji: "🏨",
                  desc: "Plan a complete trip including flight tickets AND hotel reservations for your stay.",
                  toolType: "full_trip" as const,
                  color: "#8B5CF6",
                },
                {
                  title: "Code Runner",
                  emoji: "💻",
                  desc: "Specify code requirements in Python or JS for real-time REPL execution.",
                  toolType: "coding" as const,
                  color: "#10B981",
                },
                {
                  title: "Scheduler",
                  emoji: "📅",
                  desc: "Set meeting title, participants, and date/time slot to check calendar availability.",
                  toolType: "scheduling" as const,
                  color: "#F59E0B",
                },
              ].map((tool) => (
                <div
                  key={tool.title}
                  onClick={() => openToolModal(tool.toolType, tool.title, tool.emoji)}
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 20,
                    padding: 26,
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
                      marginTop: 18,
                      display: "inline-block",
                      padding: "6px 14px",
                      borderRadius: 20,
                      background: `${tool.color}18`,
                      color: tool.color,
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    Configure & Launch →
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 5. CONFIG TAB ── */}
        {navTab === "config" && <ConfigPanel />}
      </div>

      {/* Interactive Tool Parameter Modal */}
      <ToolParameterModal
        config={activeToolModal}
        onClose={() => setActiveToolModal(null)}
        onSubmitTask={(prompt, dom, bdg) => {
          const newTask: LocalTaskItem = {
            id: crypto.randomUUID(),
            title: prompt,
            domain: dom,
            status: "running",
            budget: bdg,
            created_at: new Date().toISOString(),
          };
          handleAddTask(newTask);
        }}
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
