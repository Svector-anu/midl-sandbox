import type { Metadata } from "next";
import { JetBrains_Mono, Syne } from "next/font/google";
import MidlProviders from "@/providers/MidlProviders";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MIDL TxSim — Visualize the Bitcoin-Anchored EVM Flow",
  description:
    "See every RPC call, SDK step, and BTC signing event when you send a transaction on MIDL. Built for developers onboarding to Bitcoin L2.",
  openGraph: {
    title: "MIDL TxSim",
    description: "Visualize the MIDL 4-step transaction flow in real time.",
    url: "https://midl-txsim.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} ${syne.variable} antialiased`}
        style={{ background: "#080808" }}
      >
        <MidlProviders>{children}</MidlProviders>
      </body>
    </html>
  );
}
