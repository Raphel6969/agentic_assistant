"use client";

import React from "react";

interface DotPatternProps {
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
}

export const DotPattern: React.FC<DotPatternProps> = ({
  width = 24,
  height = 24,
  cx = 1,
  cy = 1,
  cr = 1,
}) => {
  const id = React.useId();

  return (
    <svg
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.3,
      }}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={0}
          y={0}
        >
          <circle id="pattern-circle" cx={cx} cy={cy} r={cr} fill="rgba(99, 102, 241, 0.4)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
};
