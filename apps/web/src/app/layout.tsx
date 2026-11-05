import type { Metadata } from "next";
import "./globals.css";
import { AppClientProviders } from "@/components/providers/AppClientProviders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "DarkTrace | MEV Forensics for Uniswap v4 LPs",
  description: "Detect MEV extraction on Uniswap v4, seal proof on Arkiv, claim USDC rebates on Arc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg text-text flex flex-col antialiased">
        <AppClientProviders>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AppClientProviders>
      </body>
    </html>
  );
}

