import Link from "next/link";
import { Users2, ExternalLink } from "lucide-react";

const footerLinks = [
  {
    title: "Directory",
    links: [
      { label: "All Vendors", href: "/directory" },
      { label: "Sports & Apparel", href: "/directory?category=Sports+%26+Apparel" },
      { label: "Finance & Insurance", href: "/directory?category=Finance+%26+Insurance" },
      { label: "Health & Wellness", href: "/directory?category=Health+%26+Wellness" },
      { label: "Real Estate", href: "/directory?category=Real+Estate+%26+Mortgage" },
      { label: "Technology", href: "/directory?category=Technology" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Deals", href: "/deals" },
      { label: "Resources", href: "/resources" },
      { label: "Group Rules", href: "/rules" },
      { label: "Become a Vendor", href: "/apply" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black/40 border-t border-white/[0.06] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-diamond-400 to-diamond-600 flex items-center justify-center text-lg shadow-lg shadow-diamond-500/30">
                ⚾
              </div>
              <span className="text-white font-bold text-xl">
                MLB<span className="text-diamond-400">MiLB</span>
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              The official business directory for the Current &amp; Retired MLB &amp; MiLB Players Facebook Group.
            </p>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-diamond-400 transition-colors"
              aria-label="Join the Facebook Group"
            >
              <Users2 size={16} />
              Join the Brotherhood
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Nav groups */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {year} MLBMiLB Brotherhood. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Site by{" "}
            <a
              href="https://steamworks.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/50 transition-colors"
            >
              SteamWorks Digital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
