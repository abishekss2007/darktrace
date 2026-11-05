"use client";

import { ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/config/wagmi";
import "@rainbow-me/rainbowkit/styles.css";

const customForensicTheme = darkTheme({
  accentColor: "#F0B429",
  accentColorForeground: "#0A0B0D",
  borderRadius: "small",
  fontStack: "system",
  overlayBlur: "none",
});

// Override colors for terminal-forensic consistency
customForensicTheme.colors.modalBackground = "#121418";
customForensicTheme.colors.modalBorder = "#1F2328";
customForensicTheme.colors.modalText = "#E6E8EB";
customForensicTheme.colors.modalTextSecondary = "#8B929B";

interface AppClientProvidersProps {
  children: ReactNode;
}

export function AppClientProviders({ children }: AppClientProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 15_000,
          },
        },
      })
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customForensicTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

