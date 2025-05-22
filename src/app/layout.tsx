import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AblyProvider } from "@/components/AblyProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tic Tac Toe",
  description: "Play Tic Tac Toe with your friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AblyProvider>
          {children}
        </AblyProvider>
      </body>
    </html>
  );
}