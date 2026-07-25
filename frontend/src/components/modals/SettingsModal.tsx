"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [groqKey, setGroqKey] = useState("");
  const [openRouterKey, setOpenRouterKey] = useState("");
  const [googleCalKey, setGoogleCalKey] = useState("");
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200,
          padding: 20,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="glass"
          style={{
            width: "100%",
            maxWidth: 520,
            borderRadius: "var(--radius-lg)",
            padding: 28,
            border: "var(--glass-border)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>⚙️</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                Settings & Custom Integrations
              </h3>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontSize: 18 }}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Groq API Key</label>
              <input
                type="password"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 12px",
                  color: "#fff",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  marginTop: 4,
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>OpenRouter API Key</label>
              <input
                type="password"
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
                placeholder="sk-or-v1-..."
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 12px",
                  color: "#fff",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  marginTop: 4,
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Google Calendar API Key (Optional)</label>
              <input
                type="password"
                value={googleCalKey}
                onChange={(e) => setGoogleCalKey(e.target.value)}
                placeholder="AIzaSy..."
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 12px",
                  color: "#fff",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  marginTop: 4,
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  background: saved ? "var(--color-emerald)" : "var(--color-indigo)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  padding: "12px",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                {saved ? "Settings Saved ✓" : "Save Keys & Configuration"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
