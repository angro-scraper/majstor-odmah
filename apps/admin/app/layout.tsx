import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Balkan.works Operations",
  description: "Balkan.works administration and moderation workspace.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="sr"><body>{children}</body></html>;
}
