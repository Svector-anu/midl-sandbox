"use client";

import { useState } from "react";
import { useWalletConnection } from "@/hooks/useWalletConnection";

const DIVIDER = "1px solid var(--border)";

type OptKey = "preCacheChainId" | "customFeeRate" | "debugMode";

interface Opts {
  preCacheChainId: boolean;
  customFeeRate: boolean;
  debugMode: boolean;
}

function trunc(address: string, head = 6, tail = 4): string {
  if (address.length <= head + tail + 3) return address;
  return `${address.slice(0, head)}...${address.slice(-tail)}`;
}

function classifyError(err: unknown): string {
  const msg =
    err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  if (
    msg.includes("not found") ||
    msg.includes("not installed") ||
    msg.includes("not detected") ||
    msg.includes("provider")
  ) {
    return "Wallet not detected. Make sure it's installed and active.";
  }
  if (
    msg.includes("rejected") ||
    msg.includes("cancelled") ||
    msg.includes("denied") ||
    msg.includes("cancel")
  ) {
    return "Connection rejected.";
  }
  const raw = err instanceof Error ? err.message : String(err);
  return raw.length > 80 ? raw.slice(0, 80) + "…" : raw;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: "0.6rem",
        fontFamily: "var(--font-mono)",
        color: "var(--muted)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
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

function ConnectedWallet({
  paymentAddress,
  ordinalsAddress,
  evmAddress,
  expanded,
  disconnect,
}: {
  paymentAddress: string;
  ordinalsAddress: string;
  evmAddress: string;
  expanded: boolean;
  disconnect: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--green)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--text)",
            }}
          >
            {trunc(paymentAddress)}
          </span>
        </div>
        <button
          onClick={disconnect}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "0.6rem",
            fontFamily: "var(--font-mono)",
            color: "var(--muted)",
            letterSpacing: "0.04em",
            padding: 0,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--red)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--muted)";
          }}
        >
          disconnect
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <AddressRow
          label="payment"
          labelColor="var(--yellow)"
          address={expanded ? paymentAddress : trunc(paymentAddress)}
        />
        <AddressRow
          label="ordinals"
          labelColor="var(--orange)"
          address={expanded ? ordinalsAddress : trunc(ordinalsAddress)}
        />
        <AddressRow
          label="evm"
          labelColor="var(--green)"
          address={expanded ? evmAddress : trunc(evmAddress)}
        />
      </div>
    </div>
  );
}

function AddressRow({
  label,
  labelColor,
  address,
}: {
  label: string;
  labelColor: string;
  address: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "0.6rem",
        fontFamily: "var(--font-mono)",
      }}
    >
      <span
        style={{
          color: labelColor,
          minWidth: "46px",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </span>
      <span style={{ color: "var(--muted)", wordBreak: "break-all" }}>
        {address}
      </span>
    </div>
  );
}

function ConnectButton({
  label,
  variant,
  disabled,
  loading,
  onClick,
}: {
  label: string;
  variant: "primary" | "secondary";
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "10px 16px",
        background: isPrimary
          ? disabled
            ? "var(--orange-dim)"
            : "var(--orange)"
          : "transparent",
        color: isPrimary ? "#000" : "var(--text)",
        border: isPrimary ? "none" : "1px solid var(--border-hi)",
        borderRadius: "3px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        fontWeight: isPrimary ? 600 : 400,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        textAlign: "left",
        opacity: disabled && !loading ? 0.5 : 1,
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {loading && (
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            border: `1px solid ${isPrimary ? "#000" : "var(--muted)"}`,
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
          }}
        />
      )}
      {label}
    </button>
  );
}

interface ControlsPanelProps {
  onRun: (opts: { feeRate?: number; debugMode?: boolean }) => void;
  onReset: () => void;
  traceStatus: "idle" | "running" | "done" | "error";
}

export default function ControlsPanel({ onRun, onReset, traceStatus }: ControlsPanelProps) {
  const {
    connectors,
    connectAsync,
    disconnect,
    isConnected,
    isConnecting,
    paymentAccount,
    ordinalsAccount,
    evmAddress,
  } = useWalletConnection();

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [opts, setOpts] = useState<Opts>({
    preCacheChainId: false,
    customFeeRate: false,
    debugMode: false,
  });
  const [feeRate, setFeeRate] = useState(1);

  const toggleOpt = (key: OptKey) =>
    setOpts((prev) => ({ ...prev, [key]: !prev[key] }));

  const xverse = connectors.find((c) =>
    c.metadata?.name?.toLowerCase().includes("xverse")
  );
  const leather = connectors.find((c) =>
    c.metadata?.name?.toLowerCase().includes("leather")
  );

  const handleConnect = async (id: string) => {
    setPendingId(id);
    setConnectError(null);
    try {
      await connectAsync({ id });
    } catch (err) {
      setConnectError(classifyError(err));
    } finally {
      setPendingId(null);
    }
  };

  const paymentAddress = paymentAccount?.address ?? "";
  const ordinalsAddress = ordinalsAccount?.address ?? "";

  return (
    <>
      {/* Spin keyframe injected once */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <aside
        style={{
          width: "380px",
          flexShrink: 0,
          position: "sticky",
          top: "52px",
          height: "calc(100vh - 52px)",
          overflowY: "auto",
          borderRight: DIVIDER,
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Section 1: Wallet ─────────────────────────────── */}
        <div style={{ padding: "20px", borderBottom: DIVIDER }}>
          {isConnected && paymentAddress && ordinalsAddress ? (
            <ConnectedWallet
              paymentAddress={paymentAddress}
              ordinalsAddress={ordinalsAddress}
              evmAddress={evmAddress}
              expanded={expanded}
              disconnect={disconnect}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <Label>// connect wallet to begin</Label>

              <ConnectButton
                label="Connect Xverse"
                variant="primary"
                disabled={isConnecting}
                loading={pendingId === xverse?.id}
                onClick={() => xverse && handleConnect(xverse.id)}
              />

              <ConnectButton
                label="Connect Leather"
                variant="secondary"
                disabled={isConnecting}
                loading={pendingId === leather?.id}
                onClick={() => leather && handleConnect(leather.id)}
              />

              {connectError && (
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.6rem",
                    fontFamily: "var(--font-mono)",
                    color: "var(--red)",
                    lineHeight: 1.5,
                  }}
                >
                  {connectError}
                </p>
              )}

              <a
                href="https://faucet.midl.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="faucet-link"
              >
                No testnet BTC? → faucet.midl.xyz
              </a>
            </div>
          )}
        </div>

        {/* ── Section 2: Why two addresses? ─────────────────── */}
        <div style={{ borderBottom: DIVIDER }}>
          <button
            onClick={() => setExpanded((e) => !e)}
            style={{
              width: "100%",
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--muted-hi)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Why two addresses?
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                color: "var(--muted)",
                lineHeight: 1,
              }}
            >
              {expanded ? "−" : "+"}
            </span>
          </button>

          {expanded && (
            <div
              style={{
                padding: "0 20px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "6px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  paymentAccount
                </span>
                <span
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  → P2WPKH →
                </span>
                <span
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--yellow)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Pays BTC fees
                </span>
                {isConnected && paymentAddress && (
                  <span
                    style={{
                      fontSize: "0.55rem",
                      color: "var(--muted)",
                      fontFamily: "var(--font-mono)",
                      marginLeft: "4px",
                    }}
                  >
                    ({trunc(paymentAddress)})
                  </span>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "6px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  ordinalsAccount
                </span>
                <span
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  → P2TR →
                </span>
                <span
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--orange)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Your EVM identity
                </span>
                {isConnected && ordinalsAddress && (
                  <span
                    style={{
                      fontSize: "0.55rem",
                      color: "var(--muted)",
                      fontFamily: "var(--font-mono)",
                      marginLeft: "4px",
                    }}
                  >
                    ({trunc(ordinalsAddress)})
                  </span>
                )}
              </div>

              <div
                style={{
                  marginTop: "4px",
                  padding: "8px 10px",
                  background: "var(--orange-glow)",
                  border: "1px solid var(--orange-dim)",
                  borderRadius: "2px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--text)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Mixing these up is the #1 MIDL bug.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Section 3: Optimizations ──────────────────────── */}
        <div
          style={{
            padding: "20px",
            borderBottom: DIVIDER,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Label>// optimizations</Label>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div style={{ cursor: "help" }} title="Skips eth_chainId RPC call">
              <span
                style={{
                  fontSize: "0.7rem",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text)",
                }}
              >
                Pre-cache chain ID
              </span>
              <span
                style={{
                  marginLeft: "5px",
                  fontSize: "0.55rem",
                  color: "var(--muted)",
                }}
              >
                ?
              </span>
            </div>
            <Toggle
              checked={opts.preCacheChainId}
              onChange={() => toggleOpt("preCacheChainId")}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text)",
                }}
              >
                Custom fee rate
              </span>
              <Toggle
                checked={opts.customFeeRate}
                onChange={() => toggleOpt("customFeeRate")}
              />
            </div>
            {opts.customFeeRate && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="number"
                  value={feeRate}
                  min={1}
                  onChange={(e) => setFeeRate(Number(e.target.value))}
                  style={{
                    width: "70px",
                    padding: "5px 8px",
                    background: "var(--surface)",
                    border: "1px solid var(--border-hi)",
                    borderRadius: "2px",
                    color: "var(--text)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    outline: "none",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  sat/vB
                </span>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div
              style={{ cursor: "help" }}
              title="Shows internal SDK steps"
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text)",
                }}
              >
                Debug mode
              </span>
              <span
                style={{
                  marginLeft: "5px",
                  fontSize: "0.55rem",
                  color: "var(--muted)",
                }}
              >
                ?
              </span>
            </div>
            <Toggle
              checked={opts.debugMode}
              onChange={() => toggleOpt("debugMode")}
            />
          </div>
        </div>

        {/* ── Section 4: Run button ──────────────────────────── */}
        <div style={{ padding: "20px", marginTop: "auto" }}>
          {(traceStatus === "done" || traceStatus === "error") && (
            <button
              onClick={onReset}
              style={{
                width: "100%",
                marginBottom: "8px",
                padding: "8px 16px",
                background: "transparent",
                color: "var(--muted-hi)",
                border: "1px solid var(--border-hi)",
                borderRadius: "3px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Reset trace
            </button>
          )}
          <button
            disabled={!isConnected || traceStatus === "running"}
            onClick={() =>
              isConnected &&
              traceStatus !== "running" &&
              onRun({
                feeRate: opts.customFeeRate ? feeRate : undefined,
                debugMode: opts.debugMode,
              })
            }
            style={{
              width: "100%",
              padding: "14px 16px",
              background:
                !isConnected || traceStatus === "running"
                  ? "var(--surface)"
                  : "var(--orange)",
              color:
                !isConnected || traceStatus === "running"
                  ? "var(--muted)"
                  : "#000",
              border:
                !isConnected || traceStatus === "running"
                  ? "1px solid var(--border)"
                  : "none",
              borderRadius: "3px",
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor:
                !isConnected || traceStatus === "running"
                  ? "not-allowed"
                  : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {traceStatus === "running" && (
              <span
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  border: "1px solid var(--muted)",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.6s linear infinite",
                }}
              />
            )}
            {traceStatus === "running" ? "Running..." : "Run Transaction →"}
          </button>
          {!isConnected && (
            <p
              style={{
                margin: "8px 0 0",
                textAlign: "center",
                fontSize: "0.6rem",
                color: "var(--muted)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.04em",
              }}
            >
              connect wallet first
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
