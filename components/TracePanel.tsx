import type { TraceBadge, TraceEvent, TracePhase, TraceState } from "@/types/trace";
import { BLOCKSCOUT_URL, MEMPOOL_URL } from "@/lib/constants";

// ─── Constants ──────────────────────────────────────────────────────────────

const PHASE_ORDER: TracePhase[] = [
  "EVM_PREFETCH",
  "ADD_INTENTION",
  "BTC_SIGNING",
  "BROADCAST_CONFIRM",
];

const PHASE_META: Record<
  TracePhase,
  { label: string; badge: TraceBadge; color: string }
> = {
  EVM_PREFETCH:      { label: "EVM PREFETCH",      badge: "EVM",    color: "#60a5fa" },
  ADD_INTENTION:     { label: "ADD INTENTION",      badge: "SDK",    color: "var(--orange)" },
  BTC_SIGNING:       { label: "BTC SIGNING",        badge: "BTC",    color: "var(--yellow)" },
  BROADCAST_CONFIRM: { label: "BROADCAST + CONFIRM",badge: "BTC+EVM",color: "var(--muted-hi)" },
};

const BADGE_COLORS: Record<TraceBadge, string> = {
  EVM:    "#60a5fa",
  SDK:    "var(--orange)",
  BTC:    "var(--yellow)",
  WALLET: "var(--green)",
  "BTC+EVM": "var(--muted-hi)",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        fontSize: "0.5rem",
        fontFamily: "var(--font-mono)",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color,
        border: `1px solid ${color}`,
        padding: "1px 5px",
        borderRadius: "2px",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function StatusDot({ status }: { status: TraceEvent["status"] }) {
  const color =
    status === "done"    ? "var(--green)"  :
    status === "error"   ? "var(--red)"    :
    status === "active"  ? "var(--orange)" :
                           "var(--border-hi)";

  return (
    <div
      style={{
        width: "5px",
        height: "5px",
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
        animation: status === "active" ? "pulse-dot 1.2s ease-in-out infinite" : undefined,
      }}
    />
  );
}

function Duration({ ms }: { ms: number }) {
  const display = ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  return (
    <span
      style={{
        fontSize: "0.55rem",
        color: "var(--muted)",
        fontFamily: "var(--font-mono)",
        marginLeft: "auto",
        flexShrink: 0,
      }}
    >
      {display}
    </span>
  );
}

function TxLink({ txHash }: { txHash: string }) {
  const isBtcTxId = !txHash.startsWith("0x");
  const href = isBtcTxId
    ? `${MEMPOOL_URL}/tx/${txHash}`
    : `${BLOCKSCOUT_URL}/tx/${txHash}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontSize: "0.55rem",
        fontFamily: "var(--font-mono)",
        color: "var(--orange)",
        textDecoration: "none",
        letterSpacing: "0.04em",
      }}
      title={txHash}
    >
      {txHash.slice(0, 10)}… ↗
    </a>
  );
}

function EventRow({ event }: { event: TraceEvent }) {
  const badgeColor = BADGE_COLORS[event.badge] ?? "var(--muted)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
        padding: "7px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <StatusDot status={event.status} />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "3px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: "0.7rem",
              fontFamily: "var(--font-mono)",
              color: event.status === "error" ? "var(--red)" : "var(--text)",
              letterSpacing: "0.02em",
            }}
          >
            {event.label}
          </span>
          <Badge label={event.badge} color={badgeColor} />
          {event.txHash && <TxLink txHash={event.txHash} />}
          {event.duration !== undefined && <Duration ms={event.duration} />}
        </div>

        {event.sublabel && (
          <span
            style={{
              fontSize: "0.6rem",
              fontFamily: "var(--font-mono)",
              color:
                event.status === "error"
                  ? "var(--red)"
                  : "var(--muted)",
              lineHeight: 1.5,
            }}
          >
            {event.sublabel}
          </span>
        )}
      </div>
    </div>
  );
}

function PhaseSection({
  phase,
  events,
}: {
  phase: TracePhase;
  events: TraceEvent[];
}) {
  const meta = PHASE_META[phase];
  const allDone = events.every((e) => e.status === "done");
  const hasError = events.some((e) => e.status === "error");

  const headerColor = hasError
    ? "var(--red)"
    : allDone
    ? "var(--muted-hi)"
    : "var(--text)";

  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      {/* Phase header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 24px 6px",
        }}
      >
        <span
          style={{
            fontSize: "0.5rem",
            fontFamily: "var(--font-mono)",
            color: "var(--muted)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {phase.replace("_", " ")}:
        </span>
        <span
          style={{
            fontSize: "0.65rem",
            fontFamily: "var(--font-mono)",
            color: headerColor,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {meta.label}
        </span>
        <Badge label={meta.badge} color={meta.color} />
        {allDone && !hasError && (
          <span
            style={{
              fontSize: "0.55rem",
              color: "var(--green)",
              fontFamily: "var(--font-mono)",
              marginLeft: "4px",
            }}
          >
            ✓
          </span>
        )}
      </div>

      {/* Event rows */}
      <div style={{ padding: "0 24px 8px 36px" }}>
        {events.map((event) => (
          <EventRow key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

function SummaryBar({ trace }: { trace: TraceState }) {
  if (trace.status === "idle" || trace.status === "running") return null;

  const isDone = trace.status === "done";

  return (
    <div
      style={{
        padding: "14px 24px",
        borderBottom: "1px solid var(--border)",
        background: isDone ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontSize: "0.65rem",
          fontFamily: "var(--font-mono)",
          color: isDone ? "var(--green)" : "var(--red)",
          letterSpacing: "0.06em",
        }}
      >
        {isDone ? "// transaction complete" : "// transaction failed"}
      </span>

      {isDone && trace.totalDuration !== undefined && (
        <span
          style={{
            fontSize: "0.6rem",
            fontFamily: "var(--font-mono)",
            color: "var(--muted)",
          }}
        >
          total: {(trace.totalDuration / 1000).toFixed(1)}s
        </span>
      )}

      {isDone && trace.evmTxHash && (
        <a
          href={`${BLOCKSCOUT_URL}/tx/${trace.evmTxHash}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.6rem",
            fontFamily: "var(--font-mono)",
            color: "var(--orange)",
            textDecoration: "none",
            letterSpacing: "0.04em",
          }}
        >
          view on Blockscout ↗
        </a>
      )}
      {isDone && trace.btcTxId && (
        <a
          href={`${MEMPOOL_URL}/tx/${trace.btcTxId}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.6rem",
            fontFamily: "var(--font-mono)",
            color: "var(--muted-hi)",
            textDecoration: "none",
            letterSpacing: "0.04em",
          }}
        >
          view BTC on mempool ↗
        </a>
      )}

      {!isDone && trace.errorMessage && (
        <span
          style={{
            fontSize: "0.6rem",
            fontFamily: "var(--font-mono)",
            color: "var(--red)",
            opacity: 0.85,
          }}
        >
          {trace.errorMessage}
        </span>
      )}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function TracePanel({ trace }: { trace: TraceState }) {
  const eventsByPhase = PHASE_ORDER.reduce<Record<TracePhase, TraceEvent[]>>(
    (acc, phase) => {
      acc[phase] = trace.events.filter((e) => e.phase === phase);
      return acc;
    },
    {} as Record<TracePhase, TraceEvent[]>
  );

  const activePhasesInOrder = PHASE_ORDER.filter(
    (p) => eventsByPhase[p].length > 0
  );

  const isIdle = trace.status === "idle";

  return (
    <main
      style={{
        flex: 1,
        height: "calc(100vh - 52px)",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Summary bar — shown when done or error */}
      {!isIdle && <SummaryBar trace={trace} />}

      {/* Empty state */}
      {isIdle && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: "var(--muted)",
              letterSpacing: "0.04em",
            }}
          >
            // run a transaction to see the trace
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              color: "var(--muted)",
              textAlign: "center",
              maxWidth: "360px",
              lineHeight: 1.7,
              opacity: 0.7,
            }}
          >
            every step of the MIDL 4-step flow will appear here in real time
          </span>
        </div>
      )}

      {/* Live phase blocks */}
      {activePhasesInOrder.length > 0 && (
        <div style={{ flex: isIdle ? undefined : 1 }}>
          {activePhasesInOrder.map((phase) => (
            <PhaseSection
              key={phase}
              phase={phase}
              events={eventsByPhase[phase]}
            />
          ))}
        </div>
      )}

      {/* Idle phase placeholders (when no events yet) */}
      {isIdle && (
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {PHASE_ORDER.map((phase) => {
            const meta = PHASE_META[phase];
            return (
              <div
                key={phase}
                style={{
                  borderBottom: "1px solid var(--border)",
                  padding: "14px 24px",
                  opacity: 0.3,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.5rem",
                    fontFamily: "var(--font-mono)",
                    color: "var(--muted)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {phase.replace("_", " ")}:
                </span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontFamily: "var(--font-mono)",
                    color: "var(--muted-hi)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {meta.label}
                </span>
                <Badge label={meta.badge} color={meta.color} />
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
