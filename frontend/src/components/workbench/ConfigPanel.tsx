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
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#0F172A", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.10a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Workspace Configuration & Integrations
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
              <div style={{ background: "rgba(99,102,241,0.1)", padding: 8, borderRadius: 12 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
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
              <div style={{ background: "rgba(245,158,11,0.1)", padding: 8, borderRadius: 12 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
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
              <div style={{ background: "rgba(239,68,68,0.1)", padding: 8, borderRadius: 12 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
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
            <div style={{ background: "rgba(16,185,129,0.1)", padding: 8, borderRadius: 12 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
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
