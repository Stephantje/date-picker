import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wil je op date met mij? 💕",
  description: "Een speciale uitnodiging voor jou",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f43f5e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Date? 💕" />
      </head>
      <body>{children}</body>
    </html>
  );
}
