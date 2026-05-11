"use client";

import { motion } from "framer-motion";

interface Vendor {
  id: number;
  category: string;
}

interface StatsBarProps {
  vendors: Vendor[];
}

export default function StatsBar({ vendors }: StatsBarProps) {
  const categoryCount = new Set(vendors.map((v) => v.category)).size;

  const stats = [
    { value: vendors.length, label: "Verified Vendors", suffix: "+" },
    { value: categoryCount, label: "Industry Categories", suffix: "" },
    { value: "MLB", label: "& MiLB Veteran Network", suffix: "/" },
    { value: "100", label: "Brotherhood Vetted", suffix: "%" },
  ];

  return (
    <section className="py-10 border-y border-white/[0.06] bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-extrabold gradient-text-gold tabular-nums">
                {s.suffix === "/"
                  ? `${s.value}/${s.suffix.replace("/", "MiLB")}`
                  : `${s.value}${s.suffix}`}
              </div>
              <div className="text-sm text-white/50 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
