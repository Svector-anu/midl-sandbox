"use client";

import { useEffect, useState } from "react";
import { STAGING_RPC } from "@/lib/constants";

export default function InfoCard() {
  const [blockNumber, setBlockNumber] = useState<number | null>(null);

  useEffect(() => {
    fetch(STAGING_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method: "eth_blockNumber", params: [], id: 1 }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.result) setBlockNumber(parseInt(d.result, 16));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Label */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          color: "var(--muted)",
          letterSpacing: "0.12em",
        }}
      >
        // why so long?
      </span>

      {/* Explanation */}
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: "var(--muted-hi)",
          lineHeight: 1.8,
        }}
      >
        MIDL anchors every EVM transaction to Bitcoin. That means your intent is
        written into a BTC transaction, broadcast to the Bitcoin network, and only
        finalized once a Bitcoin block is mined and confirmed.
      </p>

      {/* Flow box */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        {["EVM intent submitted", "Bitcoin tx broadcast", "Block mined (~10 min)", "EVM state updated"].map(
          (step, i, arr) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  color: i === arr.length - 1 ? "var(--green)" : "var(--muted-hi)",
                }}
              >
                {step}
              </span>
              {i < arr.length - 1 && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--muted)", flexShrink: 0 }}>
                  →
                </span>
              )}
            </div>
          )
        )}
      </div>

      {/* Key point */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--orange)",
            lineHeight: 1.6,
          }}
        >
          Bitcoin mines blocks every ~10 min. This is a feature — not a bug.
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "var(--muted)",
            lineHeight: 1.6,
          }}
        >
          Your EVM tx has Bitcoin-level finality.
        </span>
      </div>

      {/* Footer: live block number */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "10px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span
          className="pulse-dot"
          style={{
            display: "inline-block",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: "var(--green)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.58rem",
            color: "var(--muted)",
            letterSpacing: "0.06em",
          }}
        >
          {blockNumber !== null ? `block #${blockNumber.toLocaleString()}` : "fetching block..."}
        </span>
      </div>
    </div>
  );
}
