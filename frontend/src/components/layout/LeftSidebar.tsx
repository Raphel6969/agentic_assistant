"use client";

import React from "react";
import type { Domain } from "@/lib/types";
import { ConstraintSlider } from "@/components/solver/ConstraintSlider";

interface LeftSidebarProps {
  selectedDomain: Domain;
  onSelectDomain: (domain: Domain) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  selectedDomain,
  onSelectDomain,
}) => {
  const domains: { id: Domain; label: string; icon: string }[] = [
    { id: "trip", label: "Trip Planning", icon: "✈️" },
    { id: "scheduling", label: "Scheduling", icon: "📅" },
    { id: "research", label: "Price Research", icon: "🔍" },
  ];

  return (
    <aside
      className="glass"
      style={{
        gridRow: "2 / 3",
        borderRight: "var(--glass-border)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        overflowY: "auto",
      }}
    >
      <div>
        <h4 style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: 12 }}>
          Active Domain
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {domains.map((d) => (
            <button
              key={d.id}
              onClick={() => onSelectDomain(d.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                background: selectedDomain === d.id ? "rgba(99, 102, 241, 0.15)" : "transparent",
                border: `1px solid ${selectedDomain === d.id ? "rgba(99, 102, 241, 0.3)" : "transparent"}`,
                color: selectedDomain === d.id ? "#fff" : "var(--color-text-secondary)",
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: selectedDomain === d.id ? 600 : 400,
                cursor: "pointer",
                textAlign: "left",
                transition: "all var(--duration-fast) var(--ease-standard)",
              }}
            >
              <span>{d.icon}</span>
              <span>{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: 12 }}>
          Registered Gateway Tools
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
          <div className="glass" style={{ padding: 8, borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontWeight: 600, color: "#fff" }}>search_flights</div>
            <div style={{ color: "var(--color-text-muted)", fontSize: 11 }}>tier: read_only</div>
          </div>
          <div className="glass" style={{ padding: 8, borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontWeight: 600, color: "#fff" }}>search_hotels</div>
            <div style={{ color: "var(--color-text-muted)", fontSize: 11 }}>tier: read_only</div>
          </div>
          <div className="glass" style={{ padding: 8, borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontWeight: 600, color: "#fff" }}>get_destination_weather</div>
            <div style={{ color: "var(--color-text-muted)", fontSize: 11 }}>tier: read_only (Open-Meteo REST)</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "auto" }}>
        <ConstraintSlider />
      </div>
    </aside>
  );
};
