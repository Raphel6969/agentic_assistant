"use client";

import React from "react";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  children: React.ReactNode;
}

export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  children,
  shimmerColor = "#ffffff",
  background = "#0F172A",
  borderRadius = "30px",
  style,
  ...props
}) => {
  return (
    <button
      {...props}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: borderRadius,
        background: background,
        color: "#ffffff",
        padding: "12px 24px",
        fontWeight: 600,
        fontSize: "14px",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        transition: "transform 150ms ease, boxShadow 150ms ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-100%",
          background: `linear-gradient(90deg, transparent, ${shimmerColor}44, transparent)`,
          transform: "skewX(-20deg)",
          animation: "shimmer 2.5s infinite",
        }}
      />
      <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8 }}>
        {children}
      </span>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-20deg);
          }
          100% {
            transform: translateX(200%) skewX(-20deg);
          }
        }
      `}</style>
    </button>
  );
};
