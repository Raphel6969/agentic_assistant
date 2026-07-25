"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Domain, Task } from "@/lib/types";
import { useTraceStream } from "@/hooks/useTraceStream";
import { VoiceWidget } from "@/components/workbench/VoiceWidget";
import { QuickRequests } from "@/components/workbench/QuickRequests";
import { AssistantMessageCard } from "@/components/chat/AssistantMessageCard";
import { ChatInputBar } from "@/components/layout/ChatInputBar";
import { ACPBankModal } from "@/components/modals/ACPBankModal";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { EventDetailPanel } from "@/components/trace/EventDetailPanel";

export default function MaestroWorkbench() {
  const { user, logout } = useAuth();
  const [selectedDomain, setSelectedDomain] = useState<Domain>("trip");
  const [activeTab, setActiveTab] = useState<"private" | "team">("team");
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
        fontFamily: "'Inter', sans-serif",
        color: "#1E293B",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Header Bar (Inspired by Reference Image) */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 36px",
          borderBottom: "1px solid rgba(255,255,255,0.6)",
          background: "rgba(255,255,255,0.4)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "10px",
              background: "#1E293B",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🎼
          </div>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: "#0F172A" }}>
            Maestro
          </span>
        </div>

        {/* Private / Team Toggle */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.05)",
            padding: 4,
            borderRadius: 30,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <button
            onClick={() => setActiveTab("private")}
            style={{
              background: activeTab === "private" ? "#FFFFFF" : "transparent",
              color: activeTab === "private" ? "#0F172A" : "#64748B",
              border: "none",
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: activeTab === "private" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
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
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: activeTab === "team" ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
            }}
          >
            Team
          </button>
        </div>

        {/* User Profile & Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => setShowSettings(true)}
            title="Settings"
            style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}
          >
            ⚙️
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
              alt={userName}
              style={{ width: 34, height: 34, borderRadius: "50%", background: "#E0E7FF" }}
            />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>{userName}</span>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            style={{ background: "none", border: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "360px 1fr",
          gap: 24,
          maxWidth: 1400,
          margin: "0 auto",
          width: "100%",
          padding: 24,
          flex: 1,
        }}
      >
        {/* Left Column: Greeting, Voice Tasks, Quick Requests */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Serif Greeting (Inspired by "Hi, Marco!" reference) */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
              alt={userName}
              style={{ width: 44, height: 44, borderRadius: "50%", background: "#6366F1" }}
            />
            <h2
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 34,
                fontWeight: 400,
                color: "#0F172A",
                letterSpacing: "-0.02em",
              }}
            >
              Hi, {userName}!
            </h2>
          </div>

          <VoiceWidget onSpeechInput={(text) => handleStartTask(text, "trip", 500)} />

          <QuickRequests onSelectPrompt={(prompt) => handleStartTask(prompt, "trip", 500)} />
        </div>

        {/* Right Column: Universal Agent Chat & Execution Stage */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: 24,
            border: "1px solid rgba(255, 255, 255, 0.9)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>✨</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                Maestro Autonomous Agent Stage
              </h3>
            </div>
            <span style={{ fontSize: 12, color: "#10B981", fontWeight: 600, background: "rgba(16, 185, 129, 0.1)", padding: "4px 10px", borderRadius: 20 }}>
              Rust Policy Engine Active ✓
            </span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, minHeight: 400 }}>
            {!currentTask && events.length === 0 ? (
              <div style={{ textAlign: "center", margin: "auto 0", color: "#64748B", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
                <div style={{ fontSize: 32 }}>🎼</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#1E293B" }}>Select a quick request or ask Maestro anything!</div>
                <div style={{ fontSize: 13, maxWidth: 420 }}>
                  Try: "Write a Python script to calculate Fibonacci", "Plan a 3-day trip to Paris under $600", or "Check calendar availability".
                </div>
              </div>
            ) : (
              currentTask && (
                <AssistantMessageCard
                  task={currentTask}
                  events={events}
                  onOpenACPBankModal={(title, amount) => setAcpModalState({ isOpen: true, title, amount })}
                  onSelectEvent={setSelectedEvent}
                  selectedEventId={selectedEvent?.event_id}
                />
              )
            )}
          </div>

          <ChatInputBar
            onStartTask={handleStartTask}
            isLoading={isLoading}
            selectedDomain={selectedDomain}
          />
        </div>
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
