"use client";

import { useEffect, useState } from "react";
import { STAGING_RPC } from "@/lib/constants";

export default function InfoCard() {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);

  useEffect(() => {
    fetch(STAGING_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method: "eth_blockNumber", params: [], id: 1 }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.result) setBlockHeight(parseInt(data.result, 16));
      })
      .catch(() => null);
  }, []);

  return (
    <div className="card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Header stat */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          ~10–15 min
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.55rem",
            color: "var(--orange)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          BTC anchoring
        </span>
      </div>

      {/* Description */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: "var(--muted)",
          lineHeight: 1.7,
        }}
      >
        MIDL confirms EVM state by anchoring to a Bitcoin block. This is not a bug.
      </span>

      {/* Progress bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "3px",
            background: "var(--border-hi)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "var(--orange)",
              borderRadius: "2px",
              animation: "progress-slide 4s ease-in-out infinite",
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.55rem",
            color: "var(--muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          staging
        </span>
      </div>

      {/* Block height */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: blockHeight ? "var(--muted-hi)" : "var(--muted)",
            letterSpacing: "0.04em",
          }}
        >
          {blockHeight !== null
            ? `block #${blockHeight.toLocaleString()}`
            : "fetching block…"}
        </span>
      </div>
    </div>
  );
}
