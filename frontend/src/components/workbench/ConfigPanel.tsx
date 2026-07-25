"use client";

import React, { useState } from "react";

export const ConfigPanel: React.FC = () => {
  const [bankConnected, setBankConnected] = useState(true);
  const [calendarConnected, setCalendarConnected] = useState(true);
  const [gmailConnected, setGmailConnected] = useState(true);
  const [acpLimit, setAcpLimit] = useState(1000);
  const [autoApprove, setAutoApprove] = useState(true);

  return (
    <div style={{ padding: "28px 36px", maxWidth: 1040, margin: "0 auto", fontFamily: "var(--font-sans), sans-serif" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#0F172A", margin: "0 0 6px" }}>
          ⚙️ Workspace Configuration & Integrations
        </h2>
        <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
          Manage your connected accounts, ACP bank protocol limits, and calendar/email tools.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* CARD 1: Linked Bank Account & ACP Protocol */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: 24,
            border: "1.5px solid #E2E8F0",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 26 }}>🏦</span>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                  Linked Bank Account (ACP)
                </h3>
                <span style={{ fontSize: 11, color: "#64748B" }}>Agentic Commerce Protocol</span>
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                background: bankConnected ? "#D1FAE5" : "#FEE2E2",
                color: bankConnected ? "#10B981" : "#EF4444",
                padding: "3px 10px",
                borderRadius: 12,
              }}
            >
              {bankConnected ? "Connected ✓" : "Disconnected"}
            </span>
          </div>

          <div
            style={{
              background: "#F8FAFC",
              borderRadius: 16,
              padding: 16,
              border: "1px solid #E2E8F0",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#64748B" }}>Bank Name:</span>
              <strong style={{ color: "#0F172A" }}>Chase Premier Checking</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#64748B" }}>Account Number:</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "#0F172A", fontWeight: 700 }}>**** **** 4892</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#64748B" }}>Available Balance:</span>
              <strong style={{ color: "#10B981", fontFamily: "var(--font-mono)" }}>$5,240.00</strong>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", display: "block", marginBottom: 6 }}>
              Instant ACP Auto-Approval Ceiling: ${acpLimit}
            </label>
            <input
              type="range"
              min={100}
              max={3000}
              step={100}
              value={acpLimit}
              onChange={(e) => setAcpLimit(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#6366F1" }}
            />
            <span style={{ fontSize: 11, color: "#94A3B8" }}>
              Transactions under ${acpLimit} are auto-approved via ACP cryptographic bank tokens.
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>Require 2FA biometric confirmation</span>
            <input
              type="checkbox"
              checked={autoApprove}
              onChange={(e) => setAutoApprove(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: "#6366F1", cursor: "pointer" }}
            />
          </div>
        </div>

        {/* CARD 2: Google Calendar Integration */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: 24,
            border: "1.5px solid #E2E8F0",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 26 }}>📅</span>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                  Google Calendar Integration
                </h3>
                <span style={{ fontSize: 11, color: "#64748B" }}>Automated Meeting Scheduling</span>
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                background: calendarConnected ? "#D1FAE5" : "#FEE2E2",
                color: calendarConnected ? "#10B981" : "#EF4444",
                padding: "3px 10px",
                borderRadius: 12,
              }}
            >
              {calendarConnected ? "Synced ✓" : "Not Synced"}
            </span>
          </div>

          <div
            style={{
              background: "#F8FAFC",
              borderRadius: 16,
              padding: 16,
              border: "1px solid #E2E8F0",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#64748B" }}>Connected Account:</span>
              <strong style={{ color: "#0F172A" }}>marco@maestro.ai</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#64748B" }}>Primary Calendar:</span>
              <span style={{ color: "#0F172A", fontWeight: 600 }}>Work & Strategy Calendar</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#64748B" }}>Conflict Checking:</span>
              <span style={{ color: "#10B981", fontWeight: 700 }}>Enabled (Nager.Date API)</span>
            </div>
          </div>

          <button
            onClick={() => setCalendarConnected(!calendarConnected)}
            style={{
              background: calendarConnected ? "#F1F5F9" : "linear-gradient(135deg, #6366F1, #4F46E5)",
              color: calendarConnected ? "#0F172A" : "#FFFFFF",
              border: "none",
              borderRadius: 12,
              padding: "10px 0",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {calendarConnected ? "Disconnect Calendar" : "+ Connect Google Calendar"}
          </button>
        </div>

        {/* CARD 3: Gmail & Email Integration */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: 24,
            border: "1.5px solid #E2E8F0",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 26 }}>✉️</span>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                  Gmail & Email Assistant
                </h3>
                <span style={{ fontSize: 11, color: "#64748B" }}>Automated Drafts & Invites</span>
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                background: gmailConnected ? "#D1FAE5" : "#FEE2E2",
                color: gmailConnected ? "#10B981" : "#EF4444",
                padding: "3px 10px",
                borderRadius: 12,
              }}
            >
              {gmailConnected ? "Connected ✓" : "Not Connected"}
            </span>
          </div>

          <div
            style={{
              background: "#F8FAFC",
              borderRadius: 16,
              padding: 16,
              border: "1px solid #E2E8F0",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#64748B" }}>Inbox Address:</span>
              <strong style={{ color: "#0F172A" }}>marco@maestro.ai</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#64748B" }}>Drafting Permission:</span>
              <span style={{ color: "#10B981", fontWeight: 700 }}>Read & Draft Only</span>
            </div>
          </div>

          <button
            onClick={() => setGmailConnected(!gmailConnected)}
            style={{
              background: gmailConnected ? "#F1F5F9" : "linear-gradient(135deg, #EF4444, #DC2626)",
              color: gmailConnected ? "#0F172A" : "#FFFFFF",
              border: "none",
              borderRadius: 12,
              padding: "10px 0",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {gmailConnected ? "Disconnect Gmail" : "+ Connect Gmail Account"}
          </button>
        </div>

        {/* CARD 4: LLM Model & API Key Configuration */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: 24,
            border: "1.5px solid #E2E8F0",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 26 }}>🤖</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                AI Model & API Keys
              </h3>
              <span style={{ fontSize: 11, color: "#64748B" }}>LLM Providers & Failover Config</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
              Gemini API Key
            </label>
            <input
              type="password"
              value="AIzaSyA88923_demo_key_configured"
              readOnly
              style={{
                width: "100%",
                border: "1.5px solid #E2E8F0",
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: 13,
                color: "#0F172A",
                background: "#F8FAFC",
                fontFamily: "var(--font-mono)",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
              Groq API Key (Failover Provider)
            </label>
            <input
              type="password"
              value="gsk_9921_groq_demo_key"
              readOnly
              style={{
                width: "100%",
                border: "1.5px solid #E2E8F0",
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: 13,
                color: "#0F172A",
                background: "#F8FAFC",
                fontFamily: "var(--font-mono)",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
