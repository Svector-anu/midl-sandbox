"use client";

import { useState, type ReactNode } from "react";
import { useWalletConnection } from "@/hooks/useWalletConnection";

function trunc(address: string, head = 6, tail = 4): string {
  if (address.length <= head + tail + 3) return address;
  return `${address.slice(0, head)}...${address.slice(-tail)}`;
}

export default function Nav() {
  const [hovered, setHovered] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const { connectors, connectAsync, disconnect, isConnected, isConnecting, paymentAccount } =
    useWalletConnection();

  const xverse = connectors.find((c) => c.metadata?.name?.toLowerCase().includes("xverse"));
  const leather = connectors.find((c) => c.metadata?.name?.toLowerCase().includes("leather"));

  const handleConnect = async (id: string) => {
    setPendingId(id);
    try {
      await connectAsync({ id });
    } finally {
      setPendingId(null);
    }
  };

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <nav
        style={{
          position: "fixed",
          top: "12px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          maxWidth: "820px",
          width: "calc(100% - 32px)",
          height: "48px",
          borderRadius: "100px",
          background: "#111111",
          border: `1px solid ${hovered ? "rgba(255,140,55,0.3)" : "#2a2a2a"}`,
          boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          transition: "border-color 0.2s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Left: logo + title */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mild.jpg"
            alt="MIDL"
            style={{ width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0 }}
          />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "0.82rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text)",
              whiteSpace: "nowrap",
            }}
          >
            MIDL Sandbox
          </span>
        </div>

        {/* Center: staging badge */}
        <span
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--orange)",
            border: "1px solid var(--orange-dim)",
            background: "var(--orange-glow)",
            borderRadius: "100px",
            padding: "3px 12px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          staging
        </span>

        {/* Right: wallet + links */}
        <div style={{ display: "flex", alignItems: "center", gap: "0", flexShrink: 0 }}>
          {/* Wallet section */}
          {isConnected && paymentAccount ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "0 14px" }}>
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "var(--green)",
                    flexShrink: 0,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    color: "var(--muted-hi)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {trunc(paymentAccount.address)}
                </span>
                <button
                  onClick={disconnect}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    color: "var(--muted)",
                    padding: "0 0 0 4px",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--red)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; }}
                >
                  ✕
                </button>
              </div>
              <Divider />
            </>
          ) : (
            <>
              <div className="nav-wallet-btns">
                {[
                  { label: "Xverse", connector: xverse },
                  { label: "Leather", connector: leather },
                ].map(({ label, connector }) => (
                  <button
                    key={label}
                    disabled={isConnecting}
                    onClick={() => connector && handleConnect(connector.id)}
                    style={{
                      height: "28px",
                      padding: "0 12px",
                      background: "transparent",
                      border: "1px solid var(--border-hi)",
                      borderRadius: "100px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      color: "var(--muted-hi)",
                      cursor: isConnecting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      transition: "border-color 0.15s, color 0.15s",
                      whiteSpace: "nowrap",
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
                      <span
                        style={{
                          display: "inline-block",
                          width: "7px",
                          height: "7px",
                          border: "1px solid var(--muted)",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 0.6s linear infinite",
                        }}
                      />
                    )}
                    {label}
                  </button>
                ))}
              </div>
              <Divider />
            </>
          )}

          <NavLink href="https://faucet.midl.xyz">faucet ↗</NavLink>
          <Divider hideOnMobile />
          <NavLink href="https://js.midl.xyz/docs" hideOnMobile>docs ↗</NavLink>
          <Divider hideOnMobile />
          <NavLink href="https://github.com/Svector-anu/midl-sandbox" hideOnMobile>github ↗</NavLink>
        </div>
      </nav>
    </>
  );
}

function NavLink({
  href,
  children,
  hideOnMobile,
}: {
  href: string;
  children: ReactNode;
  hideOnMobile?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={hideOnMobile ? "nav-pill-link nav-pill-link--secondary" : "nav-pill-link"}
    >
      {children}
    </a>
  );
}

function Divider({ hideOnMobile }: { hideOnMobile?: boolean }) {
  return (
    <span
      className={
        hideOnMobile ? "nav-pill-divider nav-pill-divider--secondary" : "nav-pill-divider"
      }
    />
  );
}
