"use client";

import React, { useRef, useEffect } from "react";
import type { TraceEvent } from "@/lib/types";
import { TraceEventNode } from "./TraceEventNode";

interface FlightRecorderProps {
  events: TraceEvent[];
  selectedEvent: TraceEvent | null;
  onSelectEvent: (event: TraceEvent) => void;
}

export const FlightRecorder: React.FC<FlightRecorderProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  return (
    <main
      style={{
        gridRow: "2 / 3",
        overflowY: "auto",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <h3 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)" }}>
          Flight Recorder — Execution Trace
        </h3>
        <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--color-text-muted)" }}>
          {events.length} events logged
        </span>
      </div>

      {events.length === 0 ? (
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
            gap: 12,
          }}
        >
          <div style={{ fontSize: 32 }}>⚡</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Ready for Task Execution</div>
          <div style={{ fontSize: 13, maxWidth: 400 }}>
            Enter a prompt below (e.g. &quot;Plan a trip from BOM to CDG under $600&quot;). The live execution trace graph will populate here in real-time.
          </div>
        </div>
      ) : (
        events.map((event) => (
          <TraceEventNode
            key={event.event_id}
            event={event}
            isSelected={selectedEvent?.event_id === event.event_id}
            onSelect={onSelectEvent}
          />
        ))
      )}

      <div ref={bottomRef} />
    </main>
  );
};
