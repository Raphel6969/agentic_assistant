'use client';

import React from 'react';

export default function ConfigPanel() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '420px',
        padding: '48px 24px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(255,255,255,0.72)',
        border: '1px solid rgba(100,116,139,0.16)',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(15,23,42,0.06)',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: '64px', lineHeight: 1, marginBottom: '24px' }}>
        🔧
      </span>
      <h2
        style={{
          margin: '0 0 10px',
          fontWeight: 700,
          fontSize: '24px',
          color: '#0F172A',
          letterSpacing: '-0.01em',
        }}
      >
        Configuration
      </h2>
      <p
        style={{
          margin: 0,
          fontSize: '15px',
          color: '#64748B',
          lineHeight: 1.6,
          maxWidth: '340px',
        }}
      >
        Settings and preferences will appear here soon.
      </p>
    </div>
  );
}
