import type { Metadata } from "next";
import { Cinzel, Source_Serif_4 } from "next/font/google";
import "./globals.css";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import { CartProvider } from '@/context/CartContext';

/* ---------- Fonts ---------- */

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
});

/* ---------- Metadata ---------- */

export const metadata: Metadata = {
  title: "Basho by Shivangi",
  description:
    "Japanese-inspired handcrafted pottery and studio experiences",
};

/* ---------- Layout ---------- */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${sourceSerif.variable} antialiased min-h-screen flex flex-col`}
      ><CartProvider>
        <Navbar /> 

        <main className="grow">{children}</main>
        
        <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
