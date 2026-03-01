"use client";

import { useEffect, useState } from "react";
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

  const fmt = (n: number | null, suffix = "") =>
    n === null ? "..." : network.error ? "—" : `${n.toLocaleString()}${suffix}`;

  return (
    <div
      className="card"
      style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}
    >
      {/* Header label */}
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

      {/* Block height */}
      <Stat
        label="block height"
        value={
          network.blockHeight !== null && !network.error
            ? `#${network.blockHeight.toLocaleString()}`
            : network.error
            ? "—"
            : "..."
        }
        accent
      />

      {/* Avg block time */}
      <Stat
        label="avg block time"
        value={fmt(network.avgBlockTime, "s")}
      />

      {/* Confirmation — de-emphasized */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "var(--muted)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          btc anchoring
        </span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "var(--muted-hi)",
          }}
        >
          ~10–15 min
        </span>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid var(--border)" }} />

      {/* RPC + Chain ID */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <MetaRow label="rpc" value="rpc.staging.midl.xyz" />
        <MetaRow label="chain id" value={String(CHAIN_ID)} />
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "var(--muted)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        {accent && (
          <span
            className="pulse-dot"
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "var(--green)",
              flexShrink: 0,
            }}
          />
        )}
      </div>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "1rem",
          fontWeight: 700,
          color: "var(--text)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.55rem",
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
          fontSize: "0.65rem",
          color: "var(--muted-hi)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </div>
  );
}
