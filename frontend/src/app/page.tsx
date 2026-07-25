"use client";

import React, { useState } from "react";
import type { Domain } from "@/lib/types";
import { useTraceStream } from "@/hooks/useTraceStream";
import { Header } from "@/components/layout/Header";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { ChatInputBar } from "@/components/layout/ChatInputBar";
import { FlightRecorder } from "@/components/trace/FlightRecorder";
import { EventDetailPanel } from "@/components/trace/EventDetailPanel";
import { ApprovalModal } from "@/components/modals/ApprovalModal";

export default function Home() {
  const [selectedDomain, setSelectedDomain] = useState<Domain>("trip");
  const {
    currentTask,
    events,
    selectedEvent,
    setSelectedEvent,
    isLoading,
    error,
    startTask,
  } = useTraceStream();

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
      />

      <FlightRecorder
        events={events}
        selectedEvent={selectedEvent}
        onSelectEvent={setSelectedEvent}
      />

      <EventDetailPanel
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <ApprovalModal
        event={events.find((e) => e.guardrail_result === "requires_approval") || null}
        taskId={currentTask?.task_id || ""}
        onResolved={(approved) => {
          console.log("Approval resolved:", approved);
        }}
      />

      <ChatInputBar
        onStartTask={(desc, domain, budget) => startTask(desc, domain, budget)}
        isLoading={isLoading}
        selectedDomain={selectedDomain}
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
