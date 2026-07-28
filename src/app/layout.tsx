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
  metadataBase: new URL('https://lumiopos.store'),
  title: {
    template: "%s | Lumio POS",
    default: "Lumio POS - Lightning Fast Next-Gen POS"
  },
  description: "Sri Lanka's fastest Point of Sale and Cloud Management system for retail and businesses. Upgrade your shop today.",
  icons: {
    icon: "/images/favicon.svg",
  },
  openGraph: {
    title: {
      template: "%s | Lumio POS",
      default: "Lumio POS - Lightning Fast Next-Gen POS"
    },
    description: "Sri Lanka's fastest Point of Sale and Cloud Management system for retail and businesses. Upgrade your shop today.",
    url: "https://lumiopos.store",
    siteName: "Lumio POS",
    images: [
      {
        url: "https://lumiopos.store/images/Logo.png",
        width: 800,
        height: 600,
        alt: "Lumio POS Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumio POS - Lightning Fast Next-Gen POS",
    description: "Run On Facts, Not Guesswork with Lumio POS.",
    images: ["https://lumiopos.store/images/Logo.png"],
  },
};

import { CartProvider } from "@/context/CartContext";
import FloatingCart from "@/components/FloatingCart";
import CartSidebar from "@/components/CartSidebar";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import Script from "next/script";

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
        {/* Google Analytics (GA4) */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-ZMS550MVHK`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZMS550MVHK');
            `,
          }}
        />

        <CartProvider>
          {children}
          <FloatingCart />
          <CartSidebar />
          <WhatsAppWidget />
        </CartProvider>
      </body>
    </html>
  );
}
