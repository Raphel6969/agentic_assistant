'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface BottomChatProps {
  onStartTask: (description: string, domain: string, budget: number) => void;
}

function detectDomain(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('trip') || lower.includes('flight') || lower.includes('hotel')) return 'trip';
  if (lower.includes('code') || lower.includes('script') || lower.includes('write code')) return 'coding';
  if (lower.includes('schedule') || lower.includes('meeting') || lower.includes('calendar')) return 'scheduling';
  if (lower.includes('research') || lower.includes('compare') || lower.includes('review')) return 'research';
  return 'general';
}

function detectBudget(text: string): number {
  const match = text.match(/\$(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function getAIReply(text: string, isTask: boolean): string {
  if (isTask) {
    return "Starting that for you now! 🚀 Check the task output above.";
  }
  const lower = text.toLowerCase();
  if (lower.match(/\b(hi|hello|hey|sup|yo)\b/)) {
    return "Hey! I'm Maestro, your AI assistant. What can I help you with today? 😊";
  }
  if (
    lower.includes('what can you') ||
    lower.includes('what do you') ||
    lower.includes('features') ||
    lower.includes('help me with')
  ) {
    return "I can plan trips, run code, schedule meetings, and research products for you! Just ask.";
  }
  return "Got it! I'm thinking about that... You can also type 'plan this for me' to start an agentic task.";
}

const MAX_VISIBLE = 6;

export default function BottomChat({ onStartTask }: BottomChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const lower = text.toLowerCase();
    const isTask =
      lower.includes('plan') ||
      lower.includes('book') ||
      lower.includes('write code') ||
      lower.includes('schedule');

    const userMsg: Message = { role: 'user', text };
    const aiMsg: Message = { role: 'ai', text: getAIReply(text, isTask) };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');

    if (isTask) {
      const domain = detectDomain(text);
      const budget = detectBudget(text);
      onStartTask(text, domain, budget);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const visibleMessages = messages.slice(-MAX_VISIBLE);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(255,255,255,0.80)',
        borderTop: '1px solid rgba(100,116,139,0.18)',
        boxShadow: '0 -4px 32px rgba(15,23,42,0.10)',
      }}
    >
      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '0 16px',
        }}
      >
        {/* Message thread */}
        {visibleMessages.length > 0 && (
          <div
            ref={scrollRef}
            style={{
              maxHeight: '200px',
              overflowY: 'auto',
              padding: '14px 0 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {visibleMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '72%',
                    padding: '8px 14px',
                    borderRadius: msg.role === 'user'
                      ? '16px 16px 4px 16px'
                      : '16px 16px 16px 4px',
                    background: msg.role === 'user'
                      ? '#6366F1'
                      : 'rgba(241,245,249,0.95)',
                    color: msg.role === 'user' ? '#F8FAFC' : '#1E293B',
                    fontSize: '13px',
                    lineHeight: 1.55,
                    boxShadow: '0 2px 8px rgba(15,23,42,0.07)',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input row */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            padding: '12px 0',
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Chat with Maestro... or say 'plan this for me'"
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: '999px',
              border: '1.5px solid rgba(100,116,139,0.22)',
              background: 'rgba(248,250,252,0.9)',
              fontFamily: 'inherit',
              fontSize: '14px',
              color: '#1E293B',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLInputElement).style.borderColor = '#6366F1';
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLInputElement).style.borderColor =
                'rgba(100,116,139,0.22)';
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: '12px 22px',
              borderRadius: '999px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              flexShrink: 0,
              boxShadow: '0 4px 16px rgba(99,102,241,0.28)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '0.88';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '1';
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
