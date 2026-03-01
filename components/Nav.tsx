"use client";

import { useState, type ReactNode } from "react";

export default function Nav() {
  const [hovered, setHovered] = useState(false);

  return (
    <nav
      style={{
        position: "fixed",
        top: "12px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        maxWidth: "580px",
        width: "calc(100% - 32px)",
        height: "48px",
        borderRadius: "100px",
        background: "#111111",
        border: `1px solid ${hovered ? "rgba(247,83,31,0.3)" : "#2a2a2a"}`,
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
      {/* Left: pulse dot + title */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          className="pulse-dot"
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "var(--orange)",
            flexShrink: 0,
          }}
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
          MIDL TxSim
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
        }}
      >
        staging
      </span>

      {/* Right: nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
        <NavLink href="https://faucet.midl.xyz">faucet ↗</NavLink>
        <Divider />
        <NavLink href="https://docs.midl.xyz" hideOnMobile>docs ↗</NavLink>
        <Divider hideOnMobile />
        <NavLink href="https://github.com/Svector-anu/midl-sandbox" hideOnMobile>github ↗</NavLink>
      </div>
    </nav>
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
      className={hideOnMobile ? "nav-pill-divider nav-pill-divider--secondary" : "nav-pill-divider"}
    />
  );
}
