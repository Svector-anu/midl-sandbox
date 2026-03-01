"use client";

import { useTransactionTrace } from "@/hooks/useTransactionTrace";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import WalletCard from "./cards/WalletCard";
import ConfigCard from "./cards/ConfigCard";
import InfoCard from "./cards/InfoCard";
import BuildCard from "./cards/BuildCard";
import TracePanel from "./TracePanel";

export default function TxSimApp() {
  const { trace, run, reset } = useTransactionTrace();
  const { paymentAccount } = useWalletConnection();

  return (
    <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-4 p-4 md:h-[calc(100vh-52px)] overflow-auto md:overflow-hidden">
      {/* LEFT: stacked cards */}
      <div className="flex flex-col gap-4 md:overflow-y-auto">
        <WalletCard />
        <ConfigCard onRun={run} onReset={reset} traceStatus={trace.status} />
        <InfoCard />
        <BuildCard />
      </div>

      {/* RIGHT: single tall trace card */}
      <div className="md:h-full overflow-hidden min-h-[60vh] md:min-h-0">
        <TracePanel trace={trace} paymentAddress={paymentAccount?.address} />
      </div>
    </div>
  );
}
