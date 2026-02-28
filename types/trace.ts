export type TracePhase =
  | "EVM_PREFETCH"
  | "ADD_INTENTION"
  | "BTC_SIGNING"
  | "BROADCAST_CONFIRM";

export type TraceEventStatus = "pending" | "active" | "done" | "error";

export type TraceBadge = "EVM" | "SDK" | "BTC" | "WALLET" | "BTC+EVM";

export interface TraceEvent {
  id: string;
  phase: TracePhase;
  label: string;
  sublabel?: string;
  status: TraceEventStatus;
  startedAt?: number;
  duration?: number;
  badge: TraceBadge;
  txHash?: string;
}

export interface TraceState {
  status: "idle" | "running" | "done" | "error";
  events: TraceEvent[];
  totalDuration?: number;
  btcTxId?: string;
  evmTxHash?: string;
  errorMessage?: string;
  startedAt?: number;
}
