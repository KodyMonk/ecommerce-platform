import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import AppSessionProvider from "@/components/providers/session-provider";
import AppShell from "@/components/layout/app-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ecom",
    template: "%s | Ecom",
  },
  description: "Modern ecommerce storefront",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
  <body
  className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
>
  <AppSessionProvider>
    <AppShell>{children}</AppShell>
  </AppSessionProvider>
</body>
</html>
  );
}