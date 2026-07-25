"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ACPBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle: string;
  amount: number;
  currency?: string;
  onPaymentSuccess?: (receipt: any) => void;
}

export const ACPBankModal: React.FC<ACPBankModalProps> = ({
  isOpen,
  onClose,
  itemTitle,
  amount,
  currency = "USD",
  onPaymentSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedReceipt = {
        checkout_id: `acp_chk_${Math.random().toString(36).substring(2, 9)}`,
        token: `acp_spt_${Math.random().toString(36).substring(2, 14)}`,
        merchant: "Air France / Agentic Commerce Partner",
        amount: amount,
        currency: currency,
        account_last4: "3107",
        receipt_id: `rcpt_${Math.random().toString(36).substring(2, 8)}`,
        timestamp: new Date().toISOString(),
      };
      setReceipt(generatedReceipt);
      setIsProcessing(false);
      setIsPaid(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(generatedReceipt);
      }
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200,
          padding: 20,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="glass"
          style={{
            width: "100%",
            maxWidth: 480,
            borderRadius: "var(--radius-lg)",
            padding: 28,
            border: "1px solid rgba(16, 185, 129, 0.4)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(16, 185, 129, 0.2)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {!isPaid ? (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(16, 185, 129, 0.2)",
                      border: "1px solid var(--color-emerald)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                    }}
                  >
                    💳
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                      ACP Linked Bank Payment
                    </h3>
                    <span style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
                      Agentic Commerce Protocol v2026.4
                    </span>
                  </div>
                </div>
                <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontSize: 18 }}>
                  ✕
                </button>
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", padding: 16, borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>Item Purchase</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{itemTitle}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--color-emerald)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
                  ${amount.toFixed(2)} {currency}
                </div>
              </div>

              <div style={{ background: "rgba(99, 102, 241, 0.08)", padding: 14, borderRadius: "var(--radius-md)", border: "1px solid rgba(99, 102, 241, 0.3)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Linked Bank Account</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>Checking Account •••• 3107</div>
                </div>
                <span style={{ fontSize: 11, color: "var(--color-emerald)", fontWeight: 600, padding: "2px 8px", background: "rgba(16, 185, 129, 0.2)", borderRadius: "var(--radius-sm)" }}>
                  Verified ✓
                </span>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={handlePay}
                  disabled={isProcessing}
                  style={{
                    flex: 1,
                    background: "linear-gradient(135deg, var(--color-emerald), #059669)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    padding: "14px",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 16px rgba(16, 185, 129, 0.4)",
                  }}
                >
                  {isProcessing ? "Authorizing ACP Token..." : `Confirm Payment ($${amount.toFixed(2)})`}
                </button>
                <button
                  onClick={onClose}
                  style={{
                    background: "none",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-secondary)",
                    borderRadius: "var(--radius-md)",
                    padding: "14px 18px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center", padding: "10px 0" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", border: "2px solid var(--color-emerald)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                ✓
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Booking Confirmed!</h3>
                <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>
                  Payment authorized via ACP SharedPaymentToken.
                </p>
              </div>

              <div style={{ width: "100%", background: "rgba(0,0,0,0.5)", padding: 14, borderRadius: "var(--radius-md)", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: 11, display: "flex", flexDirection: "column", gap: 4, color: "var(--color-emerald)" }}>
                <div>Receipt ID: {receipt?.receipt_id}</div>
                <div>ACP Token: {receipt?.token}</div>
                <div>Charged to: Bank •••• {receipt?.account_last4}</div>
                <div>Amount: ${receipt?.amount.toFixed(2)} USD</div>
              </div>

              <button
                onClick={onClose}
                style={{
                  width: "100%",
                  background: "var(--color-indigo)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  padding: "12px",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Close Receipt
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
