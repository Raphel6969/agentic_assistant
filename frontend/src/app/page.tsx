"use client";

import React, { useState } from "react";
import type { Domain, Task, TraceEvent } from "@/lib/types";
import { useTraceStream } from "@/hooks/useTraceStream";
import { Header } from "@/components/layout/Header";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { ChatInputBar } from "@/components/layout/ChatInputBar";
import { EventDetailPanel } from "@/components/trace/EventDetailPanel";
import { ApprovalModal } from "@/components/modals/ApprovalModal";
import { ACPBankModal } from "@/components/modals/ACPBankModal";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { AssistantMessageCard } from "@/components/chat/AssistantMessageCard";

export default function Home() {
  const [selectedDomain, setSelectedDomain] = useState<Domain>("trip");
  const [tasksHistory, setTasksHistory] = useState<Task[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [acpModalState, setAcpModalState] = useState<{ isOpen: boolean; title: string; amount: number }>({
    isOpen: false,
    title: "",
    amount: 0,
  });
  const [ragDocsCount, setRagDocsCount] = useState(1);

  const {
    currentTask,
    events,
    selectedEvent,
    setSelectedEvent,
    isLoading,
    error,
    startTask,
  } = useTraceStream();

  const handleStartTask = async (description: string, domain: Domain, budget: number) => {
    await startTask(description, domain, budget);
  };

  // Add task to task history when initialized
  React.useEffect(() => {
    if (currentTask && !tasksHistory.some((t) => t.task_id === currentTask.task_id)) {
      setTasksHistory((prev) => [currentTask, ...prev]);
    }
  }, [currentTask, tasksHistory]);

  const handleUploadDoc = (docName: string, text: string) => {
    setRagDocsCount((prev) => prev + 1);
    alert(`Indexed document '${docName}' (${text.length} chars) into RAG Knowledge Base!`);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "var(--header-height) 1fr var(--input-bar-height)",
        gridTemplateColumns: "var(--sidebar-width) 1fr",
        height: "100vh",
        overflow: "hidden",
        background: "var(--color-base)",
      }}
    >
      <Header task={currentTask} />

      <LeftSidebar
        selectedDomain={selectedDomain}
        onSelectDomain={setSelectedDomain}
        tasksHistory={tasksHistory}
        onSelectTaskSession={() => {}}
        onOpenSettings={() => setShowSettings(true)}
        ragDocsCount={ragDocsCount}
      />

      {/* Main Stage — Universal Agentic Chat Thread */}
      <main
        style={{
          gridRow: "2 / 3",
          overflowY: "auto",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {!currentTask && events.length === 0 ? (
          <div
            className="glass"
            style={{
              padding: 40,
              borderRadius: "var(--radius-lg)",
              textAlign: "center",
              color: "var(--color-text-muted)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              margin: "auto 0",
            }}
          >
            <div style={{ fontSize: 36 }}>✨</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
              Universal Agentic Assistant
            </div>
            <div style={{ fontSize: 13, maxWidth: 480, lineHeight: 1.6 }}>
              Ask anything — write Python code, compare product prices, check calendar availability, or plan trips. Every action runs over an audited state machine with mechanically enforced policy rules.
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 10 }}>
              <button
                onClick={() => handleStartTask("Write a Python script to calculate Fibonacci sequence", "trip", 500)}
                className="glass card-interactive"
                style={{ padding: "8px 14px", borderRadius: "var(--radius-md)", color: "#fff", fontSize: 12, border: "1px solid var(--color-border)" }}
              >
                💻 Write Fibonacci Python Script
              </button>
              <button
                onClick={() => handleStartTask("Plan a 3-day trip from BOM to CDG Paris under $600", "trip", 600)}
                className="glass card-interactive"
                style={{ padding: "8px 14px", borderRadius: "var(--radius-md)", color: "#fff", fontSize: 12, border: "1px solid var(--color-border)" }}
              >
                ✈️ Plan Trip to Paris under $600
              </button>
              <button
                onClick={() => handleStartTask("Find a free slot next week for a 3-person team sync", "scheduling", 200)}
                className="glass card-interactive"
                style={{ padding: "8px 14px", borderRadius: "var(--radius-md)", color: "#fff", fontSize: 12, border: "1px solid var(--color-border)" }}
              >
                📅 Check Team Calendar Availability
              </button>
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
      </main>

      <EventDetailPanel
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <ApprovalModal
        event={events.find((e) => e.guardrail_result === "requires_approval") || null}
        taskId={currentTask?.task_id || ""}
        onResolved={() => {}}
      />

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

      <ChatInputBar
        onStartTask={handleStartTask}
        isLoading={isLoading}
        selectedDomain={selectedDomain}
        onUploadDoc={handleUploadDoc}
      />

      {error && (
        <div
          style={{
            position: "fixed",
            bottom: 95,
            right: 20,
            background: "rgba(244, 63, 94, 0.9)",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "var(--radius-md)",
            fontSize: 13,
            zIndex: 100,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
