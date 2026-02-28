"use client";

import { useTransactionTrace } from "@/hooks/useTransactionTrace";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import ControlsPanel from "./ControlsPanel";
import TracePanel from "./TracePanel";

export default function TxSimApp() {
  const { trace, run, reset } = useTransactionTrace();
  const { paymentAccount } = useWalletConnection();

  return (
    <div className="panel-layout">
      <ControlsPanel onRun={run} onReset={reset} traceStatus={trace.status} />
      <TracePanel trace={trace} paymentAddress={paymentAccount?.address} />
    </div>
  );
}
