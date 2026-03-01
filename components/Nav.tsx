"use client";

import { type ReactNode } from "react";

export default function Nav() {
  return (
    <div
      style={{
        position: "fixed",
        top: "12px",
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        padding: "0 16px",
        pointerEvents: "none",
      }}
    >
      <nav
        style={{
          pointerEvents: "auto",
          width: "100%",
          maxWidth: "600px",
          height: "48px",
          borderRadius: "100px",
          background: "rgba(10,10,10,0.95)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow:
            "0 0 0 0.5px rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          position: "relative",
        }}
      >
        {/* Left: pulse dot + title */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            className="pulse-dot"
            style={{
              display: "inline-block",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#f7531f",
              flexShrink: 0,
              boxShadow: "0 0 6px 2px rgba(247,83,31,0.5)",
            }}
          />
          <span className="nav-title">MIDL TxSim</span>
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
            color: "#f7531f",
            border: "1px solid rgba(247,83,31,0.25)",
            background: "rgba(247,83,31,0.08)",
            borderRadius: "100px",
            padding: "3px 12px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          staging
        </span>

        {/* Right: links */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <NavLink href="https://faucet.midl.xyz">faucet ↗</NavLink>
          <Divider hideOnMobile />
          <NavLink href="https://docs.midl.xyz" hideOnMobile>docs ↗</NavLink>
          <Divider hideOnMobile />
          <NavLink href="https://github.com/Svector-anu/midl-sandbox" hideOnMobile>github ↗</NavLink>
        </div>
      </nav>
    </div>
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
