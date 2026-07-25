'use client';

import React, { useState } from 'react';

interface Tool {
  emoji: string;
  title: string;
  description: string;
}

const TOOLS: Tool[] = [
  {
    emoji: '🎤',
    title: 'Voice Input',
    description: 'Speak to Maestro. AI understands your intent automatically.',
  },
  {
    emoji: '💻',
    title: 'Code Runner',
    description: 'Generate, run, and debug code in any language.',
  },
  {
    emoji: '✈️',
    title: 'Trip Planner',
    description: 'Search flights, hotels and weather for any destination.',
  },
  {
    emoji: '📅',
    title: 'Scheduler',
    description: 'Find time slots, draft invites and avoid conflicts.',
  },
];

function ToolCard({ tool }: { tool: Tool }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(255,255,255,0.72)',
        border: '1px solid rgba(100,116,139,0.16)',
        borderRadius: '20px',
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: hovered
          ? '0 12px 40px rgba(99,102,241,0.14)'
          : '0 4px 20px rgba(15,23,42,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: '48px', lineHeight: 1 }}>{tool.emoji}</span>
      <div>
        <p
          style={{
            margin: '0 0 6px',
            fontWeight: 700,
            fontSize: '16px',
            color: '#0F172A',
            letterSpacing: '0.01em',
          }}
        >
          {tool.title}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: '13.5px',
            color: '#64748B',
            lineHeight: 1.6,
          }}
        >
          {tool.description}
        </p>
      </div>
    </div>
  );
}

export default function ToolBentoGrid() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        padding: '24px 0',
      }}
    >
      {TOOLS.map((tool) => (
        <ToolCard key={tool.title} tool={tool} />
      ))}
    </div>
  );
}
