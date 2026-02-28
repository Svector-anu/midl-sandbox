"use client";

import { MidlProvider } from "@midl/react";
import { WagmiMidlProvider } from "@midl/executor-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { midlConfig } from "@/lib/midl-config";
import BufferPolyfill from "@/components/BufferPolyfill";

const queryClient = new QueryClient();

export default function MidlProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MidlProvider config={midlConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiMidlProvider>
          <BufferPolyfill />
          {children}
        </WagmiMidlProvider>
      </QueryClientProvider>
    </MidlProvider>
  );
}
