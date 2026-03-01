"use client";

import { useEffect, useRef, useState } from "react";
import { STAGING_RPC } from "@/lib/constants";

const DOT_COUNT = 12;

async function rpcCall(method: string, params: unknown[]) {
  const res = await fetch(STAGING_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
  });
  const data = await res.json();
  if (!data.result) throw new Error("No result");
  return data.result;
}

export default function InfoCard() {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [avgBlockTime, setAvgBlockTime] = useState<number | null>(null);
  const [activeDot, setActiveDot] = useState(0);
  const prevBlock = useRef<number | null>(null);
  const dotTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Advance the dot ticker every ~avgBlockTime seconds
  useEffect(() => {
    const interval = avgBlockTime ? avgBlockTime * 1000 : 4000;
    dotTimer.current = setInterval(() => {
      setActiveDot((d) => (d + 1) % DOT_COUNT);
    }, interval);
    return () => {
      if (dotTimer.current) clearInterval(dotTimer.current);
    };
  }, [avgBlockTime]);

  useEffect(() => {
    let cancelled = false;

    async function fetchNetworkState() {
      try {
        const latestRaw = await rpcCall("eth_getBlockByNumber", ["latest", false]);
        const latestNumber = parseInt(latestRaw.number, 16);
        const latestTimestamp = parseInt(latestRaw.timestamp, 16);

        const olderHex = `0x${(latestNumber - 10).toString(16)}`;
        const olderRaw = await rpcCall("eth_getBlockByNumber", [olderHex, false]);
        const olderTimestamp = parseInt(olderRaw.timestamp, 16);

        const avg = Math.round((latestTimestamp - olderTimestamp) / 10);

        if (!cancelled) {
          if (prevBlock.current !== null && prevBlock.current !== latestNumber) {
            setActiveDot((d) => (d + 1) % DOT_COUNT);
          }
          prevBlock.current = latestNumber;
          setBlockHeight(latestNumber);
          setAvgBlockTime(avg);
        }
      } catch {
        // fail silently, keep last values
      }
    }

    fetchNetworkState();
    const interval = setInterval(fetchNetworkState, 15_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const displayTime = avgBlockTime !== null ? `${avgBlockTime}s` : "...";

  return (
    <div className="card" style={{ padding: "20px 20px 16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Big stat */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "2.6rem",
              fontWeight: 700,
              color: "var(--green)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            {displayTime}
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "var(--muted)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          block times
        </span>
      </div>

      {/* Dot row — live block rhythm */}
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        {Array.from({ length: DOT_COUNT }).map((_, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: i === activeDot
                ? "var(--green)"
                : i < activeDot
                ? "rgba(34,197,94,0.35)"
                : "var(--border-hi)",
              flexShrink: 0,
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Description */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          color: "var(--muted)",
          lineHeight: 1.7,
        }}
      >
        MIDL produces blocks every ~{displayTime}, enabling near-instant EVM
        confirmation for transactions.
      </span>
    </div>
  );
}
