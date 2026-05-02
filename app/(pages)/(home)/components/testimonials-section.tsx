"use client";
import React, { useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const testimonials = [
  {
    id: 1,
    quote:
      "He didn't just deliver a website — he delivered a system. Three months later we're still shipping features without touching his scaffolding.",
    name: "Aryan Mehta",
    role: "Founder, Stacklane",
    initials: "AM",
    year: "2024",
    tag: "Full-stack build",
  },
  {
    id: 2,
    quote:
      "The blog infrastructure alone saved us from rewriting everything when we switched CMS. Whoever built this thought three steps ahead.",
    name: "Priya Nair",
    role: "CTO, ContentOS",
    initials: "PN",
    year: "2024",
    tag: "Blog system",
  },
  {
    id: 3,
    quote:
      "Our non-technical team can now manage 5 languages from a dashboard. That was impossible before. Now it just works.",
    name: "Lucas Ferreira",
    role: "Product Lead, Globify",
    initials: "LF",
    year: "2023",
    tag: "i18n system",
  },
  {
    id: 4,
    quote:
      "Migrated our auth from NextAuth to Clerk in a weekend. Zero downtime. I still don't know how.",
    name: "Sara Kim",
    role: "Engineering Manager, Driftly",
    initials: "SK",
    year: "2024",
    tag: "Auth migration",
  },
  {
    id: 5,
    quote:
      "He asks questions nobody else asks before writing a single line. What's the actual problem? That mindset changes everything.",
    name: "Dev Patel",
    role: "CEO, Launchpad Studio",
    initials: "DP",
    year: "2023",
    tag: "Consulting",
  },
];

/* ─────────────────────────────────────────
   Individual card — each has a unique feel
───────────────────────────────────────── */
function TestimonialCard({
  t,
  index,
}: {
  t: (typeof testimonials)[0];
  index: number;
}) {
  // Alternate visual styles so the grid feels editorial, not uniform
  const isAccent = index === 1; // dark card
  const isTall   = index === 2; // extra tall / featured

  return (
    <div
      className={`testimonial-card group relative flex flex-col justify-between rounded-2xl p-7 sm:p-8 transition-all duration-500 cursor-default
        ${isAccent
          ? "bg-neutral-900 text-white"
          : "bg-white border border-neutral-200 text-neutral-900"
        }
        ${isTall ? "row-span-2" : ""}
      `}
      style={{
        boxShadow: isAccent
          ? "0 32px 64px -12px rgba(0,0,0,0.35)"
          : "0 2px 16px -4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Top row: tag + year */}
      <div className="flex items-center gap-10 mb-6">
        <span
          className={`text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border transition-all ${
            isAccent
              ? "border-[#1cf3a1] text-[#1cf3a1]"
              : "border-neutral-200 text-neutral-400 group-hover:border-[#1cf3a1] group-hover:text-[#1cf3a1]"
          }`}
        >
          {t.tag}
        </span>
        <span
          className={`text-[11px] font-mono ${
            isAccent ? "text-neutral-600" : "text-neutral-300"
          }`}
        >
          {t.year}
        </span>
      </div>

      {/* Giant decorative quote mark */}
      <div
        className={`absolute top-6 right-7 font-serif text-[7rem] leading-none select-none pointer-events-none transition-all duration-500 group-hover:scale-110 origin-top-right ${
          isAccent ? "text-neutral-800" : "text-neutral-100"
        }`}
        style={{ fontFamily: "'Georgia', serif", lineHeight: 0.7 }}
        aria-hidden
      >
        &ldquo;
      </div>

      {/* Quote text */}
      <blockquote
        className={`flex-1 text-[1rem] sm:text-[1.05rem] leading-[1.65] font-light z-10 relative ${
          isAccent ? "text-neutral-200" : "text-neutral-700"
        } ${isTall ? "text-[1.1rem] sm:text-[1.2rem]" : ""}`}
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        {t.quote}
      </blockquote>

      {/* Divider */}
      <div
        className={`mt-6 mb-5 h-px ${
          isAccent ? "bg-neutral-800" : "bg-neutral-100"
        }`}
      />

      {/* Author */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-mono font-bold shrink-0 ${
            isAccent
              ? "bg-neutral-800 text-neutral-300"
              : "bg-neutral-900 text-white"
          }`}
        >
          {t.initials}
        </div>
        <div>
          <div
            className={`text-sm font-semibold leading-tight ${
              isAccent ? "text-white" : "text-neutral-900"
            }`}
          >
            {t.name}
          </div>
          <div
            className={`text-[11px] font-mono mt-0.5 ${
              isAccent ? "text-neutral-500" : "text-neutral-400"
            }`}
          >
            {t.role}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main section
───────────────────────────────────────── */
export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Staggered reveal on scroll (IntersectionObserver — no GSAP dep needed)
  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll<HTMLElement>(".testimonial-card");
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity    = "1";
            el.style.transform  = "translateY(0)";
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );

    cards.forEach((card, i) => {
      card.style.opacity    = "0";
      card.style.transform  = "translateY(32px)";
      card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        /* Blueprint grid — matches DisplaySection white panels */
        .testimonials-section {
          background-color: #fefefe;
          background-image:
            linear-gradient(rgba(0,0,0,0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.032) 1px, transparent 1px);
          background-size: 36px 36px;
        }

        /* Subtle lift on hover */
        .testimonial-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 24px 56px -8px rgba(0,0,0,0.14) !important;
        }

        /* Counter label — editorial feel */
        .counter-label {
          font-family: 'Bebas Neue', 'Arial Black', sans-serif;
          font-size: clamp(5rem, 12vw, 9rem);
          line-height: 0.85;
          letter-spacing: -0.03em;
          color: rgba(0,0,0,0.055);
          pointer-events: none;
          user-select: none;
        }

        /* Masonry-style grid */
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: auto;
          gap: 1.25rem;
        }

        /* Card 3 (index 2) spans 2 rows for visual interest */
        .testimonials-grid > *:nth-child(3) {
          grid-row: span 2;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .testimonials-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .testimonials-grid > *:nth-child(3) {
            grid-row: span 1;
          }
        }

        /* Mobile */
        @media (max-width: 640px) {
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="testimonials-section relative px-5 sm:px-10 lg:px-20 py-24 sm:py-32 overflow-hidden"
      >
        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 sm:mb-20">
          <div className="relative">
            {/* Giant background number */}
            <span className="counter-label absolute -top-6 -left-1 select-none" aria-hidden>
              08
            </span>
            {/* Label */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-mono text-neutral-400 tracking-[0.3em] uppercase">
                  What clients say
                </span>
                <div className="h-px w-8 bg-neutral-300" />
                <span className="text-[10px] font-mono text-neutral-300">
                  {testimonials.length} reviews
                </span>
              </div>
              <h2
                className="text-[clamp(2.4rem,6vw,5rem)] font-black leading-[0.92] text-neutral-900"
                style={{ fontFamily: "'Bebas Neue', 'Arial Black', sans-serif" }}
              >
                In Their
                <br />
                <span className="text-neutral-400">Own Words</span>
              </h2>
            </div>
          </div>

          {/* Right side — subtle descriptor */}
          <p className="text-neutral-400 text-sm leading-relaxed max-w-xs font-light sm:text-right">
            Real feedback from founders, CTOs, and product leads I&apos;ve
            worked with across different systems and scales.
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} t={t} index={i} />
          ))}
        </div>

        {/* ── Footer strip ── */}
        <div className="mt-16 sm:mt-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-neutral-100">
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
            All engagements · 2023 – present
          </span>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1l1.545 3.09L12 4.636l-2.5 2.455.59 3.454L7 8.91l-3.09 1.635L4.5 7.09 2 4.636l3.455-.546L7 1z"
                  fill="#171717"
                  fillOpacity="0.85"
                />
              </svg>
            ))}
            <span className="text-[11px] font-mono text-neutral-500 ml-2">4.2 avg across all projects</span>
          </div>
        </div>
      </section>
    </>
  );
}