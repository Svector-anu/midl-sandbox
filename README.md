# MIDL TxSim

Visualize every step of the MIDL 4-step transaction flow in real time.

MIDL is a Bitcoin-anchored EVM L2. Unlike standard EVM chains, every write
operation goes through a 4-step protocol that anchors state changes to Bitcoin.
This tool makes that flow visible — every RPC call, every SDK step, every
millisecond.

## What you'll see

1. **EVM Prefetch** — eth_chainId, nonce, estimateGasMulti
2. **Add Intention** — addTxIntention() queues the EVM calldata
3. **BTC Signing** — PSBT construction + wallet signing popup
4. **Broadcast + Confirm** — Bitcoin broadcast → EVM confirmation (anchored to a Bitcoin block)

## Why this exists

The #1 onboarding failure on MIDL is developers treating it like a standard EVM
chain. This tool shows exactly where MIDL diverges from Ethereum and why.

## Common issues surfaced

| Error | Cause | Fix |
|-------|-------|-----|
| `estimateGasMulti is not a function` | Missing viem override | Add `"viem": "npm:@midl/viem@2.21.39"` to package.json |
| `No spendable UTXOs` | No testnet BTC | Get BTC at faucet.midl.xyz |
| `unknown account` | Using standard wagmi instead of MIDL executor flow | Use useAddTxIntention, not useWriteContract |
| `system contract not found` | Wrong RPC URL | Use https://rpc.staging.midl.xyz |
| EVM tx not found | Mixed up payment vs ordinals account | EVM identity comes from P2TR (ordinals), not P2WPKH (payment) |

## Stack

- Next.js 16 + TypeScript + Tailwind v4
- @midl/core, @midl/react, @midl/executor, @midl/executor-react
- @midl/viem@2.21.39 (override required)

## Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000, connect Xverse or Leather, click Run Transaction.

## Built by

Svector-anu — DevEx Ambassador, MIDL
