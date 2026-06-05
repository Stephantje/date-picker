import type { Metadata } from "next";
import "./globals.css";
import SWRegister from "./sw-register";

export const metadata: Metadata = {
  title: "Wil je op date met mij? 💕",
  description: "Een speciale uitnodiging speciaal voor jou",
  manifest: "/manifest.json",
  themeColor: "#f43f5e",
  appleWebApp: {
    capable: true,
    title: "Date? 💕",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>
        <SWRegister />
        {children}
      </body>
    </html>
  );
}