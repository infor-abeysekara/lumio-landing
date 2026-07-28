import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessories & Hardware Shop",
  description: "Buy high-quality thermal printers, barcode scanners, and POS hardware for your business in Sri Lanka.",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
