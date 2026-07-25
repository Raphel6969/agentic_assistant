"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { login, guestLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await login(email, name || "Marco");
    router.push("/app");
  };

  const handleGuest = async () => {
    await guestLogin();
    router.push("/app");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #D4E7FE 0%, #EBF4FF 50%, #DBEAFE 100%)",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 24,
          padding: 36,
          border: "1px solid rgba(255, 255, 255, 0.9)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>🎼</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 400, color: "#0F172A" }}>
            {isRegister ? "Create Maestro Account" : "Sign in to Maestro"}
          </h2>
          <p style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
            Store your chats, preferences, and agent execution traces.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marco"
                required
                style={{
                  width: "100%",
                  background: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 12,
                  padding: "12px 14px",
                  fontSize: 14,
                  marginTop: 4,
                  outline: "none",
                }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="marco@maestro.ai"
              required
              style={{
                width: "100%",
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 12,
                padding: "12px 14px",
                fontSize: 14,
                marginTop: 4,
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 12,
                padding: "12px 14px",
                fontSize: 14,
                marginTop: 4,
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: "#1E293B",
              color: "#fff",
              border: "none",
              borderRadius: 30,
              padding: "14px",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              marginTop: 6,
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
            }}
          >
            {isRegister ? "Create Account →" : "Sign In →"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
          <span style={{ fontSize: 11, color: "#94A3B8" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
        </div>

        <button
          onClick={handleGuest}
          style={{
            background: "#6366F1",
            color: "#fff",
            border: "none",
            borderRadius: 30,
            padding: "14px",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.3)",
          }}
        >
          ⚡ 1-Click Demo Login (As Marco)
        </button>

        <div style={{ textAlign: "center", fontSize: 13, color: "#64748B" }}>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            style={{ background: "none", border: "none", color: "#6366F1", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
          >
            {isRegister ? "Sign In" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
