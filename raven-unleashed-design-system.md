# Raven Unleashed — Design System
### Lead Product Designer spec · pre-code · v1

---

## 0. Brand Thesis (everything below derives from this)

Luke Baffait's site wins on pure visual/motion craft. Yours shouldn't try to win the same fight — your actual evidence (auth migrations, a portable blog engine, DB-driven i18n, a starter kit, an honestly-abandoned component library) proves something Luke's doesn't: **you build infrastructure that outlives the project, and you're honest about what didn't work.**

Positioning: **a systems-minded creative developer** — not "I make pretty interfaces," but "I make interfaces *and* the scaffolding underneath them, and I'll tell you when something failed." The "Systems I Build" scrollytelling section already does this — it's your signature, not an extra section. Everything in this system protects and amplifies it instead of competing with it for attention.

One critical, non-stylistic fix before any of this matters: the hero terminal block currently outputs `pranav · full-stack dev` and `hi@pranav.dev` instead of your name and email. That's a leftover from a template and it's the single most trust-damaging thing on the page right now — a recruiter who notices it stops reading. Fix this first, independent of the redesign.

---

## 1. Color System

Monochrome base, one accent, used the way Luke uses his negative space — sparingly enough that it still means something every time it appears.

| Token | Value | Role |
|---|---|---|
| `ink` | `#0B0D10` | Primary background. Slightly blue-black, not pure black — reads as "circuit board at night," not "default dark mode." |
| `ink-raised` | `#14171B` | Card / terminal-panel surface, one step up from base for layering without introducing a new hue. |
| `hairline` | `rgba(236,238,241,0.08)` | All dividers, panel borders, grid rules. Never a filled border — hairlines only. |
| `foreground` | `#ECEEF1` | Primary text. Soft white, not `#FFFFFF` — less glare against `ink`, reads more editorial than "UI white." |
| `foreground-muted` | `rgba(236,238,241,0.56)` | Body copy, secondary lines. |
| `foreground-faint` | `rgba(236,238,241,0.32)` | Metadata, timestamps, captions. |
| `accent` | `#FFB300` ("phosphor amber") | The single accent. Sourced from CRT/terminal phosphor displays — on-brand for the existing terminal motif, and deliberately *not* the generic neon-green or vermilion that AI-generated dark portfolios default to. |
| `status-live` | `#34D399` desaturated to ~70% | **Functional exception, not a design accent.** Used only for the literal "available for hire" pulse dot, because green-for-live is a real convention people read instantly. Never used decoratively elsewhere. |

Rule: if a screen needs a second decorative color, that's a sign something else (spacing, type weight, hairlines) should be doing the differentiation instead.

---

## 2. Typography

Three roles, each doing one job — no role borrows another's work.

- **Display** — a geometric grotesque with some character (General Sans / Cabinet Grotesk territory, not Inter). Headlines only. Weight 500–600, never black-weight — confidence without shouting, the same lesson Luke's "Basically, I make websites" deflation teaches.
- **Body** — a neutral, highly legible humanist sans (Inter / Geist Sans). Paragraphs, UI labels, form fields. Weight 400.
- **Mono** — Geist Mono / JetBrains Mono. This is a **structural** role, not decoration, because the terminal motif is your signature: nav numbers, eyebrows, log lines, stack tags, dates, the "whoami" block. If it isn't a sentence meant to be read for meaning, it's probably mono.

### Scale (fluid, clamp-based)

| Token | Clamp | Used for |
|---|---|---|
| `display` | `clamp(3.5rem, 8vw + 1rem, 14rem)` | Hero line ("restoring / meaning / to things / i build") |
| `heading-lg` | `clamp(2rem, 4vw + 0.5rem, 6rem)` | Section titles ("Systems I Build," "Selected Works") |
| `heading-md` | `clamp(1.5rem, 2.5vw + 0.5rem, 2.75rem)` | Card / sub-section titles |
| `body-lg` | `clamp(1.125rem, 1.5vw, 1.5rem)` | Lead paragraphs, intro copy |
| `body` | `clamp(1rem, 1.25vw, 1.35rem)` | Standard paragraph copy |
| `mono-label` | `0.8125rem–0.875rem` (fixed, not fluid) | Eyebrows, nav numbers, tags, timestamps |

### Rhythm

- Line-height: display `0.95–1.0`, heading `1.05–1.15`, body `1.5–1.6`, mono labels `1.4`.
- Tracking: display `-0.03em to -0.04em`, body `0`, mono labels `+0.06em to +0.1em` uppercase.
- Column width for body copy: constrain to **65–75 characters** even on wide screens — this is the single highest-leverage change for making long sections (Systems I Build, testimonials) feel edited rather than dumped.

---

## 3. Spacing & Grid

Base unit: 8px. Strict geometric scale: `4 · 8 · 16 · 32 · 64 · 128 · 256`.

- **Section rhythm**: 128–192px vertical gap between major sections (desktop), 64–96px mobile. This is what makes the page breathe the way Luke's does — most portfolios under-space between sections far more than they under-space within them.
- **Container**: max-width ~1440px, side margins `clamp(24px, 5vw, 96px)`.
- **Grid**: 12-column for standard content; an optional 24-column micro-grid for dense data moments (the infra cards in "Systems I Build," the locale-manager dashboard demo) where finer alignment matters.
- **Whitespace target**: ≥40% unmonetized space around the hero and around the "End of scroll" reflection line in section 07 — that reflection moment is already doing the relief-after-tension job correctly; protect it, don't crowd it with more content later.

---

## 4. Motion Tokens

| Token | Value | Used for |
|---|---|---|
| `ease-entrance` | `power4.out` | Hero load, first-paint reveals |
| `ease-luxury` | slow-fast-slow cubic, ~`cbz(0.16,1,0.3,1)` | Large panel/layout transitions |
| `ease-scrub` | linear | Scroll-tied / pinned ScrollTrigger motion, the log ticker |
| `ease-snap` | `cbz(0.65,0,0.35,1)` | Hover, focus, toggle micro-feedback |
| `duration-micro` | 120–200ms | Hover/focus states |
| `duration-standard` | 400–600ms | Card reveals, panel transitions |
| `duration-entrance` | 900–1400ms | Hero text/image entrance |
| `lenis.duration` | 1.1–1.2 | Smooth-scroll feel |
| `lenis.wheelMultiplier` | 1.0 | Synced to GSAP ticker, not a separate rAF loop |

**Signature motion move**: extend the terminal/log motif beyond the hero into a thin, persistent "system log" rail that recurs at section boundaries — short mono lines like `$ cd ./systems`, `$ cd ./works`, `$ cd ./contact` as connective tissue between sections, scrubbed to scroll position. This is the one place to spend the boldness (per the restraint principle) — it's already native to your content, costs little, and nothing else needs to compete with it.

**Cursor**: skip the generic magnetic-circle cursor. A blinking text-caret cursor on interactive elements is more specific to the terminal metaphor and more memorable for being literal rather than borrowed from every other GSAP portfolio.

**Restraint rule**: terminal panels (Systems I Build cards) stay structurally static — no 3D tilt. Tilt-on-hover is reserved for the photographic Selected Works cards only. A wobbling terminal breaks the metaphor it's built on.

**Accessibility floor**: `prefers-reduced-motion` collapses everything to opacity-only crossfades — no scrub, no pin, no tilt. Non-negotiable, not a stretch goal.

---

## 5. Interaction Language

- **Status badge**: amber/green pulse dot + mono label. Currently three different phrasings exist across the page ("Available for hire," "open to work · collabs," "Open to projects") — collapse to one canonical phrase, reused identically in nav, hero, and contact.
- **CTA verbs**: active, specific, never repeated identically six times in a row. The "Where I Build & Share" block currently uses "Explore" for all six links — differentiate: *Read the resume*, *Connect on LinkedIn*, *Browse the code*, *Read the blog*, *See the projects*.
- **Dead links**: the Resume card points to `#`. Fix before anything else ships — a non-functional primary CTA is worse than no CTA.
- **Forms**: keep the existing low-friction pattern (Name / Email / what they're working on / budget range / message) — it's already well-scoped. Add inline validation feedback within ~50ms of input (Zod + react-hook-form are already in the stack for this) and a toast on submit using active voice — "Message sent," not "Submitted."
- **Terminal blocks that aren't actually interactive** (the `whoami` hero block) should read visually distinct from ones that are (the locale-manager demo, which is a real dashboard mock) — right now both share the same panel styling, which sets a false interactivity expectation on the hero block.

---

## 6. Component Language

One core signature component, everything else in service of it.

- **Terminal Panel** *(signature component)* — mono surface, hairline border, optional sub-4%-opacity scanline texture. Variants: status (hero), infra-card (Systems I Build), demo (locale manager, starter-kit tree). One component, several content modes — not five different bespoke blocks that happen to look similar.
- **Nav Rail** — numbered `00–05`, mono labels. Keep the existing convention; active state = single underline or dot in `accent`, not multiple simultaneous effects.
- **Project Card** — image-led, tilt-on-hover, `accent`-colored border appears only on hover (not a permanent colored border). Title + stack tags in mono caption style below.
- **Testimonial Card** — quote-led. Replace filled-color initial circles with a thin amber ring around initials — keeps the monochrome+single-accent system intact instead of introducing five arbitrary avatar colors.
- **Status Badge** — the reusable available/open pill described above.
- **Tag/Stack Chip** — mono, hairline border, no fill. Used for the toolkit marquee and project stack tags. The toolkit list currently renders as two back-to-back full copies of the same list in the static markup — when built, this needs to be a genuine seamless loop, not a visible double-print.

---

## 7. Page Architecture

Reordering and tightening the existing structure, not replacing it:

1. **Hero** — status terminal panel + display headline + photo. *Fix the name/email bug here first, before anything else.*
2. **About / manifesto** — one tightened paragraph. Audit the live markup for literal triplicate repetition of the intro paragraph — if that's not an intentional marquee effect, it's a bug.
3. **Where I Build & Share** — keep the concept, differentiate CTA copy, fix the dead Resume link.
4. **Systems I Build** *(the real differentiator — protect this)* — apply the honesty pattern that card 07 already uses ("they were never meant to be showcased... built to solve real problems") to cards 02–06 individually, each ending on a one-line "why this mattered," not just the closer.
5. **Testimonials** — slow down. Move from a five-card grid to a single pinned, one-quote-at-a-time reveal — matches the editorial pacing of the rest of the page better than a dense row.
6. **Selected Works** — keep the grid, but surface one value-prop line per project without requiring a hover/click — don't make a recruiter gamble a click to find out what a project is, per the Luke teardown's biggest weakness.
7. **Toolkit marquee** — keep as ambient texture, fix the duplication bug, never let it become a primary reading moment.
8. **Contact** — keep the current form pattern as-is; just align the status language with section 1.

---

## What this protects vs. what it changes

**Keep**: the terminal/systems motif (it's your actual differentiator), the low-friction contact form, the honest "abandoned project" admission, the numbered nav.

**Fix immediately, independent of any redesign**: the pranav name/email bug, the dead Resume link, the repeated "Explore" CTAs, the inconsistent availability phrasing, the toolkit duplication.

**Change**: color down to one accent instead of whatever's currently scattered across the UI library defaults, type scale tightened to the fluid tokens above, section spacing roughly doubled, testimonials slowed from a grid to a sequence, terminal panels kept structurally still while project cards get the tilt.

Next step when you're ready: turn this into actual tokens and components against your real stack (Tailwind v4, shadcn, Radix, GSAP, Lenis, R3F) — say the word and I'll move to implementation.
