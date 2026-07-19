import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumio POS - Lightning Fast Next-Gen POS",
  description: "Run On Facts, Not Guesswork with Lumio POS.",
  icons: {
    icon: "/images/favicon.svg",
  },
};

import { CartProvider } from "@/context/CartContext";
import FloatingCart from "@/components/FloatingCart";
import CartSidebar from "@/components/CartSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <CartProvider>
          {children}
          <FloatingCart />
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}
