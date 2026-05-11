import type { Metadata } from "next";
import Image from "next/image";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources | MLBMiLB Brotherhood",
  description: "Resources for current and retired MLB & MiLB players.",
};

const resources = [
  {
    title: "BAT — Baseball Assistance Team",
    description:
      "BAT assists eligible members of the professional baseball family who are in need of help. Former players, umpires, minor league personnel, and their dependents.",
    href: "https://www.baseballassistanceteam.com",
    tag: "Player Welfare",
  },
  {
    title: "MLBPA Resources",
    description:
      "The Major League Baseball Players Association provides a range of services and resources to current and former players.",
    href: "https://www.mlbplayers.com",
    tag: "Union",
  },
  {
    title: "MLB.com — Official Site",
    description:
      "The official site of Major League Baseball with scores, standings, stats, and more.",
    href: "https://www.mlb.com",
    tag: "MLB",
  },
  {
    title: "Vendor Application",
    description:
      "Want to offer your business or service to the brotherhood? Apply here to become an official vendor in the directory.",
    href: "/apply",
    tag: "Community",
  },
];

export default function ResourcesPage() {
  return (
    <>
      {/* ── Cinematic header ─────────────────────────────────────── */}
      <header className="relative overflow-hidden">
        <div className="relative h-64 sm:h-72 w-full">
          <Image
            src="/resources.jpeg"
            alt="Resources keyboard shortcut — player tools and links"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-diamond-950/55 via-diamond-950/50 to-diamond-950" />
        </div>

        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-4 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-field-500/20 border border-field-500/30 backdrop-blur-sm mb-4">
            <BookOpen size={28} className="text-field-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Player <span className="gradient-text">Resources</span>
          </h1>
          <p className="mt-3 text-white/55 text-lg max-w-xl">
            Helpful links and organizations for current and former professional players.
          </p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 grid sm:grid-cols-2 gap-5">
        {resources.map((res) => (
          <article key={res.title} className="glass-card rounded-2xl p-6 flex flex-col gap-3">
            <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-field-500/15 text-field-300 border border-field-500/25 w-fit">
              {res.tag}
            </span>
            <h2 className="text-base font-semibold text-white">{res.title}</h2>
            <p className="text-sm text-white/55 leading-relaxed flex-1">{res.description}</p>
            <a
              href={res.href}
              target={res.href.startsWith("http") ? "_blank" : undefined}
              rel={res.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="btn-ghost text-sm mt-2 w-fit"
            >
              Learn More →
            </a>
          </article>
        ))}
      </section>
    </>
  );
}
