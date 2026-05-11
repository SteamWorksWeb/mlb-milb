import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "MLBMiLB — The Brotherhood Business Directory",
    template: "%s | MLBMiLB Brotherhood",
  },
  description:
    "The official vendor and business directory for current and retired MLB & MiLB players. Explore trusted businesses across sports, finance, health, real estate, and more.",
  keywords: ["MLB", "MiLB", "baseball", "vendors", "player directory", "pro baseball", "business"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mlbmilb.com",
    siteName: "MLBMiLB Brotherhood",
    title: "MLBMiLB — The Brotherhood Business Directory",
    description:
      "Trusted businesses from current and retired MLB & MiLB players. Sports, finance, health, real estate, and more.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased bg-diamond-950`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
