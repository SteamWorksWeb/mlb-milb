import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import directoryData from "@/data/directory.json";

// Below-fold components — code-split so they don't block the critical rendering path
const StatsBar = dynamic(() => import("@/components/StatsBar"), { ssr: true });
const CategoryShowcase = dynamic(() => import("@/components/CategoryShowcase"), { ssr: true });

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
