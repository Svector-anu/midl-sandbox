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
  title: "MIDL Sandbox — Visualize the Bitcoin-Anchored EVM Flow",
  description:
    "See every RPC call, SDK step, and BTC signing event when you send a transaction on MIDL. Built for developers onboarding to Bitcoin L2.",
  icons: { icon: "/mild.jpg" },
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
        className={`${jetbrainsMono.variable} ${syne.variable} antialiased`}
        style={{ background: "#080808" }}
      >
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <filter id="glass-distort" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves={3} seed={2} result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={4} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            </filter>
          </defs>
        </svg>
        <MidlProviders>{children}</MidlProviders>
      </body>
    </html>
  );
}
