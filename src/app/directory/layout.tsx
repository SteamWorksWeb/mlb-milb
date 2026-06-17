import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Directory",
  description:
    "Explore the official directory of businesses owned or recommended by current and retired MLB & MiLB professional baseball players.",
};

export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
