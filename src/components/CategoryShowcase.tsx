"use client";

import { motion } from "framer-motion";
import { Globe, TrendingUp, Dumbbell, Heart, Building2, Cpu } from "lucide-react";
import Link from "next/link";

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  "Web & Marketing":      { icon: <Globe size={22} />,      color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20" },
  "Sports & Apparel":     { icon: <Dumbbell size={22} />,   color: "text-emerald-400",bg: "bg-emerald-500/10 border-emerald-500/20" },
  "Finance & Insurance":  { icon: <TrendingUp size={22} />, color: "text-gold-400",   bg: "bg-yellow-500/10 border-yellow-500/20" },
  "Health & Wellness":    { icon: <Heart size={22} />,      color: "text-rose-400",   bg: "bg-rose-500/10 border-rose-500/20" },
  "Real Estate & Mortgage":{ icon: <Building2 size={22} />, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  "Technology":           { icon: <Cpu size={22} />,        color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/20" },
};

const DEFAULT_CONFIG = { icon: <Globe size={22} />, color: "text-white/60", bg: "bg-white/5 border-white/10" };

interface CategoryShowcaseProps {
  categories: string[];
}

export default function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Browse by <span className="gradient-text">Category</span>
        </h2>
        <p className="mt-3 text-white/50 text-lg">
          Every business, vetted by the brotherhood.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, i) => {
          const config = CATEGORY_CONFIG[cat] ?? DEFAULT_CONFIG;
          const href = `/directory?category=${encodeURIComponent(cat)}`;

          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Link
                href={href}
                id={`category-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                className={`group flex flex-col items-center gap-3 p-6 rounded-2xl border glass-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${config.bg}`}
              >
                <div className={`${config.color} group-hover:scale-110 transition-transform duration-300`}>
                  {config.icon}
                </div>
                <span className="text-sm font-semibold text-white/80 group-hover:text-white text-center leading-tight transition-colors">
                  {cat}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/directory"
          id="showcase-view-all"
          className="btn-ghost"
        >
          View All Vendors →
        </Link>
      </div>
    </section>
  );
}
