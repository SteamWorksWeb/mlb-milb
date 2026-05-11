"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Loader2, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";

// ── Phone formatter ────────────────────────────────────────────────────────────
function formatPhone(raw: string): string {
  // Strip everything that isn't a digit
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// ── Field components ───────────────────────────────────────────────────────────
const labelClass = "block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2";
const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-diamond-500/60 focus:bg-white/8 transition-all duration-200";

// ── Categories ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Web & Marketing",
  "Sports & Apparel",
  "Finance & Insurance",
  "Health & Wellness",
  "Real Estate & Mortgage",
  "Technology",
  "Travel & Outdoors",
  "Speaking & Consulting",
  "Other",
];

// ── Form state type ────────────────────────────────────────────────────────────
interface FormData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  category: string;
  website: string;
  description: string;
}

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  businessName: "",
  category: "",
  website: "",
  description: "",
};

// ── Success Card ───────────────────────────────────────────────────────────────
function SuccessCard({ name }: { name: string }) {
  return (
    <div className="glass-card rounded-3xl p-10 sm:p-12 text-center space-y-5 border border-field-500/20">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-field-500/15 border border-field-500/25 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-field-400" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          You&apos;re in the queue, {name.split(" ")[0]}!
        </h2>
        <p className="text-white/55 text-sm leading-relaxed max-w-sm mx-auto">
          Your application has been submitted. Check your inbox — we just sent you
          a confirmation email with the next steps.
        </p>
      </div>
      <div className="pt-2 space-y-3 text-sm text-white/45 text-left max-w-sm mx-auto">
        {[
          "Admin review (a few business days)",
          "$100 BAT donation required upon approval",
          "Your business goes live in the directory",
        ].map((step, i) => (
          <div key={step} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-md bg-field-500/20 text-field-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ApplyPage() {
  const [form, setForm]             = useState<FormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]   = useState(false);
  const [errorMsg, setErrorMsg]     = useState<string | null>(null);

  // Generic field handler
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (errorMsg) setErrorMsg(null);
    },
    [errorMsg]
  );

  // Phone field — format on every keystroke
  const handlePhone = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }));
    if (errorMsg) setErrorMsg(null);
  }, [errorMsg]);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    // Client-side required-field guard
    if (!form.name || !form.email || !form.businessName || !form.category || !form.description) {
      setErrorMsg("Please fill in all required fields before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      setIsSuccess(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Cinematic page header ───────────────────────────────── */}
      <header className="relative overflow-hidden">
        <div className="relative h-80 sm:h-96 w-full">
          <Image
            src="/vendors2.jpeg"
            alt="Baseball players representing the MLBMiLB Brotherhood vendor community"
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
            Become a <span className="gradient-text-gold">Vendor</span>
          </h1>
          <p className="mt-4 text-white/55 text-lg max-w-xl">
            To list your business in the official directory, you must first be approved by the
            group admins and have made a $100 annual donation to BAT.
          </p>
        </div>
      </header>

      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-6">

        {/* ── Application form or success card ─────────────────── */}
        {isSuccess ? (
          <SuccessCard name={form.name} />
        ) : (
          <div className="glass-card rounded-3xl p-8 sm:p-10">
            <h2 className="text-xl font-bold text-white mb-1">Vendor Application</h2>
            <p className="text-sm text-white/45 mb-8 leading-relaxed">
              Fill out the form below. All fields marked <span className="text-rose-400">*</span> are required.
            </p>

            {/* Error banner */}
            {errorMsg && (
              <div className="flex items-start gap-3 mb-6 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Row 1 — Name + Email */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="apply-name" className={labelClass}>
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="apply-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Smith"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClass}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="apply-email" className={labelClass}>
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="apply-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              {/* Row 2 — Phone + Business Name */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="apply-phone" className={labelClass}>
                    Phone Number
                  </label>
                  <input
                    id="apply-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="(555) 000-0000"
                    value={form.phone}
                    onChange={handlePhone}
                    className={inputClass}
                    disabled={isSubmitting}
                    maxLength={14}
                  />
                </div>
                <div>
                  <label htmlFor="apply-business" className={labelClass}>
                    Business Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="apply-business"
                    name="businessName"
                    type="text"
                    placeholder="Acme Baseball Co."
                    value={form.businessName}
                    onChange={handleChange}
                    className={inputClass}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              {/* Row 3 — Category + Website */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="apply-category" className={labelClass}>
                    Business Category <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="apply-category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                      disabled={isSubmitting}
                      required
                    >
                      <option value="" disabled className="bg-diamond-950">
                        Select a category…
                      </option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-diamond-950">
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="apply-website" className={labelClass}>
                    Website URL
                  </label>
                  <input
                    id="apply-website"
                    name="website"
                    type="url"
                    autoComplete="url"
                    placeholder="https://yourbusiness.com"
                    value={form.website}
                    onChange={handleChange}
                    className={inputClass}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Row 4 — Description */}
              <div>
                <label htmlFor="apply-description" className={labelClass}>
                  Business Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="apply-description"
                  name="description"
                  rows={4}
                  placeholder="Tell us what your business offers and why it's a great fit for the brotherhood…"
                  value={form.description}
                  onChange={handleChange}
                  className={`${inputClass} resize-none leading-relaxed`}
                  disabled={isSubmitting}
                  required
                />
                <p className="mt-1.5 text-xs text-white/25">
                  {form.description.length}/500 characters
                </p>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  id="apply-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Application →"
                  )}
                </button>
                <p className="text-xs text-white/25 text-center mt-3">
                  By submitting, you confirm you have played at least one inning or at-bat in MLB/MiLB affiliated baseball.
                </p>
              </div>
            </form>
          </div>
        )}

        {/* ── BAT requirement card with image ──────────────────── */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="relative h-44 w-full">
            <Image
              src="/BAT.jpg"
              alt="Baseball Assistance Team — required $100 annual donation for vendors"
              fill
              className="object-cover object-center"
              sizes="(max-width: 672px) 100vw, 672px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-diamond-950/95 via-diamond-950/50 to-transparent" />
          </div>
          <div className="p-6 -mt-8 relative z-10">
            <h2 className="text-base font-bold text-white mb-1.5">
              Required: $100 BAT Donation
            </h2>
            <p className="text-sm text-white/55 leading-relaxed mb-4">
              All vendors must make an annual $100 donation to the Baseball Assistance Team.
              BAT helps players and baseball family members in financial need.
            </p>
            <a
              href="https://www.baseballassistanceteam.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-sm"
            >
              Donate to BAT →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
