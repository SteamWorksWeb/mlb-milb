"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Phone,
  Globe,
  Search,
  Filter,
  X,
  MapPin,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import directoryData from "@/data/directory.json";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Vendor {
  id: number;
  contactName: string;
  businessName: string;
  description: string | null;
  category: string;
  location?: string | null;
  phone: string | null;
  phoneDial: string | null;
  website: string | null;
}

// ── Category color map ────────────────────────────────────────────────────────
const CATEGORY_STYLE: Record<string, { pill: string; dot: string }> = {
  "Web & Marketing":       { pill: "bg-blue-500/15 text-blue-300 border-blue-500/25",    dot: "bg-blue-400" },
  "Sports & Apparel":      { pill: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25", dot: "bg-emerald-400" },
  "Finance & Insurance":   { pill: "bg-yellow-500/15 text-yellow-300 border-yellow-500/25", dot: "bg-yellow-400" },
  "Health & Wellness":     { pill: "bg-rose-500/15 text-rose-300 border-rose-500/25",    dot: "bg-rose-400" },
  "Real Estate & Mortgage":{ pill: "bg-purple-500/15 text-purple-300 border-purple-500/25", dot: "bg-purple-400" },
  "Technology":            { pill: "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",    dot: "bg-cyan-400" },
  "Travel & Outdoors":     { pill: "bg-teal-500/15 text-teal-300 border-teal-500/25",    dot: "bg-teal-400" },
  "Speaking & Consulting": { pill: "bg-orange-500/15 text-orange-300 border-orange-500/25", dot: "bg-orange-400" },
  "Other":                 { pill: "bg-slate-500/15 text-slate-300 border-slate-500/25", dot: "bg-slate-400" },
};

const DEFAULT_STYLE = { pill: "bg-white/10 text-white/60 border-white/10", dot: "bg-white/40" };

// ── Framer Motion variants ────────────────────────────────────────────────────
const cardVariants = {
  hidden:  { opacity: 0, scale: 0.92, y: 16 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.35, ease: "easeOut" as const } },
  exit:    { opacity: 0, scale: 0.88, y: -8, transition: { duration: 0.22, ease: "easeIn"  as const } },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
/** Extract just the clean business name (before the description blob) */
function cleanBusinessName(raw: string): string {
  // The scraper sometimes concatenates description into businessName; trim at first sentence boundary
  return raw.split(/\s{3,}/)[0].trim().slice(0, 80);
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ── Vendor Card ───────────────────────────────────────────────────────────────
function VendorCard({ vendor }: { vendor: Vendor }) {
  const style = CATEGORY_STYLE[vendor.category] ?? DEFAULT_STYLE;
  const initials = getInitials(vendor.businessName);

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="group relative glass-card rounded-2xl overflow-hidden flex flex-col gap-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-diamond-500/10"
      aria-label={`Vendor: ${vendor.businessName}`}
    >
      {/* Card image banner */}
      <div className="relative h-48 w-full overflow-hidden shrink-0">
        <Image
          src="/list-image-placeholder.png"
          alt="MLBMiLB vendor badge"
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-diamond-950/90 via-diamond-950/30 to-transparent" />
        {/* Category pill floated on image */}
        <span
          className={`absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border backdrop-blur-sm ${style.pill}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {vendor.category}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-4 p-5 flex-1">
      {/* Top row */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-diamond-600 to-diamond-800 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-inner">
          {initials || "⚾"}
        </div>

        {/* Name + contact */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-white leading-tight truncate group-hover:text-diamond-300 transition-colors">
            {vendor.businessName}
          </h2>
          <p className="text-xs text-white/50 mt-0.5 truncate">{vendor.contactName}</p>
        </div>
      </div>

      {/* Description */}
      {vendor.description && (
        <p className="text-sm text-white/55 leading-relaxed line-clamp-3 flex-1">
          {vendor.description}
        </p>
      )}

      {/* Location */}
      {vendor.location && (
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <MapPin size={11} />
          {vendor.location}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 mt-auto border-t border-white/[0.06]">
        {vendor.phoneDial && vendor.phone && (
          <a
            href={vendor.phoneDial}
            id={`vendor-phone-${vendor.id}`}
            aria-label={`Call ${vendor.businessName}: ${vendor.phone}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-diamond-500/20 hover:text-diamond-300 text-white/60 transition-all duration-200 border border-white/5 hover:border-diamond-500/30"
          >
            <Phone size={12} />
            {vendor.phone}
          </a>
        )}

        {vendor.website && (
          <a
            href={vendor.website}
            id={`vendor-website-${vendor.id}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${vendor.businessName} website`}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
              vendor.phoneDial && vendor.phone
                ? "bg-white/5 hover:bg-diamond-500/20 hover:text-diamond-300 text-white/60 border-white/5 hover:border-diamond-500/30"
                : "flex-1 bg-diamond-500/15 hover:bg-diamond-500/30 text-diamond-300 border-diamond-500/25"
            }`}
          >
            <Globe size={12} />
            Website
            <ExternalLink size={10} />
          </a>
        )}

        {!vendor.phone && !vendor.website && (
          <span className="text-xs text-white/25 italic">Contact via Facebook group</span>
        )}
      </div>
      </div>{/* end card body */}
    </motion.article>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DirectoryPage() {
  const { vendors, categories } = directoryData as { vendors: Vendor[]; categories: string[] };

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery]       = useState<string>("");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      const matchCat = activeCategory === "All" || v.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        v.businessName.toLowerCase().includes(q) ||
        v.contactName.toLowerCase().includes(q) ||
        (v.description ?? "").toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [vendors, activeCategory, searchQuery]);

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    setShowMobileFilter(false);
  };

  return (
    <>
      {/* ── Page header with banner image ───────────────────────── */}
      <header className="relative overflow-hidden">
        {/* Cinematic banner */}
        <div className="relative h-72 sm:h-80 w-full">
          <Image
            src="/vendors.jpeg"
            alt="MLB MiLB vendor marketplace"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-diamond-950/60 via-diamond-950/50 to-diamond-950" />
        </div>
        {/* Text overlaid on the banner */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-4 sm:px-6">
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-widest text-diamond-400 mb-3"
          >
            Official Brotherhood Vendor Registry
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight"
          >
            Vendor <span className="gradient-text">Directory</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-4 text-white/55 text-lg max-w-xl mx-auto"
          >
            {vendors.length} businesses owned or recommended by current and retired MLB &amp; MiLB players.
          </motion.p>
        </div>
        </div>{/* absolute overlay */}
      </header>

      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-diamond-950/95 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          {/* Search */}
          <label htmlFor="vendor-search" className="sr-only">Search vendors</label>
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
            <input
              id="vendor-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search businesses, names, categories…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-diamond-500/50 focus:bg-white/8 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Desktop category filters */}
          <div className="hidden lg:flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                onClick={() => handleCategory(cat)}
                className={`category-pill text-xs ${
                  activeCategory === cat ? "category-pill-active" : "category-pill-inactive"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Mobile filter toggle */}
          <button
            id="mobile-filter-toggle"
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-white/60 bg-white/5 border border-white/10 hover:border-white/20 transition-all"
          >
            <Filter size={14} />
            Filter
            <ChevronDown
              size={13}
              className={`transition-transform ${showMobileFilter ? "rotate-180" : ""}`}
            />
          </button>

          {/* Count */}
          <span className="ml-auto text-xs text-white/35 whitespace-nowrap shrink-0">
            {filtered.length}{" "}
            {filtered.length === 1 ? "result" : "results"}
          </span>
        </div>

        {/* Mobile category dropdown */}
        <AnimatePresence>
          {showMobileFilter && (
            <motion.div
              key="mobile-filter"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-3 max-w-7xl mx-auto lg:hidden">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategory(cat)}
                    className={`category-pill text-xs ${
                      activeCategory === cat ? "category-pill-active" : "category-pill-inactive"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Grid ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div
                key="grid"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((vendor) => (
                    <VendorCard key={vendor.id} vendor={vendor} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center gap-4"
              >
                <div className="text-5xl">⚾</div>
                <h3 className="text-xl font-semibold text-white">No vendors found</h3>
                <p className="text-white/45 max-w-sm">
                  Try adjusting your search or selecting a different category.
                </p>
                <button
                  onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                  className="btn-primary mt-2"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>

        {/* CTA */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 text-center"
          >
            <div className="inline-block glass-card rounded-3xl p-10 max-w-xl">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold text-white mb-2">Are you a member?</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                If you&apos;re a current or retired MLB/MiLB player and want to list your business,
                apply to join the official vendor directory.
              </p>
              <a
                href="/apply"
                id="directory-cta-apply"
                className="btn-primary"
              >
                Apply as a Vendor
              </a>
            </div>
          </motion.div>
        )}
      </section>
    </>
  );
}
