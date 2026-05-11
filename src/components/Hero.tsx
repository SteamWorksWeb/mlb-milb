"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, Shield, Star } from "lucide-react";

interface HeroProps {
  totalVendors: number;
}

const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 5,
  duration: 3 + Math.random() * 4,
}));

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};

export default function Hero({ totalVendors }: HeroProps) {
  return (
    <section
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      aria-label="Hero — MLBMiLB Brotherhood Directory"
    >
      {/* ── Full-bleed hero photo (LCP-optimised) ── */}
      <div className="absolute inset-0">
        <Image
          src="/facebook hero.jpg"
          alt="Baseball close-up with MLBMiLB emblem"
          fill
          className="object-cover object-center"
          priority
          quality={85}
          sizes="100vw"
        />
        {/* Dark overlay gradient so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-diamond-950/80 via-diamond-950/65 to-diamond-950" />
      </div>

      {/* Radial glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-diamond-600/15 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gold-500/10 blur-[100px] pointer-events-none" />

      {/* Starfield (layered on top of photo for depth) */}
      {STARS.map((star) => (
        <span
          key={star.id}
          className="star pointer-events-none"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Badge */}
          <motion.div variants={item} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-diamond-500/20 border border-diamond-400/30 text-diamond-200 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-field-400 animate-pulse" />
              Official Vendor Directory — Verified Brotherhood Members
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight"
          >
            The{" "}
            <span className="text-white">Brotherhood</span>
            <br />
            Business Network
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={item}
            className="mt-6 text-lg sm:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed"
          >
            Connecting current &amp; retired MLB and MiLB players with{" "}
            <strong className="text-white/90 font-semibold">
              {totalVendors} trusted businesses
            </strong>{" "}
            built by people who know the game.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              id="hero-browse-directory"
              href="/directory"
              className="btn-primary text-base px-8 py-4 rounded-2xl shadow-xl shadow-diamond-500/30"
            >
              Browse the Directory
              <ArrowRight size={18} />
            </Link>
            <Link
              id="hero-become-vendor"
              href="/apply"
              className="btn-ghost text-base px-8 py-4 rounded-2xl"
            >
              Become a Vendor
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={item}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/50"
          >
            {[
              { icon: <Users size={16} />, label: "Former Pro Players Only" },
              { icon: <Shield size={16} />, label: "Vetted & Approved" },
              { icon: <Star size={16} />, label: "Brotherhood Trusted" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <span className="text-diamond-400">{icon}</span>
                {label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-diamond-950 to-transparent pointer-events-none" />
    </section>
  );
}
