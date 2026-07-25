'use client';

import React, { useState } from 'react';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface Task {
  id: string;
  title: string;
  domain: string;
  status: string;
  budget: number;
  messages?: Message[];
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

const STATUS_COLOR: Record<string, string> = {
  running:   '#6366F1',
  completed: '#10B981',
  failed:    '#EF4444',
  pending:   '#F59E0B',
};

export default function TaskModal({ isOpen, onClose, tasks }: TaskModalProps) {
  const [selectedId, setSelectedId] = useState<string>(tasks[0]?.id ?? '');
  const [chatMap, setChatMap] = useState<Record<string, Message[]>>(
    Object.fromEntries(tasks.map((t) => [t.id, t.messages ?? []]))
  );
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const selectedTask = tasks.find((t) => t.id === selectedId);
  const messages = chatMap[selectedId] ?? [];

  const handleSend = () => {
    const text = input.trim();
    if (!text || !selectedId) return;
    const userMsg: Message = { role: 'user', text };
    const aiMsg: Message = {
      role: 'ai',
      text: `Got it! Continuing your planning for: ${text}`,
    };
    setChatMap((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), userMsg, aiMsg],
    }));
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.60)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '90vw',
          maxWidth: '960px',
          height: '80vh',
          maxHeight: '720px',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 24px 64px rgba(15, 23, 42, 0.24)',
          border: '1px solid rgba(100, 116, 139, 0.15)',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '18px',
            zIndex: 10,
            background: 'rgba(100,116,139,0.12)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* Left panel – task list */}
        <div
          style={{
            width: '280px',
            minWidth: '220px',
            borderRight: '1px solid rgba(100,116,139,0.15)',
            overflowY: 'auto',
            padding: '24px 0 16px',
          }}
        >
          <p
            style={{
              margin: '0 0 12px',
              padding: '0 20px',
              fontWeight: 700,
              fontSize: '15px',
              color: '#0F172A',
              letterSpacing: '0.01em',
            }}
          >
            Tasks
          </p>
          {tasks.map((task) => {
            const active = task.id === selectedId;
            return (
              <div
                key={task.id}
                onClick={() => setSelectedId(task.id)}
                style={{
                  padding: '12px 20px',
                  cursor: 'pointer',
                  background: active
                    ? 'rgba(99,102,241,0.10)'
                    : 'transparent',
                  borderLeft: active
                    ? '3px solid #6366F1'
                    : '3px solid transparent',
                  transition: 'background 0.15s',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: '13.5px',
                    color: active ? '#4338CA' : '#1E293B',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {task.title}
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '4px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: STATUS_COLOR[task.status] ?? '#64748B',
                      textTransform: 'capitalize',
                    }}
                  >
                    {task.status}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                    · {task.domain}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right panel – chat */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 24px 16px',
              borderBottom: '1px solid rgba(100,116,139,0.12)',
            }}
          >
            <p
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: '15px',
                color: '#0F172A',
              }}
            >
              {selectedTask?.title ?? 'Select a task'}
            </p>
            {selectedTask && (
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>
                Budget: ${selectedTask.budget} · Domain: {selectedTask.domain}
              </p>
            )}
          </div>

          {/* Message list */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {messages.length === 0 && (
              <p style={{ color: '#94A3B8', fontSize: '13px', margin: 'auto' }}>
                No messages yet. Start chatting about this task!
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user'
                      ? '16px 16px 4px 16px'
                      : '16px 16px 16px 4px',
                    background: msg.role === 'user'
                      ? '#6366F1'
                      : 'rgba(241,245,249,0.95)',
                    color: msg.role === 'user' ? '#F8FAFC' : '#1E293B',
                    fontSize: '13.5px',
                    lineHeight: 1.55,
                    boxShadow: '0 2px 8px rgba(15,23,42,0.07)',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat input */}
          <div
            style={{
              padding: '14px 20px',
              borderTop: '1px solid rgba(100,116,139,0.12)',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-end',
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Reply about this task…"
              rows={1}
              style={{
                flex: 1,
                resize: 'none',
                borderRadius: '12px',
                border: '1.5px solid rgba(100,116,139,0.25)',
                padding: '10px 14px',
                fontFamily: 'inherit',
                fontSize: '13.5px',
                color: '#1E293B',
                background: 'rgba(248,250,252,0.9)',
                outline: 'none',
                lineHeight: 1.5,
              }}
            />
            <button
              onClick={handleSend}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                background: '#6366F1',
                color: '#fff',
                fontWeight: 600,
                fontSize: '13.5px',
                cursor: 'pointer',
                flexShrink: 0,
                fontFamily: 'inherit',
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
