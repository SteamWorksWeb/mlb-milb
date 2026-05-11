import type { Metadata } from "next";
import Hero from "@/components/Hero";
import CategoryShowcase from "@/components/CategoryShowcase";
import StatsBar from "@/components/StatsBar";
import directoryData from "@/data/directory.json";

export const metadata: Metadata = {
  title: "Home — MLBMiLB Brotherhood",
};

export default function HomePage() {
  const { vendors, categories } = directoryData;
  const realCategories = categories.filter((c) => c !== "All");

  return (
    <>
      <Hero totalVendors={vendors.length} />
      <StatsBar vendors={vendors} />
      <CategoryShowcase categories={realCategories} />
    </>
  );
}
