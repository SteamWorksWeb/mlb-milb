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
  metadataBase: new URL("https://mlbmilb.com"),
  title: {
    default: "MLBMiLB — The Brotherhood Business Directory",
    template: "%s | MLBMiLB Brotherhood",
  },
  description:
    "The official vendor and business directory for current and retired MLB & MiLB players. Explore trusted businesses across sports, finance, health, real estate, and more.",
  keywords: [
    "MLB",
    "MiLB",
    "baseball",
    "vendors",
    "player directory",
    "pro baseball",
    "business",
    "Major League Baseball",
    "Minor League Baseball",
    "professional athletes",
    "athlete network",
    "sports business",
    "player-owned businesses"
  ],
  authors: [{ name: "MLBMiLB Brotherhood" }],
  creator: "MLBMiLB Brotherhood",
  publisher: "MLBMiLB Brotherhood",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mlbmilb.com",
    siteName: "MLBMiLB Brotherhood",
    title: "MLBMiLB — The Brotherhood Business Directory",
    description:
      "The official vendor and business directory for current and retired MLB & MiLB players. Explore trusted businesses across sports, finance, health, real estate, and more.",
    images: [
      {
        url: "/social.png",
        width: 1200,
        height: 630,
        alt: "MLBMiLB Brotherhood — Pro Baseball Players Business & Vendor Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MLBMiLB — The Brotherhood Business Directory",
    description:
      "The official vendor and business directory for current and retired MLB & MiLB players. Explore trusted businesses across sports, finance, health, real estate, and more.",
    images: ["/social.png"],
  },
  icons: {
    icon: "/logo-white.png",
    shortcut: "/logo-white.png",
    apple: "/logo-white.png",
  },
  alternates: {
    canonical: "https://mlbmilb.com",
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
