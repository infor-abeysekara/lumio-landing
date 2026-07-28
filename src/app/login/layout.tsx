import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Login",
  description: "Login to your Lumio POS Cloud Dashboard to view analytics, manage inventory, and sync your shop data.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
