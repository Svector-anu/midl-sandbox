"use client";

import { useTransactionTrace } from "@/hooks/useTransactionTrace";
import ControlsPanel from "./ControlsPanel";
import TracePanel from "./TracePanel";

export default function TxSimApp() {
  const { trace, run, reset } = useTransactionTrace();

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <ControlsPanel onRun={run} onReset={reset} traceStatus={trace.status} />
      <TracePanel trace={trace} />
    </div>
  );
}
