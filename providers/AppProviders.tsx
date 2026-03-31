"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { SplitStatusProvider } from "@/hooks/useSplitStatus";
import { wagmiConfig } from "@/lib/wagmi";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SplitStatusProvider>{children}</SplitStatusProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
