import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Group Rules",
  description:
    "Community guidelines for the MLB & MiLB Current and Retired Pro Baseball Players Facebook Group.",
};

const rules = [
  {
    number: 1,
    title: "No Personal Attacks",
    body: "Any personal attacks will be removed. Depending on the severity, you may be removed from the group.",
  },
  {
    number: 2,
    title: "Respect for Other Members",
    body: "Disrespectful content will be removed. Bullying and degrading comments about race, religion, culture, or sexual orientation are not tolerated.",
  },
  {
    number: 3,
    title: "Wives, Girlfriends & Kids are Off-Limits",
    body: "No disparaging or sexual remarks directed at any wives, children, or girlfriends. Any infraction may result in an immediate ban.",
  },
  {
    number: 4,
    title: "Respect Everyone's Privacy",
    body: "What's shared in the group stays in the group. Screen captures shared outside the group may result in removal.",
  },
  {
    number: 5,
    title: "No Politics",
    body: "No federal-level political posts. No politically motivated posts or degrading comments about race, religion, culture, gender, or identity.",
  },
  {
    number: 6,
    title: "Membership is a Privilege",
    body: "Playing pro baseball doesn't guarantee a right to be in the group. Constant issues or multiple complaints may result in removal without warning.",
  },
  {
    number: 7,
    title: "Commercial Posts Require Approval",
    body: "To post commercially, email info@steamworks.io with your business info. If approved, you must make a $100 annual donation to BAT and provide the receipt.",
  },
  {
    number: 8,
    title: "Group Management Responsibility",
    body: "Facebook Terms of Service prevail. Admins and moderators are not responsible for anything said or done inside or outside the group.",
  },
  {
    number: 9,
    title: "Membership Requirements",
    body: "Members must have played at least one inning or one at-bat in MLB/MiLB affiliated baseball. All member requests must complete the form satisfactorily.",
  },
  {
    number: 10,
    title: "Three Strikes Policy",
    body: "Generally three strikes and you're out. Each rule-breaking post is a strike. Severe behavior may result in immediate removal.",
  },
];

export default function RulesPage() {
  return (
    <>
      {/* ── Cinematic header ─────────────────────────────────────── */}
      <header className="relative overflow-hidden">
        <div className="relative h-64 sm:h-72 w-full">
          <Image
            src="/rules.jpeg"
            alt="Gavel representing group rules and governance"
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
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Community <span className="gradient-text">Rules</span>
          </h1>
          <p className="mt-3 text-white/55 text-lg max-w-xl">
            Guidelines that keep the brotherhood strong, respectful, and thriving.
          </p>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 space-y-4">
        {rules.map((rule) => (
          <article
            key={rule.number}
            className="glass-card rounded-2xl p-6 flex gap-5"
          >
            <div className="w-10 h-10 rounded-xl bg-diamond-500/20 text-diamond-300 flex items-center justify-center font-bold text-sm shrink-0">
              {rule.number}
            </div>
            <div>
              <h2 className="text-base font-semibold text-white mb-1.5">{rule.title}</h2>
              <p className="text-sm text-white/55 leading-relaxed">{rule.body}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
