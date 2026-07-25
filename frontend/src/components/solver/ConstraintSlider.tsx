"use client";

import React, { useState } from "react";

interface ConstraintSliderProps {
  onWeightsChange?: (weights: { price: number; convenience: number; flexibility: number }) => void;
}

export const ConstraintSlider: React.FC<ConstraintSliderProps> = ({ onWeightsChange }) => {
  const [priceWeight, setPriceWeight] = useState(0.5);
  const [convenienceWeight, setConvenienceWeight] = useState(0.3);
  const [flexibilityWeight, setFlexibilityWeight] = useState(0.2);

  const handleChange = (type: "price" | "convenience" | "flexibility", val: number) => {
    let p = priceWeight;
    let c = convenienceWeight;
    let f = flexibilityWeight;

    if (type === "price") p = val;
    if (type === "convenience") c = val;
    if (type === "flexibility") f = val;

    setPriceWeight(p);
    setConvenienceWeight(c);
    setFlexibilityWeight(f);

    if (onWeightsChange) {
      onWeightsChange({ price: p, convenience: c, flexibility: f });
    }
  };

  return (
    <div
      className="glass"
      style={{
        padding: 16,
        borderRadius: "var(--radius-md)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h4 style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Rust Solver Optimization Weights
        </h4>
        <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--color-emerald)" }}>
          LIVE RE-RANKING
        </span>
      </div>

      {/* Price Weight */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          <span style={{ color: "var(--color-text-primary)" }}>Price Importance</span>
          <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-secondary)" }}>
            {Math.round(priceWeight * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={priceWeight}
          onChange={(e) => handleChange("price", parseFloat(e.target.value))}
          style={{ accentColor: "var(--color-indigo)", cursor: "pointer" }}
        />
      </div>

      {/* Convenience Weight */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          <span style={{ color: "var(--color-text-primary)" }}>Convenience / Direct Flight</span>
          <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-secondary)" }}>
            {Math.round(convenienceWeight * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={convenienceWeight}
          onChange={(e) => handleChange("convenience", parseFloat(e.target.value))}
          style={{ accentColor: "var(--color-emerald)", cursor: "pointer" }}
        />
      </div>

      {/* Flexibility Weight */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          <span style={{ color: "var(--color-text-primary)" }}>Flexibility / Cancellation</span>
          <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-secondary)" }}>
            {Math.round(flexibilityWeight * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={flexibilityWeight}
          onChange={(e) => handleChange("flexibility", parseFloat(e.target.value))}
          style={{ accentColor: "var(--color-amber)", cursor: "pointer" }}
        />
      </div>
    </div>
  );
};
