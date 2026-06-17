import type { Metadata } from "next";
import Image from "next/image";

interface Deal {
  id: number;
  brand: string;
  discount: string;
  description: string;
  action: { label: string; href: string };
  contact: string | null;
  image: string | null;
  imageAlt: string | null;
}

export const metadata: Metadata = {
  title: "Exclusive Deals",
  description:
    "Pro baseball player discounts and exclusive deals available to MLB & MiLB brotherhood members.",
};

const deals: Deal[] = [
  {
    id: 1,
    brand: "Bajio Sunglasses",
    discount: "Up to $110 off",
    description:
      "Tell them you're a member of the MLB + MiLB Current and Retired Pro Baseball Players group. Go to the website, find the frame and lens color you want first, then email your request.",
    action: { label: "Visit Bajio", href: "https://bajiosunglasses.com" },
    contact: "melinda@bajiosunglasses.com",
    image: "/bajio.jpg",
    imageAlt: "Bajio polarized sunglasses held up against ocean backdrop",
  },
  {
    id: 2,
    brand: "CORT Furniture Rental",
    discount: "20% Discount",
    description:
      "Whether you're mid-season, switching teams, or relocating, CORT provides high-quality furnishings for athletes. Focus on your career while they handle every detail — delivery, setup, and pickup.",
    action: { label: "Visit CORT", href: "https://www.cort.com/athlete" },
    contact: null,
    image: null,
    imageAlt: null,
  },
  {
    id: 3,
    brand: "YouthFuel Services",
    discount: "20% Off First Order",
    description:
      "Tailored treatment plans for everybody — TRT, GLP-1 weight loss, peptide therapy, and sexual health solutions.",
    action: { label: "Visit YouthFuel", href: "http://www.youth-fuel.com" },
    contact: null,
    image: null,
    imageAlt: null,
  },
];

export default function DealsPage() {
  return (
    <>
      {/* ── Cinematic page header ───────────────────────────────── */}
      <header className="relative overflow-hidden">
        <div className="relative h-64 sm:h-72 w-full">
          <Image
            src="/bg hero 2 copy.jpg"
            alt="Baseball stadium with vibrant lighting — Brotherhood Deals"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-diamond-950/60 via-diamond-950/50 to-diamond-950" />
        </div>

        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Brotherhood <span className="gradient-text-gold">Deals</span>
          </h1>
          <p className="mt-4 text-white/55 text-lg max-w-xl">
            Pro baseball player discounts and exclusive offers — only for the brotherhood.
          </p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-6">
        {deals.map((deal) => (
          <article
            key={deal.id}
            className="glass-card rounded-2xl overflow-hidden flex flex-col sm:flex-row"
          >
            {/* Deal image (if present) */}
            {deal.image && (
              <div className="relative w-full sm:w-56 h-52 sm:h-auto shrink-0">
                <Image
                  src={deal.image}
                  alt={deal.imageAlt ?? deal.brand}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, 224px"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-diamond-950/60 sm:block hidden" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-diamond-950/70 sm:hidden" />
              </div>
            )}

            {/* Deal content */}
            <div className="flex flex-col sm:flex-row flex-1 gap-6 p-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-xl font-bold text-white">{deal.brand}</h2>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/15 text-gold-300 border border-gold-500/25">
                    {deal.discount}
                  </span>
                </div>
                <p className="text-white/60 leading-relaxed text-sm">{deal.description}</p>
                {deal.contact && (
                  <p className="mt-3 text-xs text-white/40">
                    Contact:{" "}
                    <a
                      href={`mailto:${deal.contact}`}
                      className="text-diamond-400 hover:underline"
                    >
                      {deal.contact}
                    </a>
                  </p>
                )}
              </div>
              <div className="shrink-0 flex sm:flex-col items-start sm:items-end gap-3">
                <a
                  href={deal.action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm whitespace-nowrap"
                >
                  {deal.action.label} →
                </a>
              </div>
            </div>
          </article>
        ))}

        {/* BAT donation callout */}
        <div className="glass-card rounded-2xl overflow-hidden flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-56 h-44 sm:h-auto shrink-0">
            <Image
              src="/BAT.jpg"
              alt="Baseball Assistance Team — BAT organization logo"
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, 224px"
            />
          </div>
          <div className="flex-1 p-8 flex flex-col justify-center gap-3">
            <h2 className="text-lg font-bold text-white">Baseball Assistance Team (BAT)</h2>
            <p className="text-sm text-white/55 leading-relaxed">
              All vendor applicants must make a <strong className="text-white/80">$250 one-time donation</strong> to BAT
              before being listed in the directory. BAT supports players and baseball family members in need.
            </p>
            <a
              href="https://www.baseballassistanceteam.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-sm w-fit"
            >
              Learn about BAT →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
