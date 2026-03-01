"use client";

import { useEffect, useState } from "react";

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const dismiss = () => setVisible(false);

  if (!visible) return null;

  return (
    <div
      onClick={dismiss}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111111",
          border: "1px solid #2a2a2a",
          borderRadius: "12px",
          padding: "clamp(16px, 5vw, 32px)",
          maxWidth: "420px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
        }}
      >
        {/* Logo + title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mild.jpg"
            alt="MIDL"
            style={{ width: "36px", height: "36px", borderRadius: "50%" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text)",
              }}
            >
              MIDL Sandbox
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.55rem",
                color: "var(--orange)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              staging network
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(0.85rem, 4vw, 1rem)",
              fontWeight: 600,
              color: "var(--text)",
              lineHeight: 1.4,
            }}
          >
            Watch a real Bitcoin-anchored transaction happen — live.
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              color: "var(--muted)",
              lineHeight: 1.8,
            }}
          >
            Connect your wallet, hit <span style={{ color: "var(--orange)" }}>Run Transaction</span>, and see every SDK call, BTC signature, and EVM confirmation play out step by step. No guessing what MIDL does under the hood.
          </p>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #1e1e1e" }} />

        {/* CTA */}
        <button
          onClick={dismiss}
          style={{
            width: "100%",
            padding: "12px",
            background: "var(--orange)",
            border: "none",
            borderRadius: "6px",
            fontFamily: "var(--font-sans)",
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "#000",
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          Let's go →
        </button>

        <button
          onClick={dismiss}
          style={{
            background: "none",
            border: "none",
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "var(--muted)",
            cursor: "pointer",
            padding: 0,
            textAlign: "center",
            letterSpacing: "0.06em",
          }}
        >
          skip
        </button>
      </div>
    </div>
  );
}
