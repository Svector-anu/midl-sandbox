"use client";

import { useEffect, useRef, useState } from "react";
import { STAGING_RPC, CHAIN_ID } from "@/lib/constants";

interface NetworkState {
  blockHeight: number | null;
  avgBlockTime: number | null;
  error: boolean;
}

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
  const [network, setNetwork] = useState<NetworkState>({
    blockHeight: null,
    avgBlockTime: null,
    error: false,
  });
  const [flash, setFlash] = useState(false);
  const prevBlock = useRef<number | null>(null);

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

        const avgBlockTime = Math.round((latestTimestamp - olderTimestamp) / 10);

        if (!cancelled) {
          if (prevBlock.current !== null && prevBlock.current !== latestNumber) {
            setFlash(true);
            setTimeout(() => setFlash(false), 600);
          }
          prevBlock.current = latestNumber;
          setNetwork({ blockHeight: latestNumber, avgBlockTime, error: false });
        }
      } catch {
        if (!cancelled) {
          setNetwork((prev) => ({ ...prev, error: true }));
        }
      }
    }

    fetchNetworkState();
    const interval = setInterval(fetchNetworkState, 15_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const val = (n: number | null, prefix = "", suffix = "") => {
    if (network.error) return "—";
    if (n === null) return "...";
    return `${prefix}${n.toLocaleString()}${suffix}`;
  };

  return (
    <div className="card" style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.55rem",
            color: "var(--muted)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          // network state
        </span>
        <span
          className="pulse-dot"
          style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--green)", flexShrink: 0 }}
        />
      </div>

      {/* Stats */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <StatRow
          label="block height"
          value={val(network.blockHeight, "#")}
          highlight={flash}
        />
        <StatRow label="avg block time" value={val(network.avgBlockTime, "", "s")} />
        <StatRow label="btc anchoring" value="~10–15 min" muted />
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "8px", display: "flex", flexDirection: "column", gap: "3px" }}>
        <FooterRow label="rpc" value="rpc.staging.midl.xyz" />
        <FooterRow label="chain" value={String(CHAIN_ID)} />
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  highlight,
  muted,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "8px" }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          color: "var(--muted)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: muted ? "var(--muted-hi)" : highlight ? "var(--orange)" : "var(--text)",
          transition: "color 0.4s ease",
          letterSpacing: "0.02em",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function FooterRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "8px" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted-hi)" }}>
        {value}
      </span>
    </div>
  );
}
