"use client";

import React, { useState } from "react";
import type { Domain } from "@/lib/types";

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
  const defaultInitial: ChatMessage[] = [
    {
      role: "ai",
      text: "Hello! I'm Maestro General AI. Ask me anything — general questions, coding advice, dates, info, or ask me to plan a task!",
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

  const processQuery = (rawInput: string) => {
    const text = rawInput.trim();
    if (!text) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = { role: "user", text, time: timeStr };
    const nextList = [...messages, userMsg];
    updateList(nextList);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyText = "";
      let isTaskTrigger = false;
      let targetDomain: Domain = "trip";
      let taskBudget = 0;

      // Date query
      if (lower.includes("date") || lower.includes("day is it") || lower.includes("today")) {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        replyText = `Today is ${now.toLocaleDateString("en-US", options)}.`;
      }
      // Time query
      else if (lower.includes("time")) {
        replyText = `The current local time is ${new Date().toLocaleTimeString()}.`;
      }
      // Greetings
      else if (["hi", "hello", "hey", "sup", "greetings", "howdy"].some((g) => lower === g || lower.startsWith(g + " ") || lower.startsWith(g + "!"))) {
        replyText = "Hey there! 😊 How can I help you today? Feel free to ask me any question or give me a task to execute!";
      }
      // Planning task triggers
      else if (lower.includes("plan") || lower.includes("book") || lower.includes("trip") || lower.includes("flight")) {
        replyText = "Starting your trip planning task now! 🚀 Check the output in your Tasks panel.";
        isTaskTrigger = true;
        targetDomain = "trip";
        taskBudget = 600;
      }
      else if (lower.includes("write code") || lower.includes("python") || lower.includes("script") || lower.includes("for loop") || lower.includes("fibonacci")) {
        replyText = "Generating and executing your code task now! 💻 Check the output in your Tasks panel.";
        isTaskTrigger = true;
        targetDomain = "coding";
      }
      else if (lower.includes("schedule") || lower.includes("calendar") || lower.includes("meeting")) {
        replyText = "Checking calendar slots and drafting invite for your task now! 📅 Check your Tasks panel.";
        isTaskTrigger = true;
        targetDomain = "scheduling";
      }
      else if (lower.includes("compare") || lower.includes("price") || lower.includes("research")) {
        replyText = "Researching vendor pricing and currency rates for your task now! 🔍 Check your Tasks panel.";
        isTaskTrigger = true;
        targetDomain = "research";
      }
      // Who are you / about
      else if (lower.includes("who are you") || lower.includes("what is maestro") || lower.includes("what can you do")) {
        replyText = "I'm Maestro — an advanced agentic AI workspace assistant! I can answer general questions, generate real Python code, plan travel itineraries with live API scores, schedule calendar meetings, and compare product prices across vendors.";
      }
      // General question fallback
      else {
        replyText = `I understand you're asking about "${text}". As your Maestro AI assistant, I can answer general queries or run autonomous background agentic tasks for you anytime!`;
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
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      processQuery(input);
    }
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 24,
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        height: 520,
        overflow: "hidden",
      }}
    >
      {/* Bot Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F172A, #1E293B)",
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
            background: "linear-gradient(135deg, #6366F1, #3B82F6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontSize: 18,
            fontWeight: 800,
          }}
        >
          🤖
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>Maestro General AI Chatbot</h3>
          <span style={{ fontSize: 11, color: "#94A3B8" }}>Persistent session chat — answers questions, date & runs tasks</span>
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
          background: "#F8FAFC",
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
                background: m.role === "user" ? "#6366F1" : "#FFFFFF",
                color: m.role === "user" ? "#FFFFFF" : "#0F172A",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "12px 16px",
                fontSize: 13,
                lineHeight: 1.5,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                border: m.role === "ai" ? "1px solid #E2E8F0" : "none",
              }}
            >
              {m.text}
            </div>
            <span style={{ fontSize: 10, color: "#94A3B8", marginTop: 4, display: "block", textAlign: m.role === "user" ? "right" : "left" }}>
              {m.time}
            </span>
          </div>
        ))}
        {isThinking && (
          <div style={{ alignSelf: "flex-start", fontSize: 12, color: "#64748B", fontStyle: "italic" }}>
            Maestro AI is thinking...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div
        style={{
          padding: "14px 20px",
          background: "#FFFFFF",
          borderTop: "1px solid #E2E8F0",
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
            border: "1.5px solid #E2E8F0",
            borderRadius: 24,
            padding: "10px 18px",
            fontSize: 13,
            color: "#0F172A",
            outline: "none",
            background: "#FAFAFA",
            fontFamily: "var(--font-sans), sans-serif",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#6366F1")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
        />
        <button
          onClick={() => processQuery(input)}
          disabled={!input.trim()}
          style={{
            background: input.trim() ? "linear-gradient(135deg, #6366F1, #4F46E5)" : "#E2E8F0",
            color: input.trim() ? "#FFFFFF" : "#94A3B8",
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
