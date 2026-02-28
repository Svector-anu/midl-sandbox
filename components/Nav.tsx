export default function Nav() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: "52px",
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        flexShrink: 0,
      }}
    >
      {/* Left */}
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
            fontSize: "0.7rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text)",
          }}
        >
          MIDL TxSim
        </span>
        <span
          style={{
            fontSize: "0.55rem",
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--orange)",
            border: "1px solid var(--orange)",
            padding: "1px 5px",
            borderRadius: "2px",
          }}
        >
          staging
        </span>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <a
          href="https://faucet.midl.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link"
        >
          faucet ↗
        </a>
        <a
          href="https://docs.midl.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link"
        >
          docs ↗
        </a>
        <a href="#" className="nav-link">
          github ↗
        </a>
      </div>
    </nav>
  );
}
