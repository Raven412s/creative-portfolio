"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────
   Panel data
───────────────────────────────────────── */
const panels = [
  { id: "intro",   type: "intro" },
  { id: "blog",    type: "blog",    tags: ["Reusable", "Client-ready", "Modular"] },
  { id: "auth",    type: "auth",    tags: ["Decoupled", "Migratable", "Production-tested"] },
  { id: "starter", type: "starter", tags: ["Zero setup friction", "Opinionated", "Ship-ready"] },
  { id: "locale",  type: "locale",  tags: ["Client-controlled", "DB-driven", "i18n-native"] },
  { id: "complib", type: "complib", tags: ["Built", "Learned", "Dropped"] },
  { id: "closing", type: "closing" },
];

/* ─────────────────────────────────────────
   Helper: PanelLabel
───────────────────────────────────────── */
function PanelLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-[10px] font-mono text-neutral-400">{index}</span>
      <div className="h-px w-6 bg-neutral-300" />
      <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Helper: TagRow
───────────────────────────────────────── */
function TagRow({ tags, highlight }: { tags: string[]; highlight?: number }) {
  return (
    <div className="flex gap-2 mt-5 flex-wrap">
      {tags.map((t, i) => (
        <span
          key={t}
          className={`text-[10px] font-mono px-3 py-1 rounded-full border transition-all ${
            i === highlight
              ? "bg-neutral-900 text-white border-neutral-900"
              : "bg-white text-neutral-500 border-neutral-200"
          }`}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Panel 1 — Intro  (DARK, full-width)
───────────────────────────────────────── */
function IntroPanel() {
  return (
    <div className="panel-inner flex flex-col justify-center h-full w-full px-8 sm:px-16 lg:px-24 max-w-5xl">
      <span className="text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-neutral-500 mb-6 sm:mb-8 font-mono">
        Architecture · Infrastructure · Systems
      </span>
      <h2
        className="text-[clamp(4rem,11vw,8rem)] font-black leading-[0.88] text-white mb-6 sm:mb-8"
        style={{ fontFamily: "'Bebas Neue', 'Arial Black', sans-serif" }}
      >
        Systems
        <br />
        <span className="text-neutral-500">I Build</span>
      </h2>
      <p className="text-base sm:text-lg lg:text-xl text-neutral-400 leading-relaxed max-w-xl font-light">
        I don&apos;t just build interfaces. I build systems that make building{" "}
        <em className="text-white not-italic font-semibold">faster</em>,{" "}
        <em className="text-white not-italic font-semibold">scalable</em>, and{" "}
        <em className="text-white not-italic font-semibold">repeatable</em>.
      </p>
      <div className="mt-10 sm:mt-14 flex items-center gap-3 text-neutral-500 text-sm font-mono">
        <span className="hidden sm:inline">scroll to explore</span>
        <span className="sm:hidden">scroll to explore</span>
        <svg width="40" height="8" viewBox="0 0 40 8" fill="none" className="arrow-pulse">
          <path d="M0 4h36M33 1l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Panel 2 — Blog
───────────────────────────────────────── */
function BlogPanel({ tags }: { tags: string[] }) {
  return (
    <div className="panel-inner flex flex-col justify-center h-full px-6 sm:px-12 lg:px-16 w-full">
      <PanelLabel index="02" label="Blog Infrastructure" />
      <h3 className="panel-title">
        Rich Text,
        <br />
        Owned End-to-End
      </h3>
      <div className="mt-5 rounded-xl border border-neutral-200 overflow-hidden shadow-sm bg-white">
        <div className="flex items-center gap-1 px-3 py-2 border-b border-neutral-100 bg-neutral-50 flex-wrap">
          {["B", "I", "U", "H1", "H2", "¶", "⌘"].map((t) => (
            <button key={t} className="w-7 h-7 rounded text-xs font-mono text-neutral-500 hover:bg-neutral-200 hover:text-neutral-800 transition-colors">
              {t}
            </button>
          ))}
          <div className="w-px h-4 bg-neutral-200 mx-1" />
          <button className="px-2 h-7 rounded text-xs font-mono text-neutral-500 hover:bg-neutral-200 transition-colors">Link</button>
          <button className="px-2 h-7 rounded text-xs font-mono text-neutral-500 hover:bg-neutral-200 transition-colors">Image</button>
        </div>
        <div className="p-4 space-y-2">
          <div className="h-5 w-3/4 bg-neutral-900 rounded-sm opacity-90" />
          <div className="h-3 w-full bg-neutral-200 rounded-sm" />
          <div className="h-3 w-5/6 bg-neutral-200 rounded-sm" />
          <div className="h-3 w-4/5 bg-neutral-200 rounded-sm" />
          <div className="flex gap-2 pt-2 flex-wrap">
            {["Tag: React", "Tag: GSAP", "Tag: Next.js"].map((t) => (
              <span key={t} className="text-[10px] px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded-full text-neutral-500 font-mono">{t}</span>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 text-neutral-500 text-sm leading-relaxed max-w-sm">
        A portable blog engine — TipTap editor, MDX rendering, category trees — reused across 4+ client projects without rewriting core logic.
      </p>
      <TagRow tags={tags} />
    </div>
  );
}

/* ─────────────────────────────────────────
   Panel 3 — Auth
───────────────────────────────────────── */
function AuthPanel({ tags }: { tags: string[] }) {
  return (
    <div className="panel-inner flex flex-col justify-center h-full px-6 sm:px-12 lg:px-16 w-full">
      <PanelLabel index="03" label="Auth System Evolution" />
      <h3 className="panel-title">
        Migrated Without
        <br />
        Breaking a Thing
      </h3>
      <div className="mt-5 relative">
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-neutral-800 bg-white flex items-center justify-center shadow-sm">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-neutral-800 text-center leading-tight">Next<br />Auth</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 mt-1">v1</span>
          </div>
          <div className="flex-1 flex flex-col items-center px-2 sm:px-3">
            <div className="h-px w-full bg-gradient-to-r from-neutral-800 to-neutral-300 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-r-2 border-t-2 border-neutral-400 rotate-45" />
            </div>
            <span className="text-[8px] sm:text-[9px] font-mono text-neutral-400 mt-1 text-center">abstracted adapters</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-neutral-800 bg-neutral-900 flex items-center justify-center shadow-md">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-white">Clerk</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 mt-1">v2</span>
          </div>
          <div className="flex-1 flex flex-col items-center px-2 sm:px-3">
            <div className="h-px w-full bg-gradient-to-r from-neutral-300 to-neutral-200" />
            <span className="text-[8px] sm:text-[9px] font-mono text-neutral-300 mt-1">future-proof</span>
          </div>
          <div className="flex flex-col items-center opacity-40">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-dashed border-neutral-400 bg-white flex items-center justify-center">
              <span className="text-[10px] font-mono text-neutral-400">?</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-300 mt-1">next</span>
          </div>
        </div>
        <div className="mt-5 p-3 sm:p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Key Lesson</span>
          <p className="text-sm text-neutral-700 mt-1 font-medium leading-relaxed">
            &ldquo;Avoid tight coupling with frameworks. Abstract your auth layer so swapping providers is a config change, not a rewrite.&rdquo;
          </p>
        </div>
      </div>
      <TagRow tags={tags} />
    </div>
  );
}

/* ─────────────────────────────────────────
   Panel 4 — Starter Kit
───────────────────────────────────────── */
function StarterPanel({ tags }: { tags: string[] }) {
  const lines = [
    { indent: 0, text: "my-app/", type: "dir" },
    { indent: 1, text: "app/", type: "dir" },
    { indent: 2, text: "layout.tsx", type: "file" },
    { indent: 2, text: "page.tsx", type: "file" },
    { indent: 1, text: "components/", type: "dir" },
    { indent: 2, text: "ui/", type: "dir" },
    { indent: 1, text: "lib/", type: "dir" },
    { indent: 2, text: "db.ts", type: "file" },
    { indent: 2, text: "auth.ts", type: "file" },
    { indent: 1, text: ".env.example", type: "file" },
    { indent: 1, text: "next.config.ts", type: "file" },
  ];
  return (
    <div className="panel-inner flex flex-col justify-center h-full px-6 sm:px-12 lg:px-16 w-full">
      <PanelLabel index="04" label="Next.js Starter Kit" />
      <h3 className="panel-title">
        From Zero to
        <br />
        Ship-Ready
      </h3>
      <div className="mt-5 bg-neutral-900 rounded-xl overflow-hidden shadow-lg border border-neutral-800">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-800">
          <span className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" />
          <span className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
          <span className="ml-3 text-[11px] font-mono text-neutral-500">~/projects</span>
        </div>
        <div className="p-3 sm:p-4 space-y-0.5">
          <div className="text-green-400 font-mono text-xs mb-2">
            <span className="text-neutral-500">$ </span>npx create-next-kit my-app
          </div>
          {lines.map((l, i) => (
            <div key={i} className="font-mono text-[11px] flex items-center" style={{ paddingLeft: `${l.indent * 14}px` }}>
              {l.indent > 0 && <span className="text-neutral-700 mr-1">{l.indent === 1 ? "├─" : "│ ├─"}</span>}
              <span className={l.type === "dir" ? "text-blue-400" : "text-neutral-400"}>{l.text}</span>
            </div>
          ))}
          <div className="text-green-400 font-mono text-xs mt-3 flex items-center gap-1">
            <span className="animate-pulse">▸</span> Ready in 2.1s
          </div>
        </div>
      </div>
      <p className="mt-4 text-neutral-500 text-sm max-w-sm leading-relaxed">
        Auth, DB, env config, CI/CD, folder conventions — all wired. Clone and ship, not configure.
      </p>
      <TagRow tags={tags} />
    </div>
  );
}

/* ─────────────────────────────────────────
   Panel 5 — Locale Manager
───────────────────────────────────────── */
function LocalePanel({ tags }: { tags: string[] }) {
  const langs = ["EN", "FR", "AR", "DE", "HI"];
  return (
    <div className="panel-inner flex flex-col justify-center h-full px-6 sm:px-12 lg:px-16 w-full">
      <PanelLabel index="05" label="Locale Manager" />
      <h3 className="panel-title">
        Client Controls
        <br />
        Their Words
      </h3>
      <div className="mt-5 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-100 bg-neutral-50">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-[11px] font-mono text-neutral-500">locale-manager.dashboard</span>
        </div>
        <div className="p-3 sm:p-4">
          <div className="flex gap-2 mb-4 flex-wrap">
            {langs.map((l, i) => (
              <button key={l} className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${i === 0 ? "bg-neutral-900 text-white shadow" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"}`}>
                {l}
              </button>
            ))}
            <button className="px-3 py-1 rounded-full text-xs font-mono bg-neutral-100 text-neutral-400 border border-dashed border-neutral-300">+ Add</button>
          </div>
          <div className="space-y-2">
            {[["hero.title", "Welcome to our platform"], ["cta.primary", "Get started for free"], ["nav.about", "About us"]].map(([key, val]) => (
              <div key={key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors group">
                <span className="font-mono text-[10px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded shrink-0">{key}</span>
                <span className="text-sm text-neutral-700 flex-1 truncate">{val}</span>
                <span className="text-[10px] text-neutral-300 font-mono group-hover:text-neutral-500 transition-colors cursor-pointer shrink-0">edit</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 text-[10px] font-mono text-neutral-400">
            Source: PostgreSQL · Cached: Redis · CDN &lt;200ms
          </div>
        </div>
      </div>
      <p className="mt-4 text-neutral-500 text-sm max-w-sm leading-relaxed">
        DB-driven i18n. Clients edit copy from a dashboard. No dev needed for content updates.
      </p>
      <TagRow tags={tags} highlight={0} />
    </div>
  );
}

/* ─────────────────────────────────────────
   Panel 6 — Component Library
───────────────────────────────────────── */
function CompLibPanel({ tags }: { tags: string[] }) {
  const components = [
    { name: "Button",   done: true },
    { name: "Input",    done: true },
    { name: "Modal",    done: true },
    { name: "DataGrid", done: false },
    { name: "Chart",    done: false },
    { name: "Calendar", done: false },
  ];
  return (
    <div className="panel-inner flex flex-col justify-center h-full px-6 sm:px-12 lg:px-16 w-full">
      <PanelLabel index="06" label="Component Library" />
      <h3 className="panel-title">
        Built, Learned,
        <br />
        Dropped
      </h3>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {components.map((c) => (
          <div key={c.name} className={`p-2 sm:p-3 rounded-lg border transition-all ${c.done ? "border-neutral-800 bg-white" : "border-dashed border-neutral-300 bg-neutral-50 opacity-60"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-mono text-neutral-600">{c.name}</span>
              <span className={`w-2 h-2 rounded-full ${c.done ? "bg-neutral-800" : "bg-neutral-300"}`} />
            </div>
            <div className="space-y-1">
              <div className={`h-2 rounded-sm ${c.done ? "bg-neutral-200" : "bg-neutral-100"}`} style={{ width: `${c.done ? 80 : 45}%` }} />
              <div className={`h-2 rounded-sm ${c.done ? "bg-neutral-100" : "bg-neutral-50"}`} style={{ width: `${c.done ? 60 : 30}%` }} />
            </div>
            {!c.done && <div className="mt-2 text-[9px] font-mono text-neutral-400">abandoned</div>}
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 sm:p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
        <p className="text-sm text-neutral-600 leading-relaxed">
          <span className="font-semibold text-neutral-900">Honest note:</span>{" "}
          Scope crept. Accessibility was hard. I learned more from abandoning this than shipping it.
        </p>
      </div>
      <TagRow tags={tags} />
    </div>
  );
}

/* ─────────────────────────────────────────
   Panel 7 — Closing
───────────────────────────────────────── */
function ClosingPanel() {
  return (
    <div className="panel-inner flex flex-col justify-center items-start h-full px-8 sm:px-16 lg:px-20 w-full max-w-3xl">
      <PanelLabel index="07" label="Reflection" />
      <blockquote
        className="text-[clamp(1.5rem,3vw,2.8rem)] font-light text-neutral-800 leading-snug mt-4"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        &ldquo;Most of these tools were never meant to be showcased.{" "}
        <em>They were built to solve real problems.</em>&rdquo;
      </blockquote>
      <p className="mt-6 sm:mt-8 text-neutral-500 text-base max-w-md leading-relaxed">
        The best infrastructure is the kind nobody notices — until it&apos;s missing.
      </p>
      <div className="mt-10 sm:mt-12 h-px w-24 bg-neutral-800" />
      <span className="mt-4 text-xs font-mono text-neutral-400 tracking-widest uppercase">End of scroll</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Panel renderer
───────────────────────────────────────── */
function renderPanel(p: (typeof panels)[0]) {
  switch (p.type) {
    case "intro":   return <IntroPanel />;
    case "blog":    return <BlogPanel tags={p.tags!} />;
    case "auth":    return <AuthPanel tags={p.tags!} />;
    case "starter": return <StarterPanel tags={p.tags!} />;
    case "locale":  return <LocalePanel tags={p.tags!} />;
    case "complib": return <CompLibPanel tags={p.tags!} />;
    case "closing": return <ClosingPanel />;
    default:        return null;
  }
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export function DisplaySection() {
  const sectionRef     = useRef<HTMLElement>(null);
  const trackRef       = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const section = sectionRef.current;
    const track   = trackRef.current;
    const bar     = progressBarRef.current;
    if (!section || !track) return;

    // ── BG: dark (#0a0a0a) → white (#fefefe) as intro panel scrolls away ──
    // Exactly like your reference snippet: starts at "top 50%" → "top top"
    gsap.set(section, { backgroundColor: "#0a0a0a" });
    gsap.to(section, {
      backgroundColor: "#fefefe",
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 50%",   // section enters viewport halfway
        end: "top top",     // complete by the time section top = viewport top
        scrub: true,
      },
    });

    if (isMobile) return; // mobile uses vertical CSS layout, no GSAP pin

    // ── Horizontal scroll (desktop only) ────────────────────────────────
    const totalWidth = track.scrollWidth - window.innerWidth;

    gsap.to(track, {
      x: () => -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${totalWidth}`,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (bar) bar.style.width = `${self.progress * 100}%`;
        },
      },
    });

    // ── Panel hover lifts (desktop) ──────────────────────────────────────
    const cards = document.querySelectorAll<HTMLElement>(".panel-card:not(.intro-card)");
    const listeners: Array<{ el: HTMLElement; enter: () => void; leave: () => void }> = [];
    cards.forEach((card) => {
      const enter = () => gsap.to(card, { y: -4, duration: 0.25, ease: "power2.out" });
      const leave = () => gsap.to(card, { y:  0, duration: 0.30, ease: "power2.inOut" });
      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);
      listeners.push({ el: card, enter, leave });
    });

    return () => {
      ScrollTrigger.killAll();
      listeners.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  const PANEL_W    = 820;
  const otherCount = panels.length - 1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        .panel-title {
          font-size: clamp(1.6rem, 3.2vw, 2.6rem);
          font-weight: 800;
          line-height: 1.05;
          color: #171717;
          letter-spacing: -0.02em;
          margin-top: 0.4rem;
        }

        /* White panels share this blueprint grid bg */
        .blueprint-bg {
          background-color: #fefefe;
          background-image:
            linear-gradient(rgba(0,0,0,0.038) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.038) 1px, transparent 1px);
          background-size: 36px 36px;
        }

        /* Dark intro panel — pure dark, slight noise */
        .intro-panel-bg {
          background-color: #0a0a0a;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
        }

        /* Panel hover */
        .panel-card { will-change: transform; transition: box-shadow 0.25s ease; }
        .panel-card:hover { box-shadow: 0 20px 60px -10px rgba(0,0,0,0.1); }

        /* Arrow animation */
        .arrow-pulse { animation: arrowPulse 2s ease-in-out infinite; }
        @keyframes arrowPulse {
          0%, 100% { transform: translateX(0); opacity: 0.5; }
          50%       { transform: translateX(7px); opacity: 1; }
        }

        /* ── Slide number watermark ── */
        .slide-number {
          font-family: 'Bebas Neue', 'Arial Black', sans-serif;
          font-size: 7rem;
          font-weight: 900;
          line-height: 1;
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          pointer-events: none;
          user-select: none;
          letter-spacing: -0.02em;
        }
        /* On dark intro: barely visible white */
        .slide-number-dark  { color: rgba(255,255,255,0.08); }
        /* On white panels: slightly more visible than before, 
           enough to read, not enough to compete with content */
        .slide-number-light { color: rgba(0,0,0,0.09); }

        /* ── MOBILE: vertical stacked layout ── */
        @media (max-width: 767px) {
          .horizontal-track {
            flex-direction: column !important;
            width: 100% !important;
            transform: none !important;
          }
          .panel-card {
            width: 100% !important;
            min-height: auto !important;
            border-right: none !important;
            border-bottom: 1px solid #f0f0f0;
          }
          .intro-card {
            min-height: 100svh !important;
          }
          .panel-card:not(.intro-card) {
            padding-top: 3.5rem;
            padding-bottom: 4rem;
          }
          .slide-number {
            font-size: 4.5rem !important;
            bottom: 0.75rem !important;
            right: 0.75rem !important;
          }
          .systems-section {
            height: auto !important;
          }
        }
      `}</style>

      {/* Progress bar — desktop only */}
      <div
        className="fixed top-0 left-0 w-full h-[2px] z-50 bg-neutral-100 hidden md:block"
        style={{ pointerEvents: "none" }}
      >
        <div
          ref={progressBarRef}
          className="h-full bg-white transition-none"
          style={{ width: "0%", willChange: "width" }}
        />
      </div>

      <section
        ref={sectionRef}
        className="systems-section relative overflow-hidden"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <div
          ref={trackRef}
          className="horizontal-track flex items-stretch"
          style={{
            width: `calc(100vw + ${otherCount * PANEL_W}px)`,
            minHeight: "100vh",
            willChange: "transform",
          }}
        >
          {panels.map((p, i) => {
            const isIntro = p.type === "intro";
            return (
              <div
                key={p.id}
                data-panel-type={p.type}
                className={`panel-card flex-shrink-0 flex items-center relative border-r border-neutral-100 last:border-r-0 ${
                  isIntro ? "intro-card intro-panel-bg" : "blueprint-bg"
                }`}
                style={{
                  width: isIntro ? "100vw" : `${PANEL_W}px`,
                  minHeight: "100vh",
                }}
              >
                {/* Slide number watermark */}
                <span className={`slide-number ${isIntro ? "slide-number-dark" : "slide-number-light"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                {renderPanel(p)}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}