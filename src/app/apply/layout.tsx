import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Application | MLBMiLB Brotherhood",
  description:
    "Apply to become an official vendor in the MLBMiLB Brotherhood business directory. Fill out the form to get reviewed by the group admins.",
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
