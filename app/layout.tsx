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
  title: "midl-txsim",
  description: "MIDL transaction simulator",
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
