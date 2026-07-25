"use client";

import React from "react";

interface BorderBeamProps {
  colorFrom?: string;
  colorTo?: string;
  duration?: number;
  borderWidth?: number;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  colorFrom = "#6366F1",
  colorTo = "#10B981",
  duration = 6,
  borderWidth = 1.5,
}) => {
  return (
    <div
      style={{
        pointerEvents: "none",
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        padding: borderWidth,
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
        WebkitMaskComposite: "xor",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-100%",
          background: `conic-gradient(from 0deg, transparent 0 300deg, ${colorFrom} 340deg, ${colorTo} 360deg)`,
          animation: `spin ${duration}s linear infinite`,
        }}
      />
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
