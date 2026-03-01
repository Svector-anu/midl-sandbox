import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import MidlProviders from "@/providers/MidlProviders";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MIDL Sandbox — Visualize the Bitcoin-Anchored EVM Flow",
  description:
    "See every RPC call, SDK step, and BTC signing event when you send a transaction on MIDL. Built for developers onboarding to Bitcoin L2.",
  openGraph: {
    title: "MIDL Sandbox",
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
        className={`${jetbrainsMono.variable} ${plusJakartaSans.variable} antialiased`}
        style={{ background: "#080808" }}
      >
        <MidlProviders>{children}</MidlProviders>
      </body>
    </html>
  );
}
