"use client";

import { useEffect, useState } from "react";
import { useWalletConnection } from "@/hooks/useWalletConnection";

function classifyError(err: unknown): string {
  const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  if (msg.includes("not found") || msg.includes("not installed") || msg.includes("not detected") || msg.includes("provider"))
    return "Wallet not detected. Make sure it's installed and active.";
  if (msg.includes("rejected") || msg.includes("cancelled") || msg.includes("denied") || msg.includes("cancel"))
    return "Connection rejected.";
  const raw = err instanceof Error ? err.message : String(err);
  return raw.length > 80 ? raw.slice(0, 80) + "…" : raw;
}

function trunc(address: string, head = 6, tail = 4): string {
  if (address.length <= head + tail + 3) return address;
  return `${address.slice(0, head)}...${address.slice(-tail)}`;
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
    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.6rem", fontFamily: "var(--font-mono)" }}>
      <span style={{ color: labelColor, minWidth: "46px", letterSpacing: "0.04em" }}>{label}</span>
      <span style={{ color: "var(--muted)", wordBreak: "break-all" }}>{address}</span>
    </div>
  );
}

function TwoAddressBugCard({
  paymentAddress,
  ordinalsAddress,
  onDismiss,
}: {
  paymentAddress: string;
  ordinalsAddress: string;
  onDismiss: () => void;
}) {
  return (
    <div
      style={{
        border: "1px solid var(--border-hi)",
        borderLeft: "3px solid var(--yellow)",
        borderRadius: "3px",
        background: "rgba(234, 179, 8, 0.04)",
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        // common mistake
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {[
          { label: "payment", addr: paymentAddress, role: "→ pays BTC fees", type: "P2WPKH", color: "var(--yellow)" },
          { label: "ordinals", addr: ordinalsAddress, role: "→ EVM identity", type: "P2TR", color: "var(--orange)" },
        ].map(({ label, addr, role, type, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.6rem", color, fontFamily: "var(--font-mono)", minWidth: "52px" }}>{label}</span>
            <span style={{ fontSize: "0.55rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{trunc(addr, 8, 6)}</span>
            <span style={{ fontSize: "0.55rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{role}</span>
            <span style={{ fontSize: "0.5rem", color: "var(--muted)", fontFamily: "var(--font-mono)", opacity: 0.6 }}>← {type}</span>
          </div>
        ))}
      </div>
      <span style={{ fontSize: "0.6rem", color: "var(--text)", fontFamily: "var(--font-mono)", lineHeight: 1.6, opacity: 0.8 }}>
        Mixing these up breaks EVM transactions silently.
      </span>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={onDismiss}
          style={{ background: "transparent", border: "1px solid var(--border-hi)", borderRadius: "2px", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.06em", padding: "3px 8px", cursor: "pointer" }}
        >
          dismiss
        </button>
        <a href="https://js.midl.xyz/docs" target="_blank" rel="noopener noreferrer" style={{ border: "1px solid var(--border-hi)", borderRadius: "2px", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.55rem", padding: "3px 8px", textDecoration: "none", letterSpacing: "0.06em" }}>
          ?
        </a>
      </div>
    </div>
  );
}

export default function WalletCard() {
  const { connectors, connectAsync, disconnect, isConnected, isConnecting, paymentAccount, ordinalsAccount, evmAddress } =
    useWalletConnection();

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [addrCardDismissed, setAddrCardDismissed] = useState(false);

  const xverse = connectors.find((c) => c.metadata?.name?.toLowerCase().includes("xverse"));
  const leather = connectors.find((c) => c.metadata?.name?.toLowerCase().includes("leather"));

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

  useEffect(() => {
    setAddrCardDismissed(localStorage.getItem("midl-txsim-addr-dismissed") === "true");
  }, []);

  const dismissAddrCard = () => {
    localStorage.setItem("midl-txsim-addr-dismissed", "true");
    setAddrCardDismissed(true);
  };

  const paymentAddress = paymentAccount?.address ?? "";
  const ordinalsAddress = ordinalsAccount?.address ?? "";

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column" }}>
      {/* Connected: address rows */}
      {isConnected && paymentAddress && ordinalsAddress ? (
        <>
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text)" }}>
                  {trunc(paymentAddress)}
                </span>
              </div>
              <button
                onClick={disconnect}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.6rem", fontFamily: "var(--font-mono)", color: "var(--muted)", padding: 0 }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--red)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; }}
              >
                disconnect
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <AddressRow label="payment" labelColor="var(--yellow)" address={expanded ? paymentAddress : trunc(paymentAddress)} />
              <AddressRow label="ordinals" labelColor="var(--orange)" address={expanded ? ordinalsAddress : trunc(ordinalsAddress)} />
              <AddressRow label="evm" labelColor="var(--green)" address={expanded ? evmAddress : trunc(evmAddress)} />
            </div>
          </div>

          {!addrCardDismissed && (
            <div style={{ padding: "0 16px 12px" }}>
              <TwoAddressBugCard
                paymentAddress={paymentAddress}
                ordinalsAddress={ordinalsAddress}
                onDismiss={dismissAddrCard}
              />
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { label: "Xverse", connector: xverse },
              { label: "Leather", connector: leather },
            ].map(({ label, connector }) => (
              <button
                key={label}
                disabled={isConnecting}
                onClick={() => connector && handleConnect(connector.id)}
                style={{
                  flex: 1,
                  height: "36px",
                  background: "transparent",
                  border: "1px solid var(--border-hi)",
                  borderRadius: "4px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  color: "var(--muted-hi)",
                  cursor: isConnecting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--orange)";
                  e.currentTarget.style.color = "var(--orange)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-hi)";
                  e.currentTarget.style.color = "var(--muted-hi)";
                }}
              >
                {pendingId === connector?.id && (
                  <span style={{ display: "inline-block", width: "8px", height: "8px", border: "1px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                )}
                {label}
              </button>
            ))}
          </div>
          {connectError && (
            <p style={{ margin: 0, fontSize: "0.6rem", fontFamily: "var(--font-mono)", color: "var(--red)", lineHeight: 1.5 }}>
              {connectError}
            </p>
          )}
          <a href="https://faucet.midl.xyz" target="_blank" rel="noopener noreferrer" className="faucet-link">
            No testnet BTC? → faucet.midl.xyz
          </a>
        </div>
      )}

      {/* Why two addresses? accordion */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{ width: "100%", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", cursor: "pointer", color: "var(--muted-hi)" }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Why two addresses?
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1 }}>
            {expanded ? "−" : "+"}
          </span>
        </button>

        {expanded && (
          <div style={{ padding: "0 16px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { type: "P2WPKH", desc: "Pays BTC fees", color: "var(--yellow)", addr: paymentAddress },
              { type: "P2TR", desc: "EVM identity", color: "var(--orange)", addr: ordinalsAddress },
            ].map(({ type, desc, color, addr }) => (
              <div key={type} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "0.6rem", color, fontFamily: "var(--font-mono)", fontWeight: 600 }}>{type}</span>
                  <span style={{ fontSize: "0.6rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>— {desc}</span>
                </div>
                {isConnected && addr && (
                  <span style={{ fontSize: "0.55rem", color: "var(--muted)", fontFamily: "var(--font-mono)", wordBreak: "break-all" }}>
                    {addr}
                  </span>
                )}
              </div>
            ))}
            <div style={{ padding: "8px 10px", background: "var(--orange-glow)", border: "1px solid var(--orange-dim)", borderRadius: "2px" }}>
              <span style={{ fontSize: "0.6rem", color: "var(--text)", fontFamily: "var(--font-mono)" }}>
                Mixing these up is the #1 MIDL bug.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
