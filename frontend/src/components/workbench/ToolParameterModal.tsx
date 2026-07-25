"use client";

import React, { useState } from "react";
import type { Domain } from "@/lib/types";

export interface ToolModalConfig {
  toolType: "trip" | "coding" | "scheduling" | "voice";
  title: string;
  emoji: string;
}

interface ToolParameterModalProps {
  config: ToolModalConfig | null;
  onClose: () => void;
  onSubmitTask: (prompt: string, domain: Domain, budget: number) => void;
}

export const ToolParameterModal: React.FC<ToolParameterModalProps> = ({
  config,
  onClose,
  onSubmitTask,
}) => {
  // Trip fields
  const [origin, setOrigin] = useState("BOM");
  const [destination, setDestination] = useState("PAR");
  const [travelDate, setTravelDate] = useState("2026-09-15");
  const [tripBudget, setTripBudget] = useState("800");

  // Coding fields
  const [codePrompt, setCodePrompt] = useState("Write a Python script for Fibonacci sequence & sorting algorithm");
  const [codeLanguage, setCodeLanguage] = useState("python");

  // Scheduling fields
  const [eventTitle, setEventTitle] = useState("Weekly Strategy Sync");
  const [participants, setParticipants] = useState("team@maestro.ai");
  const [meetingDate, setMeetingDate] = useState("2026-09-20 10:00 AM");

  if (!config) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.toolType === "trip") {
      const prompt = `Plan a trip from ${origin.trim()} to ${destination.trim()} on ${travelDate} under $${tripBudget}`;
      onSubmitTask(prompt, "trip", Number(tripBudget) || 800);
    } else if (config.toolType === "coding") {
      const prompt = `Write ${codeLanguage} code for: ${codePrompt.trim()}`;
      onSubmitTask(prompt, "coding", 0);
    } else if (config.toolType === "scheduling") {
      const prompt = `Schedule meeting "${eventTitle.trim()}" with ${participants.trim()} at ${meetingDate}`;
      onSubmitTask(prompt, "scheduling", 0);
    }
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 450,
        background: "rgba(15, 23, 42, 0.65)",
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

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 28 }}>{config.emoji}</span>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", margin: 0 }}>{config.title}</h2>
            <span style={{ fontSize: 12, color: "#64748B" }}>Enter your parameters for dynamic execution</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Trip Planner Form */}
          {config.toolType === "trip" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
                    Origin (City/IATA)
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g. NYC, BOM, DEL"
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
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
                    Destination (City/IATA)
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. PAR, TYO, LON"
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
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
                    Travel Date
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
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
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
                    Max Budget ($)
                  </label>
                  <input
                    type="number"
                    value={tripBudget}
                    onChange={(e) => setTripBudget(e.target.value)}
                    min={50}
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
                  />
                </div>
              </div>
            </>
          )}

          {/* Coding Form */}
          {config.toolType === "coding" && (
            <>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
                  Code Requirement
                </label>
                <textarea
                  value={codePrompt}
                  onChange={(e) => setCodePrompt(e.target.value)}
                  rows={3}
                  placeholder="Describe what code you want to generate..."
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
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
                  Language
                </label>
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
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
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript / TypeScript</option>
                </select>
              </div>
            </>
          )}

          {/* Scheduling Form */}
          {config.toolType === "scheduling" && (
            <>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Strategy Sync"
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
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
                    Participants
                  </label>
                  <input
                    type="text"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                    placeholder="e.g. alex@example.com"
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
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
                    Date & Time
                  </label>
                  <input
                    type="text"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    placeholder="e.g. 2026-09-20 10:00 AM"
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
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            style={{
              marginTop: 10,
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
            Launch Agentic Task →
          </button>
        </form>
      </div>
    </div>
  );
};
