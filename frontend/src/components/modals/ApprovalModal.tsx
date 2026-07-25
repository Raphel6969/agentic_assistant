"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TraceEvent } from "@/lib/types";

const PLANNER_URL = process.env.NEXT_PUBLIC_PLANNER_URL || "http://localhost:8000";

interface ApprovalModalProps {
  event: TraceEvent | null;
  taskId: string;
  onResolved: (approved: boolean) => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  event,
  taskId,
  onResolved,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModify, setShowModify] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(500);

  if (!event || event.guardrail_result !== "requires_approval") {
    return null;
  }

  const handleDecision = async (approved: boolean) => {
    setIsSubmitting(true);
    try {
      const resp = await fetch(`${PLANNER_URL}/tasks/${taskId}/approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approved,
          modified_parameters: showModify ? { max_price: maxPrice } : null,
        }),
      });

      if (resp.ok) {
        onResolved(approved);
      }
    } catch (err) {
      console.error("Error submitting approval:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: 20,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="glass"
          style={{
            width: "100%",
            maxWidth: 500,
            borderRadius: "var(--radius-lg)",
            padding: 28,
            border: "1px solid rgba(249, 115, 22, 0.4)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(249, 115, 22, 0.2)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(249, 115, 22, 0.2)",
                border: "1px solid var(--color-orange)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              ⚠️
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                Human Approval Required
              </h3>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-orange)",
                  fontWeight: 600,
                }}
              >
                RISK TIER: IRREVERSIBLE
              </span>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              padding: 16,
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              fontSize: 13,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-muted)" }}>Proposed Tool:</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "#fff", fontWeight: 600 }}>
                {event.tool}
              </span>
            </div>
            {event.cost_estimate !== null && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Estimated Cost:</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-emerald)", fontWeight: 600 }}>
                  ${event.cost_estimate.toFixed(2)}
                </span>
              </div>
            )}
            {event.reasoning && (
              <div style={{ marginTop: 6, paddingTop: 8, borderTop: "var(--glass-border)", color: "var(--color-text-primary)" }}>
                &quot;{event.reasoning}&quot;
              </div>
            )}
          </div>

          {showModify && (
            <div
              style={{
                background: "rgba(99, 102, 241, 0.08)",
                padding: 14,
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <label style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>
                Modify Max Budget Limit ($)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "6px 10px",
                  color: "#fff",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
            <button
              onClick={() => handleDecision(true)}
              disabled={isSubmitting}
              style={{
                flex: 1,
                background: "var(--color-emerald)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius-md)",
                padding: "12px 16px",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "transform var(--duration-fast) var(--ease-standard)",
              }}
            >
              Approve Execution
            </button>

            <button
              onClick={() => handleDecision(false)}
              disabled={isSubmitting}
              style={{
                flex: 1,
                background: "rgba(244, 63, 94, 0.15)",
                color: "var(--color-rose)",
                border: "1px solid rgba(244, 63, 94, 0.3)",
                borderRadius: "var(--radius-md)",
                padding: "12px 16px",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Reject Action
            </button>

            <button
              onClick={() => setShowModify(!showModify)}
              style={{
                background: "none",
                color: "var(--color-text-secondary)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "12px 14px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {showModify ? "Hide Edit" : "Modify"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
