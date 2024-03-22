'use client'

import React from 'react'
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const sepoliaRpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_RPC_URL;

if (!walletConnectProjectId || !sepoliaRpcUrl) {
    throw new Error("Missing required environment variables");
}

const config = createConfig(
  getDefaultConfig({
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(sepoliaRpcUrl),
    },
    ssr: true,

    // Required API Keys
    walletConnectProjectId: walletConnectProjectId,

    // Required App Info
    appName: "RPS-LS",
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children : React.ReactNode }) => {

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          {mounted && children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};