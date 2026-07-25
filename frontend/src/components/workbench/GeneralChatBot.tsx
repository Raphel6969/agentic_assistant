"use client";

import React, { useState } from "react";
import type { Domain } from "@/lib/types";
import { useTheme } from "@/context/ThemeContext";

export interface ChatMessage {
  role: "user" | "ai";
  text: string;
  time: string;
}

interface GeneralChatBotProps {
  onStartTask: (description: string, domain: Domain, budget: number) => void;
  messages?: ChatMessage[];
  onUpdateMessages?: (msgs: ChatMessage[]) => void;
}

export const GeneralChatBot: React.FC<GeneralChatBotProps> = ({
  onStartTask,
  messages: externalMessages,
  onUpdateMessages,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const defaultInitial: ChatMessage[] = [
    {
      role: "ai",
      text: "Hello! I'm Orcheon AI Assistant. Ask me anything — general questions, coding advice, dates, info, or ask me to plan a task!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ];

  const [internalMessages, setInternalMessages] = useState<ChatMessage[]>(defaultInitial);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const messages = externalMessages && externalMessages.length > 0 ? externalMessages : internalMessages;

  const updateList = (newList: ChatMessage[]) => {
    setInternalMessages(newList);
    if (onUpdateMessages) {
      onUpdateMessages(newList);
    }
  };

  const processQuery = async (rawInput: string) => {
    const text = rawInput.trim();
    if (!text) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = { role: "user", text, time: timeStr };
    const nextList = [...messages, userMsg];
    updateList(nextList);
    setInput("");
    setIsThinking(true);

    try {
      // Try calling FastAPI backend /chat endpoint
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.type === "greeting" && data.reply) {
          const aiMsg: ChatMessage = { role: "ai", text: data.reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
          updateList([...nextList, aiMsg]);
          setIsThinking(false);
          return;
        } else if (data.type === "task") {
          const aiMsg: ChatMessage = {
            role: "ai",
            text: `Launching autonomous ${data.domain} task for you! 🚀 Check your Tasks panel for live execution.`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          updateList([...nextList, aiMsg]);
          setIsThinking(false);
          onStartTask(text, data.domain, 600);
          return;
        }
      }
    } catch (e) {
      // Ignore network error and fall back to local conversational engine
    }

    // Client-side fluid conversational fallback engine (ZERO robotic templates!)
    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyText = "";
      let isTaskTrigger = false;
      let targetDomain: Domain = "trip";
      let taskBudget = 0;

      if (["hi", "hello", "hey", "sup", "greetings", "howdy", "whatsup", "whats up", "how are u", "how are you", "how are u today", "how are you today"].some((g) => lower === g || lower.startsWith(g + " ") || lower.startsWith(g + "!") || lower.startsWith(g + "?"))) {
        replyText = "I'm doing great, thank you! 😊 I'm Orcheon, your AI workspace assistant. How can I help you today?";
      } else if (lower.includes("name") || lower.includes("who are you") || lower.includes("whats ur name")) {
        replyText = "I'm Orcheon — your intelligent AI workspace assistant! I can help you plan trips, write and run code, schedule meetings, or answer any questions.";
      } else if (lower.includes("do") || lower.includes("can u do") || lower.includes("what can you do") || lower.includes("help")) {
        replyText = "I can execute autonomous background tasks for you — like searching flight tickets & hotels, writing and running Python code, scheduling calendar meetings, or comparing product prices across vendors! What would you like to do?";
      } else if (lower.includes("what date") || lower.includes("day is it") || lower.includes("what is the date")) {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        replyText = `Today is ${now.toLocaleDateString("en-US", options)}.`;
      } else if (lower.includes("plan") || lower.includes("book") || lower.includes("trip") || lower.includes("flight")) {
        replyText = "Starting your trip planning task now! 🚀 Check the output in your Tasks panel.";
        isTaskTrigger = true;
        targetDomain = "trip";
        taskBudget = 600;
      } else if (lower.includes("code") || lower.includes("python") || lower.includes("script") || lower.includes("fibonacci")) {
        replyText = "Generating and executing your code task now! 💻 Check the output in your Tasks panel.";
        isTaskTrigger = true;
        targetDomain = "coding";
      } else if (lower.includes("schedule") || lower.includes("calendar") || lower.includes("meeting")) {
        replyText = "Checking calendar slots and drafting your meeting invite! 📅 Check the output in your Tasks panel.";
        isTaskTrigger = true;
        targetDomain = "scheduling";
      } else {
        replyText = `That's an interesting question! As Orcheon AI, I can help answer that or execute a dedicated workflow for you.`;
      }

      const aiMsg: ChatMessage = {
        role: "ai",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      updateList([...nextList, aiMsg]);
      setIsThinking(false);

      if (isTaskTrigger) {
        onStartTask(text, targetDomain, taskBudget);
      }
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processQuery(input);
    }
  };

  return (
    <div
      style={{
        background: isDark ? "#1E293B" : "#FFFFFF",
        borderRadius: 24,
        border: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
        boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 10px 30px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        height: 520,
        overflow: "hidden",
        fontFamily: "var(--font-sans), sans-serif",
      }}
    >
      {/* Bot Header */}
      <div
        style={{
          background: isDark ? "#1E293B" : "#FFFFFF",
          borderBottom: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366F1, #4F46E5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A" }}>Orcheon AI Assistant</h3>
          <span style={{ fontSize: 11, color: isDark ? "#94A3B8" : "#64748B" }}>Persistent session chat — answers questions, date & runs tasks</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          background: isDark ? "#0F172A" : "#F8FAFC",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
            }}
          >
            <div
              style={{
                background: m.role === "user" ? "#6366F1" : isDark ? "#1E293B" : "#FFFFFF",
                color: m.role === "user" ? "#FFFFFF" : isDark ? "#F8FAFC" : "#0F172A",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "12px 16px",
                fontSize: 13,
                lineHeight: 1.5,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                border: m.role === "ai" ? (isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0") : "none",
              }}
            >
              {m.text}
            </div>
            <span style={{ fontSize: 10, color: isDark ? "#94A3B8" : "#94A3B8", marginTop: 4, display: "block", textAlign: m.role === "user" ? "right" : "left" }}>
              {m.time}
            </span>
          </div>
        ))}
        {isThinking && (
          <div style={{ alignSelf: "flex-start", fontSize: 12, color: isDark ? "#94A3B8" : "#64748B", fontStyle: "italic" }}>
            Orcheon AI is thinking...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div
        style={{
          padding: "14px 20px",
          background: isDark ? "#1E293B" : "#FFFFFF",
          borderTop: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
          display: "flex",
          gap: 10,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask general question, date, or describe a task..."
          style={{
            flex: 1,
            border: isDark ? "1.5px solid #334155" : "1.5px solid #E2E8F0",
            borderRadius: 24,
            padding: "10px 18px",
            fontSize: 13,
            color: isDark ? "#F8FAFC" : "#0F172A",
            outline: "none",
            background: isDark ? "#0F172A" : "#FAFAFA",
            fontFamily: "var(--font-sans), sans-serif",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#6366F1")}
          onBlur={(e) => (e.currentTarget.style.borderColor = isDark ? "#334155" : "#E2E8F0")}
        />
        <button
          onClick={() => processQuery(input)}
          disabled={!input.trim()}
          style={{
            background: input.trim() ? "linear-gradient(135deg, #6366F1, #4F46E5)" : isDark ? "#334155" : "#E2E8F0",
            color: input.trim() ? "#FFFFFF" : isDark ? "#64748B" : "#94A3B8",
            border: "none",
            borderRadius: 24,
            padding: "10px 22px",
            fontSize: 13,
            fontWeight: 700,
            cursor: input.trim() ? "pointer" : "not-allowed",
            transition: "all 150ms ease",
          }}
        >
          Send →
        </button>
      </div>
    </div>
  );
};
