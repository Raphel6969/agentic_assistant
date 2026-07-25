'use client';

import React, { useState } from 'react';

type Domain = 'trip' | 'coding' | 'scheduling' | 'research' | 'general';

interface NewTask {
  title: string;
  domain: string;
  budget: number;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: NewTask) => void;
}

const DOMAINS: { value: Domain; label: string }[] = [
  { value: 'trip',       label: 'Trip'       },
  { value: 'coding',     label: 'Coding'     },
  { value: 'scheduling', label: 'Scheduling' },
  { value: 'research',   label: 'Research'   },
  { value: 'general',    label: 'General'    },
];

const AI_PREFILLS: Record<Domain, { title: string; budget: number }> = {
  trip:       { title: 'Plan a 3-day trip to Tokyo',  budget: 800 },
  coding:     { title: 'Write a Python web scraper',   budget: 0   },
  scheduling: { title: 'Schedule team standup',        budget: 0   },
  research:   { title: 'Compare MacBook vs Dell XPS',  budget: 0   },
  general:    { title: 'Complete project milestone',   budget: 100 },
};

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '12px',
  border: '1.5px solid rgba(100,116,139,0.25)',
  background: 'rgba(248,250,252,0.9)',
  fontFamily: 'inherit',
  fontSize: '14px',
  color: '#1E293B',
  outline: 'none',
  boxSizing: 'border-box',
};

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontSize: '12.5px',
  fontWeight: 600,
  color: '#475569',
  marginBottom: '6px',
  letterSpacing: '0.02em',
};

export default function AddTaskModal({ isOpen, onClose, onAddTask }: AddTaskModalProps) {
  const [title, setTitle]   = useState('');
  const [domain, setDomain] = useState<Domain>('general');
  const [budget, setBudget] = useState<number | ''>('');

  if (!isOpen) return null;

  const reset = () => {
    setTitle('');
    setDomain('general');
    setBudget('');
  };

  const handleAddManually = () => {
    if (!title.trim()) return;
    onAddTask({ title: title.trim(), domain, budget: Number(budget) || 0 });
    reset();
    onClose();
  };

  const handleAIGenerate = () => {
    const prefill = AI_PREFILLS[domain];
    onAddTask({ title: prefill.title, domain, budget: prefill.budget });
    reset();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          margin: '0 16px',
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 24px 64px rgba(15,23,42,0.22)',
          border: '1px solid rgba(100,116,139,0.15)',
          padding: '32px',
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

        <h2
          style={{
            margin: '0 0 24px',
            fontWeight: 700,
            fontSize: '20px',
            color: '#0F172A',
            letterSpacing: '-0.01em',
          }}
        >
          New Task
        </h2>

        {/* Title input */}
        <div style={{ marginBottom: '18px' }}>
          <label style={LABEL_STYLE}>Task Title / Description</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Plan a trip to Paris"
            style={INPUT_STYLE}
          />
        </div>

        {/* Domain select */}
        <div style={{ marginBottom: '18px' }}>
          <label style={LABEL_STYLE}>Domain</label>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value as Domain)}
            style={{ ...INPUT_STYLE, appearance: 'none', cursor: 'pointer' }}
          >
            {DOMAINS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Budget input */}
        <div style={{ marginBottom: '28px' }}>
          <label style={LABEL_STYLE}>Budget ($)</label>
          <input
            type="number"
            min={0}
            value={budget}
            onChange={(e) =>
              setBudget(e.target.value === '' ? '' : Number(e.target.value))
            }
            placeholder="e.g. 200"
            style={INPUT_STYLE}
          />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleAddManually}
            style={{
              flex: 1,
              padding: '11px 0',
              borderRadius: '12px',
              border: '1.5px solid rgba(100,116,139,0.30)',
              background: 'transparent',
              color: '#1E293B',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
          >
            Add Manually
          </button>
          <button
            onClick={handleAIGenerate}
            style={{
              flex: 1,
              padding: '11px 0',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 4px 16px rgba(99,102,241,0.30)',
            }}
          >
            ✨ AI Generate
          </button>
        </div>
      </div>
    </div>
  );
}
