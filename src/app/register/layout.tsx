import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Sign up and create an account to access the Lumio POS Cloud Dashboard and powerful analytics.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
