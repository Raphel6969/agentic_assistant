"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Domain } from "@/lib/types";
import { useTraceStream } from "@/hooks/useTraceStream";
import { VoiceWidget } from "@/components/workbench/VoiceWidget";
import { QuickRequests } from "@/components/workbench/QuickRequests";
import { AssistantMessageCard } from "@/components/chat/AssistantMessageCard";
import { ChatInputBar } from "@/components/layout/ChatInputBar";
import { ACPBankModal } from "@/components/modals/ACPBankModal";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { EventDetailPanel } from "@/components/trace/EventDetailPanel";
import { ShimmerButton } from "@/components/magicui/ShimmerButton";
import { NumberTicker } from "@/components/magicui/NumberTicker";

export default function MaestroWorkbench() {
  const { user, logout } = useAuth();
  const [selectedDomain, setSelectedDomain] = useState<Domain>("trip");
  const [activeTab, setActiveTab] = useState<"private" | "team">("team");
  const [navTab, setNavTab] = useState<"dashboard" | "tasks" | "productivity" | "architecture">("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const [acpModalState, setAcpModalState] = useState<{ isOpen: boolean; title: string; amount: number }>({
    isOpen: false,
    title: "",
    amount: 0,
  });

  const {
    currentTask,
    events,
    selectedEvent,
    setSelectedEvent,
    isLoading,
    error,
    startTask,
  } = useTraceStream();

  const userName = user?.name || "Marco";

  const handleStartTask = async (description: string, domain: Domain = "trip", budget: number = 500) => {
    await startTask(description, domain, budget);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #D4E7FE 0%, #EBF4FF 50%, #DBEAFE 100%)",
        fontFamily: "var(--font-sans), sans-serif",
        color: "#1E293B",
        display: "flex",
        flexDirection: "column",
        padding: 16,
        overflowY: "auto",
      }}
    >
      {/* Outer Container Frame */}
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          width: "100%",
          background: "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          borderRadius: 32,
          border: "1px solid rgba(255, 255, 255, 0.8)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
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
            padding: "18px 36px",
            borderBottom: "1px solid rgba(255,255,255,0.8)",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "32px 32px 0 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>✳</span>
            <span style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 24, fontWeight: 700, color: "#0F172A" }}>
              maestro
            </span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 13, fontWeight: 600, color: "#475569" }}>
            <button onClick={() => setNavTab("dashboard")} style={{ background: "none", border: "none", color: navTab === "dashboard" ? "#0F172A" : "inherit", cursor: "pointer", fontWeight: navTab === "dashboard" ? 700 : 500 }}>
              Dashboard
            </button>
            <button onClick={() => setNavTab("tasks")} style={{ background: "none", border: "none", color: navTab === "tasks" ? "#0F172A" : "inherit", cursor: "pointer", fontWeight: navTab === "tasks" ? 700 : 500 }}>
              Tasks
            </button>
            <button onClick={() => setNavTab("productivity")} style={{ background: "none", border: "none", color: navTab === "productivity" ? "#0F172A" : "inherit", cursor: "pointer", fontWeight: navTab === "productivity" ? 700 : 500 }}>
              Productivity
            </button>
            <button onClick={() => setNavTab("architecture")} style={{ background: "none", border: "none", color: navTab === "architecture" ? "#0F172A" : "inherit", cursor: "pointer", fontWeight: navTab === "architecture" ? 700 : 500 }}>
              AI Analysis
            </button>
          </nav>

          {/* Private / Team Toggle & Profile */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ background: "#E2E8F0", padding: 3, borderRadius: 24, display: "flex", alignItems: "center" }}>
              <button
                onClick={() => setActiveTab("private")}
                style={{
                  background: activeTab === "private" ? "#FFFFFF" : "transparent",
                  color: activeTab === "private" ? "#0F172A" : "#64748B",
                  border: "none",
                  borderRadius: 20,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Private
              </button>
              <button
                onClick={() => setActiveTab("team")}
                style={{
                  background: activeTab === "team" ? "#0F172A" : "transparent",
                  color: activeTab === "team" ? "#FFFFFF" : "#64748B",
                  border: "none",
                  borderRadius: 20,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Team
              </button>
            </div>

            <button
              onClick={() => setShowSettings(true)}
              title="Settings"
              style={{ background: "#FFFFFF", border: "none", width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            >
              ⚙️
            </button>

            <button onClick={logout} style={{ background: "none", border: "none", color: "#64748B", fontSize: 12, cursor: "pointer" }}>
              Sign Out
            </button>
          </div>
        </header>

        {/* Sub-Header: Serif Greeting & Today's Tasks */}
        <div style={{ padding: "24px 36px 12px 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
              alt={userName}
              style={{ width: 44, height: 44, borderRadius: "50%", background: "#6366F1" }}
            />
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
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", margin: 0 }}>Today's Tasks</h2>

          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#64748B" }}>
            <span>Team:</span>
            <div style={{ display: "flex", alignItems: "center", marginLeft: 4 }}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid #fff" }} alt="Alex" />
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid #fff", marginLeft: -6 }} alt="Sarah" />
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=David" style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid #fff", marginLeft: -6 }} alt="David" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#475569", marginLeft: 4 }}>+9</span>
            </div>
          </div>
        </div>

        {/* 3-Column Layout (Fully Scrollable) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr 340px",
            gap: 24,
            padding: "16px 36px 36px 36px",
            flex: 1,
          }}
        >
          {/* LEFT COLUMN: Project & Productivity Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* VinTeX Project Card */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(20px)",
                borderRadius: 20,
                padding: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid rgba(255, 255, 255, 0.9)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEF08A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                  ✳
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>VinTeX Project</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>Design & Development</div>
                </div>
              </div>
              <span style={{ color: "#64748B", fontSize: 12 }}>˅</span>
            </div>

            {/* 85% Productivity Ring Widget */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(20px)",
                borderRadius: 24,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                border: "1px solid rgba(255, 255, 255, 0.9)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: 72,
                  fontWeight: 400,
                  color: "#0F172A",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                <NumberTicker value={85} suffix="%" />
              </div>
              <div style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>Today's productivity</div>
            </div>

            {/* Project Activity (Statistic) Yellow Card */}
            <div
              style={{
                background: "linear-gradient(135deg, #FDE047, #FACC15)",
                borderRadius: 24,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                boxShadow: "0 10px 25px rgba(234, 179, 8, 0.25)",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Project Activity</span>
                <span style={{ fontSize: 10, fontWeight: 800, background: "#FFFFFF", padding: "2px 8px", borderRadius: 10, color: "#0F172A" }}>
                  Statistic 🌿
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 4 }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>26h</div>
                  <div style={{ fontSize: 10, color: "#713F12", fontWeight: 600 }}>Sync Calls</div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>11h</div>
                  <div style={{ fontSize: 10, color: "#713F12", fontWeight: 600 }}>Workshops</div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>6h</div>
                  <div style={{ fontSize: 10, color: "#713F12", fontWeight: 600 }}>Reviews</div>
                </div>
              </div>

              <button
                style={{
                  position: "absolute",
                  bottom: -10,
                  right: 20,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#0F172A",
                  color: "#fff",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                ✏️
              </button>
            </div>
          </div>

          {/* MIDDLE COLUMN: Task Cards & Agent Execution Stage */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Task Card 1: Weekly Strategy Sync */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 24,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                boxShadow: "0 6px 20px rgba(0,0,0,0.03)",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>📞</span>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>Weekly Strategy Sync</h4>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, background: "#10B981", color: "#fff", padding: "3px 10px", borderRadius: 12 }}>
                  Meeting
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, fontSize: 11, color: "#64748B" }}>
                <div>
                  <div style={{ color: "#94A3B8" }}>When:</div>
                  <div style={{ fontWeight: 600, color: "#334155" }}>Today, 10:00 AM</div>
                </div>
                <div>
                  <div style={{ color: "#94A3B8" }}>Team:</div>
                  <div style={{ fontWeight: 600, color: "#334155" }}>Marketing & Growth</div>
                </div>
                <div>
                  <div style={{ color: "#94A3B8" }}>Reminder:</div>
                  <div style={{ fontWeight: 600, color: "#334155" }}>15 min</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748B" }}>
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marco" style={{ width: 22, height: 22, borderRadius: "50%" }} alt="Marco" />
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" style={{ width: 22, height: 22, borderRadius: "50%", marginLeft: -8 }} alt="Sarah" />
                  <span style={{ fontWeight: 700, marginLeft: 4 }}>+7 Ready to join?</span>
                </div>

                <button
                  style={{
                    background: "#F1F5F9",
                    color: "#334155",
                    border: "none",
                    borderRadius: 20,
                    padding: "8px 16px",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Join a meeting
                </button>
              </div>
            </div>

            {/* Task Card 2: Design Review WITH ✨ Ask AI to start Button */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 24,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                border: "1px solid rgba(0,0,0,0.06)",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>📊</span>
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr", gap: 12, fontSize: 11, color: "#64748B" }}>
                <div>
                  <div style={{ color: "#94A3B8" }}>Topic:</div>
                  <div style={{ fontWeight: 600, color: "#334155" }}>VinTeX Website</div>
                </div>
                <div>
                  <div style={{ color: "#94A3B8" }}>Description:</div>
                  <div style={{ fontWeight: 600, color: "#334155" }}>Check design of the main page</div>
                </div>
                <div>
                  <div style={{ color: "#94A3B8" }}>Deadline:</div>
                  <div style={{ fontWeight: 600, color: "#334155" }}>Mar 22</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748B" }}>
                  <span>Performers:</span>
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marco" style={{ width: 22, height: 22, borderRadius: "50%", marginLeft: 4 }} alt="Marco" />
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" style={{ width: 22, height: 22, borderRadius: "50%", marginLeft: -8 }} alt="Elena" />
                </div>

                {/* Magic UI Shimmer ✨ Ask AI to start Button */}
                <ShimmerButton
                  onClick={() => handleStartTask("Review design of main page and write Python script to validate layout metrics", "trip", 500)}
                  background="#0F172A"
                  style={{ padding: "8px 18px", fontSize: 12 }}
                >
                  ✨ Ask AI to start
                </ShimmerButton>
              </div>
            </div>

            {/* Agent Chat Thread Stage */}
            {currentTask && (
              <div style={{ marginTop: 10 }}>
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

          {/* RIGHT COLUMN: Quick Requests & Voice Tasks */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <QuickRequests onSelectPrompt={(prompt) => handleStartTask(prompt, "trip", 500)} />

            <VoiceWidget onSpeechInput={(text) => handleStartTask(text, "trip", 500)} />
          </div>
        </div>

        {/* Bottom Chat Input Bar */}
        <ChatInputBar
          onStartTask={handleStartTask}
          isLoading={isLoading}
          selectedDomain={selectedDomain}
        />
      </div>

      <ACPBankModal
        isOpen={acpModalState.isOpen}
        onClose={() => setAcpModalState({ ...acpModalState, isOpen: false })}
        itemTitle={acpModalState.title}
        amount={acpModalState.amount}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <EventDetailPanel
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
