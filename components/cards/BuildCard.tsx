export default function BuildCard() {
  return (
    <div
      className="card"
      style={{
        borderLeft: "3px solid var(--orange)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.55rem",
          color: "var(--muted)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        // build on midl
      </span>

      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.9rem",
          fontWeight: 700,
          color: "var(--text)",
          lineHeight: 1.3,
        }}
      >
        Bitcoin-anchored EVM smart contracts
      </span>

      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: "var(--muted)",
          lineHeight: 1.6,
        }}
      >
        Deploy Solidity contracts that are secured by Bitcoin consensus.
        No bridges, no wrapped assets.
      </span>

      <a
        href="https://docs.midl.xyz"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 14px",
          background: "var(--orange-glow)",
          border: "1px solid var(--orange-dim)",
          borderRadius: "3px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: "var(--orange)",
          textDecoration: "none",
          letterSpacing: "0.04em",
          transition: "background 0.15s",
          alignSelf: "flex-start",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(247,83,31,0.18)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--orange-glow)"; }}
      >
        Read the docs ↗
      </a>
    </div>
  );
}
