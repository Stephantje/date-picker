import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Will you go on a date with me? 💕",
  description: "A special invitation just for you",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
