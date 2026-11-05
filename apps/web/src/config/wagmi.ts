import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { baseSepolia } from "viem/chains";
import { arcTestnet } from "./chains";

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64";

export const wagmiConfig = getDefaultConfig({
  appName: "DarkTrace Forensics",
  projectId,
  chains: [baseSepolia, arcTestnet],
  ssr: true,
});

