"use client";

import { useState, useCallback, useRef } from "react";
import {
  useAddTxIntention,
  useFinalizeBTCTransaction,
  useSignIntentions,
  useSendBTCTransactions,
} from "@midl/executor-react";
import { useAccounts, useWaitForTransaction } from "@midl/react";
import { STAGING_RPC, ZERO_ADDRESS } from "@/lib/constants";
import type { TraceBadge, TraceEvent, TracePhase, TraceState } from "@/types/trace";

interface RunOpts {
  feeRate?: number;
  debugMode?: boolean;
}

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("estimateGasMulti is not a function"))
    return 'Missing viem override — add "viem": "npm:@midl/viem@2.21.39" to package.json';
  if (msg.includes("spendable UTXOs") || msg.includes("No spendable"))
    return "No spendable UTXOs. Get testnet BTC at faucet.midl.xyz";
  if (msg.toLowerCase().includes("rejected") || msg.toLowerCase().includes("cancelled"))
    return "Transaction rejected in wallet.";
  if (msg.includes("system contract") || msg.includes("System contract"))
    return "Wrong RPC endpoint. Use https://rpc.staging.midl.xyz";
  if (msg.includes("No public client"))
    return "Wagmi public client not ready. Try reconnecting your wallet.";
  return msg.length > 120 ? msg.slice(0, 120) + "…" : msg;
}

async function rpcCall(method: string, params: unknown[] = []): Promise<unknown> {
  const res = await fetch(STAGING_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

export function useTransactionTrace() {
  const [trace, setTrace] = useState<TraceState>({ status: "idle", events: [] });

  const { ordinalsAccount, paymentAccount } = useAccounts();
  const { addTxIntentionAsync } = useAddTxIntention();
  const { finalizeBTCTransactionAsync } = useFinalizeBTCTransaction();
  const { signIntentionsAsync } = useSignIntentions();
  const { sendBTCTransactionsAsync } = useSendBTCTransactions();
  const { waitForTransactionAsync } = useWaitForTransaction();

  // Stable counter for event IDs
  const counter = useRef(0);

  const addEvent = useCallback(
    (event: Omit<TraceEvent, "id">) => {
      const id = `evt-${++counter.current}`;
      setTrace((prev) => ({
        ...prev,
        events: [...prev.events, { ...event, id }],
      }));
      return id;
    },
    []
  );

  const updateEvent = useCallback((id: string, patch: Partial<TraceEvent>) => {
    setTrace((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  }, []);

  const markActive = useCallback(
    (
      phase: TracePhase,
      label: string,
      badge: TraceBadge,
      sublabel?: string
    ) => {
      return addEvent({
        phase,
        label,
        badge,
        sublabel,
        status: "active",
        startedAt: Date.now(),
      });
    },
    [addEvent]
  );

  const run = useCallback(
    async (opts: RunOpts = {}) => {
      if (!ordinalsAccount || !paymentAccount) return;

      const globalStart = Date.now();
      counter.current = 0;

      setTrace({ status: "running", events: [], startedAt: globalStart });

      try {
        // ── PHASE 0: EVM PREFETCH ──────────────────────────────────
        // eth_chainId
        let id = markActive("EVM_PREFETCH", "eth_chainId", "EVM");
        let t = Date.now();
        const chainIdHex = await rpcCall("eth_chainId") as string;
        const chainId = parseInt(chainIdHex, 16);
        updateEvent(id, {
          status: "done",
          duration: Date.now() - t,
          sublabel: `chain ID: ${chainId}`,
        });

        // eth_getTransactionCount (nonce lookup)
        id = markActive(
          "EVM_PREFETCH",
          "eth_getTransactionCount",
          "EVM",
          "fetching nonce"
        );
        t = Date.now();
        // evmAddress derived from ordinalsAccount — same logic as useEVMAddress
        const evmAddrRaw = await rpcCall("eth_accounts").catch(() => null);
        await rpcCall("eth_getTransactionCount", [
          // We use the ordinals address as a proxy for EVM addr lookup
          ordinalsAccount.address,
          "latest",
        ]).catch(() => null); // non-fatal
        updateEvent(id, {
          status: "done",
          duration: Date.now() - t,
          sublabel: "nonce ready",
        });

        // ── PHASE 1: ADD INTENTION ─────────────────────────────────
        id = markActive(
          "ADD_INTENTION",
          "addTxIntention",
          "SDK",
          "building EVM calldata → 0x transfer to zero address"
        );
        t = Date.now();
        await addTxIntentionAsync({
          reset: true,
          intention: {
            evmTransaction: {
              to: ZERO_ADDRESS,
              data: "0x",
            },
          },
        });
        updateEvent(id, { status: "done", duration: Date.now() - t });

        // ── PHASE 2: BTC SIGNING ───────────────────────────────────
        // estimateGasMulti is called internally by finalizeBTCTransaction
        id = markActive(
          "BTC_SIGNING",
          "estimateGasMulti",
          "EVM",
          "MIDL-specific — batch gas estimation for all intentions"
        );
        // We'll mark this done once finalize completes (it runs first internally)

        const finalizeId = markActive(
          "BTC_SIGNING",
          "finalizeBTCTransaction",
          "BTC",
          "selecting UTXOs + building PSBT..."
        );

        const walletId = markActive(
          "BTC_SIGNING",
          "PSBT signing",
          "WALLET",
          "⏳ approve in your wallet (Xverse / Leather)..."
        );

        const finalizeStart = Date.now();
        const btcTx = await finalizeBTCTransactionAsync({
          feeRate: opts.feeRate ?? 1,
        });
        const finalizeDuration = Date.now() - finalizeStart;

        const btcTxId = btcTx.tx.id;
        const btcTxHex = btcTx.tx.hex;

        updateEvent(id, { status: "done", duration: finalizeDuration });
        updateEvent(finalizeId, {
          status: "done",
          duration: finalizeDuration,
          sublabel: `PSBT built — ${btcTxId.slice(0, 12)}...`,
        });
        updateEvent(walletId, {
          status: "done",
          duration: finalizeDuration,
          sublabel: "PSBT signed ✓",
        });

        // ── PHASE 3: BROADCAST + CONFIRM ──────────────────────────
        // signIntentions triggers BIP322 message signing (second wallet popup)
        const signId = markActive(
          "BROADCAST_CONFIRM",
          "signIntentions",
          "WALLET",
          "⏳ signing EVM intent — approve BIP322 in your wallet..."
        );
        t = Date.now();
        const signedTxs = await signIntentionsAsync({ txId: btcTxId });
        updateEvent(signId, {
          status: "done",
          duration: Date.now() - t,
          sublabel: "EVM intent signed ✓",
        });

        // sendBTCTransactions broadcasts both BTC tx + signed EVM intents
        // Returns Hash[] — the EVM tx hashes (0x-prefixed, visible on Blockscout)
        id = markActive(
          "BROADCAST_CONFIRM",
          "sendBTCTransactions",
          "BTC+EVM",
          "broadcasting to Bitcoin mempool..."
        );
        t = Date.now();
        const evmTxHashes = await sendBTCTransactionsAsync({
          serializedTransactions: signedTxs as `0x${string}`[],
          btcTransaction: btcTxHex as `0x${string}`,
        });
        const evmTxHash = evmTxHashes?.[0];
        updateEvent(id, {
          status: "done",
          duration: Date.now() - t,
          txHash: evmTxHash,
          sublabel: evmTxHash
            ? `evm tx: ${evmTxHash.slice(0, 18)}...`
            : `btc txid: ${btcTxId.slice(0, 16)}...`,
        });

        // waitForTransaction — polls BTC mempool every 30s
        id = markActive(
          "BROADCAST_CONFIRM",
          "waitForTransaction",
          "BTC",
          "⏳ polling Bitcoin mempool for confirmation..."
        );
        t = Date.now();

        // Update sublabel with elapsed time while polling
        const pollInterval = setInterval(() => {
          const elapsed = Math.round((Date.now() - t) / 1000);
          updateEvent(id, {
            sublabel: `⏳ polling... ${elapsed}s elapsed (staging ~10–30 min is normal)`,
          });
        }, 5000);

        try {
          await waitForTransactionAsync({
            txId: btcTxId,
            confirmations: 1,
            intervalMs: 15000,
          });
        } finally {
          clearInterval(pollInterval);
        }

        updateEvent(id, {
          status: "done",
          duration: Date.now() - t,
          txHash: btcTxId,
          sublabel: "BTC confirmed ✓",
        });

        setTrace((prev) => ({
          ...prev,
          status: "done",
          totalDuration: Date.now() - globalStart,
          btcTxId,
          evmTxHash,
        }));
      } catch (err) {
        const message = friendlyError(err);
        setTrace((prev) => ({
          ...prev,
          status: "error",
          errorMessage: message,
          events: prev.events.map((e) =>
            e.status === "active" ? { ...e, status: "error" } : e
          ),
        }));
      }
    },
    [
      ordinalsAccount,
      paymentAccount,
      markActive,
      updateEvent,
      addTxIntentionAsync,
      finalizeBTCTransactionAsync,
      signIntentionsAsync,
      sendBTCTransactionsAsync,
      waitForTransactionAsync,
    ]
  );

  const reset = useCallback(() => {
    setTrace({ status: "idle", events: [] });
  }, []);

  return { trace, run, reset };
}
