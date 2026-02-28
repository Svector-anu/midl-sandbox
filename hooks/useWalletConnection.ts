import { useAccounts, useConnect, useDisconnect } from "@midl/react";
import { AddressPurpose } from "@midl/core";
import { useEVMAddress } from "@midl/executor-react";

export function useWalletConnection() {
  const { connectors, connectAsync, isPending } = useConnect({
    purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
  });

  const { disconnect } = useDisconnect();

  const { isConnected, isConnecting, paymentAccount, ordinalsAccount } =
    useAccounts();

  // Returns a string directly — zeroAddress when disconnected
  const evmAddress = useEVMAddress({ from: ordinalsAccount?.address });

  return {
    connectors,
    connectAsync,
    disconnect,
    isConnected,
    isConnecting: isConnecting || isPending,
    paymentAccount,
    ordinalsAccount,
    evmAddress,
  };
}
