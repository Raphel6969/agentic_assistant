'use client';

import React from 'react';

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS: { id: string; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'tasks',     label: 'Tasks'     },
  { id: 'tools',     label: 'Tools'     },
  { id: 'config',    label: 'Config'    },
];

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(255, 255, 255, 0.70)',
        borderBottom: '1px solid rgba(100, 116, 139, 0.18)',
        boxShadow: '0 2px 16px rgba(15, 23, 42, 0.06)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '10px 24px',
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                padding: '8px 22px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                letterSpacing: '0.01em',
                transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                background: isActive ? '#0F172A' : 'transparent',
                color: isActive ? '#F8FAFC' : '#64748B',
                boxShadow: isActive
                  ? '0 2px 8px rgba(15, 23, 42, 0.18)'
                  : 'none',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'rgba(100, 116, 139, 0.10)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#1E293B';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = '#64748B';
                }
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
