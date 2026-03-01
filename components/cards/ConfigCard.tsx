"use client";

import { useState } from "react";
import { useWalletConnection } from "@/hooks/useWalletConnection";

interface ConfigCardProps {
  onRun: (opts: { feeRate?: number; debugMode?: boolean }) => void;
  onReset: () => void;
  traceStatus: "idle" | "running" | "done" | "error";
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-pressed={checked}
      style={{
        position: "relative",
        width: "30px",
        height: "16px",
        flexShrink: 0,
        background: checked ? "var(--orange)" : "var(--border-hi)",
        border: "none",
        borderRadius: "2px",
        cursor: "pointer",
        padding: 0,
        transition: "background 0.15s",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: checked ? "16px" : "3px",
          width: "10px",
          height: "10px",
          background: checked ? "#000" : "var(--muted)",
          borderRadius: "1px",
          transition: "left 0.15s, background 0.15s",
        }}
      />
    </button>
  );
}

export default function ConfigCard({ onRun, onReset, traceStatus }: ConfigCardProps) {
  const { isConnected } = useWalletConnection();
  const [customFeeRate, setCustomFeeRate] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [feeRate, setFeeRate] = useState(1);

  const isDisabled = !isConnected || traceStatus === "running";

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div className="card" style={{ display: "flex", flexDirection: "column" }}>
        {/* Toggles section */}
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--text)" }}>
                Custom fee rate
              </span>
              <Toggle checked={customFeeRate} onChange={() => setCustomFeeRate((v) => !v)} />
            </div>
            {customFeeRate && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="number"
                  value={feeRate}
                  min={1}
                  onChange={(e) => setFeeRate(Number(e.target.value))}
                  style={{ width: "70px", padding: "5px 8px", background: "var(--bg)", border: "1px solid var(--border-hi)", borderRadius: "2px", color: "var(--text)", fontFamily: "var(--font-mono)", fontSize: "0.7rem", outline: "none" }}
                />
                <span style={{ fontSize: "0.6rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>sat/vB</span>
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ cursor: "help" }} title="Shows internal SDK steps">
              <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--text)" }}>
                Debug mode
              </span>
              <span style={{ marginLeft: "5px", fontSize: "0.55rem", color: "var(--muted)" }}>?</span>
            </div>
            <Toggle checked={debugMode} onChange={() => setDebugMode((v) => !v)} />
          </div>
        </div>

        {/* Run section */}
        <div style={{ padding: "16px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "8px" }}>
          {(traceStatus === "done" || traceStatus === "error") && (
            <button
              onClick={onReset}
              style={{ width: "100%", padding: "8px 16px", background: "transparent", color: "var(--muted-hi)", border: "1px solid var(--border-hi)", borderRadius: "3px", fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}
            >
              Reset trace
            </button>
          )}

          <button
            className="run-btn"
            disabled={isDisabled}
            onClick={() =>
              !isDisabled &&
              onRun({ feeRate: customFeeRate ? feeRate : undefined, debugMode })
            }
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "3px",
              border: "none",
              background: isDisabled ? "var(--orange-dim)" : "var(--orange)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: isDisabled ? "not-allowed" : "pointer",
              color: isDisabled ? "rgba(0,0,0,0.4)" : "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "background 0.15s",
              opacity: isDisabled ? 0.5 : 1,
            }}
          >
            {traceStatus === "running" && (
              <span style={{ display: "inline-block", width: "8px", height: "8px", border: "1px solid rgba(0,0,0,0.5)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
            )}
            {traceStatus === "running" ? "Running..." : "Run Transaction →"}
          </button>

          {!isConnected && (
            <p style={{ margin: 0, textAlign: "center", fontSize: "0.6rem", color: "var(--muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
              connect wallet first
            </p>
          )}
        </div>
      </div>
    </>
  );
}
