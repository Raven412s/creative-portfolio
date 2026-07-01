# RAVEN UNLEASHED
## Master Implementation Blueprint
### Lead Product Architect · Creative Director · Motion Director · UX Strategist
### Status: Pre-Development · Approved Design System Applied

---

> **Operating principle for this document:** Every decision must justify itself against the brand thesis: *"a systems-minded creative developer who builds infrastructure that outlives the project, and is honest about what didn't work."* That is the single competitive moat. Nothing in this blueprint is decorative for decoration's sake. Everything earns its presence.

---

## 1. INFORMATION ARCHITECTURE

A complete narrative map. Every section is a chapter in a story that begins with identity, builds through evidence, and ends with invitation.

---

### 00 — PRELOADER

**Why it exists:** First impressions are set before the hero renders. A preloader isn't a loading screen — it's the curtain before the performance. It establishes tone, proves technical command, and gives the browser time to hydrate without a flash of unstyled content. Critically, it resets the visitor's attention state: they arrive ready, not mid-scroll.

**Emotional purpose:** Anticipation. Controlled tension. The user has committed to waiting; reward that commitment with something that feels intentional.

**Information communicated:** Nothing literal. Brand signal only. The `RAVEN UNLEASHED` logotype forms, and a terminal-style `00 → 100` counter in mono type tracks real asset progress. The sequence is short — max 2.4 seconds — because this isn't a showcase, it's a threshold.

**Transition into next section:** On 100%, the counter freezes for exactly 280ms (the pause before the reveal), then a full-viewport clip-path wipe from bottom-to-top exposes the hero beneath. The preloader panel does not fade — it *slides off*, like a physical object clearing a stage. The hero is not "loaded into"; the hero was always there, waiting.

**Motion language:** Mono counter increments with a CSS `counter()` driven by a GSAP scrub mapped to real `Promise.all` asset resolution. Logotype enters via Y-axis mask reveal at t=0. Exit: `clip-path: inset(0 0 100% 0)` → `inset(0 0 0% 0)` reversed, `power4.inOut`, 800ms. A single horizontal `hairline` rule draws from left to right beneath the counter as a progress bar, replacing the standard percentage bar.

**Interaction language:** Zero interaction. Visitor is passenger during this sequence.

---

### 01 — HERO

**Why it exists:** The hero is the thesis statement. Not a welcome mat. Not a name tag. A thesis. It answers: "who is this person and why does their particular combination of traits matter?" in under three seconds, without the visitor reading a single sentence.

**Emotional purpose:** Calm authority. The hero should feel like walking into a room where someone is already working — focused, unhurried, capable. Not "look at me," but "I noticed you arrived."

**Information communicated:**
- Identity: Ashutosh Sharan / Raven Unleashed
- Availability signal: canonical status badge, one phrasing only
- Core positioning line (the display headline — see below)
- The terminal identity panel (fixed, structural — *not* interactive decoration)
- Entry vector into the scroll narrative

**The headline — critical creative decision:**
Current: `"restoring / meaning / to things / i build"` — this is *good* but incomplete. It's a mood, not a position. Revised approach: keep the stacked display type structure, but rewrite to encode the systems differentiator directly:

```
SYSTEMS
THAT
OUTLAST
THE BRIEF
```

Four stacked lines. Each word enters independently via Y-axis mask reveal. The phrase earns its weight because every project in "Systems I Build" proves it. The hero headline becomes a promise the rest of the page fulfills. *This is the contract with the visitor.*

**Terminal identity panel** (left side, floating):
Remains as the structural anchor. Content fixed:
```
❯ whoami
ashutosh sharan · systems developer

❯ uptime
3 yrs · shipped in production

❯ cat status.txt
✦ open to work · open to collabs

❯ ping contact
being.ashutosh16.20@gmail.com
❯ _
```
The blinking cursor `_` is the only animation inside the panel after the entrance. It blinks at 530ms — a real terminal rate, not an approximated one.

**Photo treatment:** Desaturated to ~15% saturation, pushed to the right column, clipped into a portrait aspect ratio. A thin `hairline` border appears on hover only. No parallax tilt on the photo — it's a person, not a card.

**Transition into About:** As the user begins to scroll, the hero headline lines stagger upward and reduce in scale — not disappearing, but *yielding* — and the About section rises from below, masked, at full opacity. The transition communicates: "the identity established above governs what follows."

**Motion language:**
- On hero entry (post-preloader): headline lines stagger in at `0.08s` per line, `power4.out`, 1100ms total
- Terminal panel fades + translates Y: 20px → 0, `power3.out`, 800ms, delay 400ms
- Status badge pulses in: scale `0.8→1.0`, `elastic.out(1.2, 0.6)`, 600ms, delay 900ms
- Photo slides in from right: `translateX(40px) → 0`, opacity `0→1`, 900ms, delay 300ms
- On scroll exit: headline lines transform upward (`translateY(-60px)`) synchronized to Lenis scroll progress via ScrollTrigger scrub

**Interaction language:**
- Email address in terminal panel: hover triggers `accent` underline draw (width `0→100%` via `scaleX`)
- Status badge: no hover effect — it's informational, not interactive

---

### 02 — ABOUT / MANIFESTO

**Why it exists:** The hero told you what he builds. This section tells you *who he is while building it.* A recruiter or client who reads this paragraph decides whether to trust the work before seeing it. This is the handshake.

**Emotional purpose:** Trust. Vulnerability. Precision. The manifesto should feel like something a real person wrote, not a positioning document.

**Information communicated:**
One paragraph, maximum 55 words. Draft:
> "I build the scaffolding other developers inherit. Auth layers they can swap without rewriting. Blog engines they can redeploy across clients. i18n systems their PMs can edit without a dev ticket. I've shipped things that worked, documented things that didn't, and shipped the documentation too."

This paragraph encodes: technical depth, systems thinking, production reality, intellectual honesty — all in under 60 words.

**The critical UX insight here:** This section should *not* look like a section. No section header, no divider, no "About me" label. It floats in generous white space between the hero and the systems chapter — a breath, not a chapter. The section number `02` appears in mono label style, far left margin, faint opacity, as a structural marker only.

**Transition into Systems I Build:** The manifesto paragraph does not scroll away — it *dissolves*. A final `opacity: 0` on the last scroll pixel before the Systems chapter pins, so the visitor carries the manifesto as context into the technical evidence.

**Motion language:**
- Entrance: lines stagger in via word-level mask reveal, `power3.out`, 60ms stagger per word group
- On exit: linear opacity fade tied to scroll scrub, 0% → 20% scroll progress within section

**Interaction language:** Zero. This section should offer no distraction from reading.

---

### 03 — SYSTEMS I BUILD

**Why it exists:** This is the entire differentiation play. Not "here are my projects." Here is the infrastructure I built that other developers are currently using without knowing I built it. This section is the reason the portfolio exists.

**Emotional purpose:** Credibility. Recognition. The specific pleasure of seeing technical competence articulated clearly — the feeling a senior engineer gets when they read prose that proves the writer has actually been in production.

**Information communicated:** Six infrastructure case studies (blog engine, auth migration, starter kit, locale manager, component library/abandoned, the reflection coda), each with: what was built, why it mattered, what the architectural insight was, honest assessment.

**The section architecture:** Pinned horizontal scroll (desktop) OR stacked vertical scroll (mobile). On desktop, the section header pins at the top of the viewport and the six cards scroll horizontally past it. This is the Apple-style storytelling mechanic — the user feels like they're advancing through chapters, not scrolling past a grid.

**Each card is a Terminal Panel variant.** Not a generic card. The terminal metaphor is structural here — each card is literally a window into a running system. The card headers read like terminal paths:
```
~/blog-engine  ~/auth-migration  ~/starter-kit  etc.
```

**The honest card (Component Library / Abandoned)** is treated differently — slightly lower opacity, a `[DEPRECATED]` tag in amber, the body copy in a different tone. This visual differentiation makes the honesty *legible at a glance*, not just readable.

**The reflection coda (07):** This is the most important moment in the section. After the sixth card, a single line appears in large display type, centered, full-width:
> *"Most of these tools were never meant to be showcased. They were built to solve real problems."*
The visitor exits the Systems chapter with a philosophical frame, not a portfolio grid. This is what separates the site.

**Transition into Selected Works:** The pinned section unpins. A thin horizontal `hairline` rule draws across the full viewport width. The Selected Works headline drops in from above as the scroll resumes. The transition communicates: from systems thinking → to the products those systems produced.

**Motion language:**
- Pin trigger: `ScrollTrigger.pin` on the section wrapper, scrub: true
- Each card translates on a GSAP horizontal ScrollTrigger timeline: `x: 0 → -(totalWidth)` mapped to scroll progress
- Card entrance (as it scrolls into view): `opacity: 0 → 1`, `translateX: 40px → 0`, `power3.out`, 500ms per card
- The reflection coda: scale `0.8 → 1.0`, opacity `0 → 1`, `elastic.out(1, 0.5)`, triggered when the user reaches the section end

**Interaction language:**
- Each card expands on hover: `height` increases via `max-height` transition revealing a one-line "architectural insight" that's hidden at rest
- Cursor transforms to a blinking text caret `|` when hovering any Terminal Panel — reinforcing the terminal metaphor
- The `[DEPRECATED]` tag on the abandoned component library card: hover shows a tooltip in mono type: `"Abandoned v0.3 · Scope exceeded roadmap · Learned more than shipped"`

---

### 04 — SELECTED WORKS

**Why it exists:** This is the proof-of-output layer. Systems I Build proved you build infrastructure; Selected Works proves that infrastructure produces real, shipped products.

**Emotional purpose:** Range and reality. The projects should feel *real* — not mockups, not student work, not hypotheticals. Real URLs, real businesses, real clients.

**Information communicated:** Five projects (Staarllet, Aroma, Gorakhpuriya Bhojpuria, Volt-Meet, Synergy Hospital). Each communicates: what type of product, what stack, one sentence of actual value delivered (not just "developed a high-performance platform" — e.g., "multilingual menu with zero-dev content updates for a Georgia restaurant").

**Critical IA fix:** Surface one value line per project *on the grid itself*, not behind a hover. A recruiter should be able to scan all five projects and understand the range without clicking. Hover reveals the stack chips and an arrow CTA.

**Layout:** Asymmetric editorial grid. Two large cards top row, three smaller below. Or one hero card (full width) + four in a 2×2 grid. Not a uniform five-card grid — editorial tension requires asymmetry.

**Transition into Testimonials:** A hard type moment — a large mono label `CLIENT SIGNAL ↓` appears as the section scrolls out. Not a divider — a chapter title in the editorial tradition.

**Motion language:**
- Grid entrance: staggered from top-left to bottom-right, each card `translateY: 60px → 0`, `opacity: 0 → 1`, 80ms stagger, `power3.out`
- Project card hover: 3D tilt (the *only* place tilt is used), `maxTilt: 8deg`, `power2.out` restore on exit
- External link arrow: rotates `45deg → 0deg` on hover, translating slightly northeast
- Image reveal on card entrance: `clip-path: inset(0 100% 0 0) → inset(0 0% 0 0)`, `power4.out`, 700ms

**Interaction language:**
- Hover: tilt + image scale `1.0 → 1.04` + stack chips fade in from bottom
- Click/tap: external link opens in new tab (existing behavior, preserved)
- No modal, no lightbox — the work exists at live URLs, send them there

---

### 05 — TESTIMONIALS

**Why it exists:** Third-party validation at the exact moment the visitor's left brain is asking "but can he actually work with other people?" The visitor has seen the systems, seen the work — now they need social proof before reaching out.

**Emotional purpose:** Relief. Confirmation. The moment where the visitor's private verdict ("this person seems genuinely good") is ratified by other people who paid for it.

**Information communicated:** Five testimonials — founder, CTO, product lead, engineering manager, CEO. The range of job titles matters: it proves Ashutosh works across seniority levels and org types, not just with one type of stakeholder.

**Critical redesign:** Remove the five-card grid. Replace with a pinned single-quote-at-a-time reveal sequence. The visitor sees one testimonial at a time, full-width, centered, in a slightly larger type scale. A mono progress indicator shows `01 / 05`. The visitor scrolls to advance to the next quote. This is the same emotional mechanic as Luke Baffait's scroll storytelling — slow it down, make each piece of evidence feel considered.

**Avatar treatment:** Replace filled-color initials circles with a thin `accent`-ring avatar. Initials in `foreground-muted` mono type inside the ring. No arbitrary colors — single-accent system preserved.

**Transition into Toolkit:** A fast wipe — the testimonial section exits at full opacity, and the toolkit marquee begins immediately below. The contrast between the slow, considered testimonial pace and the continuous ambient motion of the marquee is intentional: the user has been moved slowly, and now the environment resumes momentum.

**Motion language:**
- Section pins: each quote pins for a scroll distance of `30vh`
- Quote entrance: word-level mask reveal, `power3.out`, 40ms stagger per word
- Name/company entrance: slides up from `translateY: 12px`, `opacity: 0 → 1`, delay 400ms after quote
- Quote exit: fades to `opacity: 0.15` as next quote enters — the prior quote "dims" rather than disappearing, creating depth
- Progress counter: increments in mono with a `0.15s` ease-in

**Interaction language:** Scroll-driven only on desktop. On mobile, swipe gesture (Embla Carousel, already in stack).

---

### 06 — TOOLKIT

**Why it exists:** Not to impress. To orient. A recruiter scanning quickly needs to know the technical surface area in under five seconds. The marquee solves this without making it the point.

**Emotional purpose:** Ambient energy. The toolkit should feel like infrastructure running in the background — it's always there, you notice it when you look, but it doesn't demand attention.

**Information communicated:** Full tech stack, single seamless loop.

**Critical fix:** The current implementation prints the list twice in the DOM (verified in the live markup). The implementation must be a true CSS/JS infinite loop using a single source list cloned once — not duplicated in the HTML.

**Format:** Two rows, opposite scroll directions (`→` / `←`). Each chip is mono text, hairline border, no fill. The `accent` color appears on exactly three chips — the three "signature" technologies (Next.js, GSAP, TypeScript) — to communicate hierarchy within the marquee without breaking the system.

**Transition into Contact:** The marquee slows down over 400ms (CSS animation-duration increase triggered by IntersectionObserver on the Contact section root) and then the Contact section rises. The marquee deceleration is a physical signal: "the ambient motion is stopping because something specific is about to be asked of you."

**Motion language:**
- CSS `animation: marquee-left linear infinite` / `marquee-right linear infinite`
- Duration: `28s` / `22s` for the two rows (different speeds for visual depth)
- On Contact section enter: GSAP tween on animation-duration property slows both rows to `80s` over 600ms
- Paused on `prefers-reduced-motion`

**Interaction language:** On hover over any chip, that chip's opacity increases from `foreground-muted` to `foreground` and the marquee slows by 30%. No click behavior — these are not CTAs.

---

### 07 — CONTACT

**Why it exists:** Conversion. But framed as an invitation, not a form. The visitor has completed the narrative journey. Reaching the contact section should feel like arriving, not filling out paperwork.

**Emotional purpose:** Warmth. Accessibility. The relief of a clear, frictionless next step after a demanding scroll experience.

**Information communicated:** The canonical availability status (one phrasing, matching the hero badge exactly), the email address as both a link and visible text, the budget-scoped form, the timezone and response SLA.

**Critical rewrite — the headline:** Change "Let's make something interesting" to something that encodes the brand position:
> "If you have a system that needs building"
as a large display line, followed in smaller body type by:
> "— or one that needs rebuilding — I'm available."

This reframes the CTA from generic creative-freelancer language into the specific positioning established in every prior section.

**Form strategy:** Preserve the existing form fields (Name, Email, What you're working on, Budget, Message). These are already well-scoped. Add one design change: the form fields use the `TerminalPanel` variant — mono labels, hairline borders, no standard input styling. The form feels like a terminal session, not a web form. This is the final expression of the terminal motif, and it's earned because the entire page has built toward it.

**Transition to Footer:** No transition. The contact section is the last narrative beat. The footer is structural only — it appears as a natural document end.

**Motion language:**
- Section entrance: headline enters via line-level mask reveal, `power4.out`, 900ms
- Form entrance: staggered field-by-field entrance, `translateY: 20px → 0`, `opacity: 0 → 1`, 60ms stagger, after headline completes
- On form submit: Sonner toast in `TerminalPanel` style: mono text, `$ message.sent → 200 OK`, slides in from bottom-right
- Email address: on hover, a mono underline draws left-to-right via `scaleX` transform

**Interaction language:**
- Inline validation: Zod + react-hook-form, field-level errors appear within 50ms of blur
- Error messages in `foreground-muted` mono type below each field, no red color — consistent with the monochrome system
- Submit button: replaces CTA text with a mono spinner `⟳` then `✓ sent` — never returns to "Send it →"

---

### 08 — FOOTER

**Why it exists:** Structural closure. Legal layer. Navigation fallback. Secondary social signals.

**Emotional purpose:** Quiet. The page has spoken. The footer doesn't add to the narrative — it closes it gracefully.

**Information communicated:** Large `UNLEASHED` display type (left-anchored), copyright line in mono faint, three social icons (Instagram, GitHub, LinkedIn), Privacy/Terms/Sitemap in mono faint. A "Back to top ↑" anchor in `accent` color — the only overt color usage in the footer.

**Motion language:** No entrance animation. Footer is static. The "Back to top" arrow rotates `0deg → -90deg` on hover.

---

## 2. COMPLETE PAGE STRUCTURE

### Canonical Page Order & Rationale

```
00 Preloader          → Trust deposit before a word is read
01 Hero               → Identity thesis + status signal
02 About              → Human layer before evidence layer
03 Systems I Build    → The differentiator — proof of systems thinking
04 Selected Works     → Proof of output — systems become products
05 Testimonials       → Social proof — others validate the systems thesis
06 Toolkit            → Ambient technical inventory — never the point
07 Contact            → Conversion as narrative destination
08 Footer             → Structural closure
```

**Why this order is optimal:**

The structure follows a precise emotional logic: identity → humanity → credibility → validation → invitation. Specifically:

- About (02) must precede Systems (03) because you cannot care about someone's technical systems without first establishing a person behind them. Reversing this makes the portfolio read as a spec sheet.
- Systems (03) must precede Selected Works (04) because the infrastructure section reframes how the viewer sees the projects. Without Systems first, Selected Works looks like five freelance jobs. With Systems first, they look like five deployments of a repeatable system.
- Testimonials (05) after Selected Works (04) is deliberate: left-brain skepticism peaks after you've seen the work. That's when third-party validation has maximum impact.
- Toolkit (06) before Contact (07): the marquee is a decompression valve between the testimonial emotional intensity and the focused ask of the contact section.
- Contact (07) last before Footer: it is the natural destination of the entire journey. The visitor has been qualified, educated, and persuaded — arriving at the form should feel inevitable, not transactional.

---

## 3. MOTION SYSTEM

### Design Philosophy

Motion in this system has one purpose: **to pace the reading of a technical argument.** Every animation either *reveals* information at the right moment, *punctuates* a transition between narrative chapters, or *reinforces the terminal metaphor* that is the site's structural identity. Decoration for decoration's sake is a failure condition.

Three motion registers:

| Register | Role | Timing Profile |
|---|---|---|
| **Ceremonial** | Hero entrance, section reveals, preloader | Slow, luxury, 900ms–1800ms |
| **Narrative** | Scroll-scrubbed progress, card choreography | Linear, scrub-mapped, duration = scroll distance |
| **Responsive** | Hover, focus, form feedback, cursor | Immediate, 120ms–400ms |

---

### Hero Entrance

1. **t=0ms** — Viewport is black. Preloader mounted.
2. **t=0–2400ms** — Preloader sequence runs (counter, logotype).
3. **t=2400ms** — Clip-path wipe removes preloader, revealing hero beneath.
4. **t=2400–2680ms** — 280ms hold. Nothing moves. This silence is intentional.
5. **t=2680ms** — Terminal panel translates Y from `+20px` at `opacity:0`, to `y:0, opacity:1`. `power3.out`, 800ms.
6. **t=2780ms** — Headline lines begin staggered Y-axis mask reveal. Each line: `overflow:hidden` wrapper, child `translateY(110%) → 0`. Stagger `0.1s` per line. `power4.out`, 1100ms.
7. **t=3100ms** — Status badge scales in from `0.85`, `elastic.out(1.1, 0.5)`.
8. **t=3300ms** — Photo translates from `translateX(30px) opacity:0` to rest. `power3.out`, 900ms.
9. **t=3600ms** — Scroll affordance appears (a thin amber `↓` chevron, pulsing at 0.15s interval).

**Hold-the-silence principle:** The 280ms pause between preloader exit and first hero animation is non-negotiable. It is the moment the visitor's eye focuses. Starting animation immediately on reveal loses this.

---

### Section Entrances

Each section uses a **two-phase entrance**:
1. **Phase A — Section header** (the section label, number, and title): line-level mask reveal, `power3.out`, 700ms. Triggered when section root enters viewport at `threshold: 0.15`.
2. **Phase B — Body content**: staggered entrance starting 200ms after Phase A begins. Content-type-specific (cards stagger, paragraphs fade+translate, images clip-reveal).

No section should feel like it "loads in." Every section should feel like it was always there, and the scroll is revealing it.

---

### Section Exits

Sections do not animate out on desktop — they simply scroll behind the next section. The exception is:
- The Systems I Build pinned section: exits via an unpin, with the section header fading to `opacity:0.15` as the horizontal scroll completes.
- The Testimonials pinned sequence: each quote dims to `opacity:0.15` as the next pins. The prior quote remains visible but non-dominant.

The exit discipline: **do not animate something out unless the exit itself communicates something.** Exit animation for the sake of it creates visual noise, not poetry.

---

### Typography Motion

**Technique inventory:**

1. **Line mask reveal** — For headlines (display, heading-lg). `overflow:hidden` wrapper, child `translateY(110%)→0`. This is the cleanest headline technique and the hardest to overuse.
2. **Word-group reveal** — For body copy, manifesto paragraph, testimonial quotes. Groups of 2–4 words share an `overflow:hidden` wrapper. Slightly softer stagger (`40ms` vs `80ms` for line reveals).
3. **Character splinter** — Reserved for the hero headline and the preloader logotype *only*. GSAP `SplitText` on characters, stagger `0.015s`. Used sparingly because this technique is now common; overuse signals template.
4. **Typewriter expansion** — For terminal panel content specifically. Each line types in at ~8 characters per 100ms, matching a real 80wpm terminal output rate.

**Optical rule:** All text animations must complete before the user is expected to read the text. An animation that finishes *while* the user is trying to read it is a UX failure, not a design win.

---

### Image Motion

- **On entrance:** `clip-path: inset(0 100% 0 0) → inset(0 0% 0 0)`, `power4.out`, 700ms. The image reveals left-to-right, as if being uncovered by a hand removing cloth.
- **During scroll (project cards):** Subtle parallax — image translates at `0.85×` scroll speed relative to card container. Creates depth without distraction.
- **On hover (project cards):** Image scales `1.0 → 1.04` with `overflow:hidden` on the card containing it. The scale is small enough to feel physical, not cartoon.
- **Photo (hero):** No parallax, no hover scale. Static. The person is not a UI element.

---

### Card Motion

**Project Cards (Selected Works):**
- 3D tilt on hover: `tiltX = (mouseY / h - 0.5) * 10`, `tiltY = (mouseX / w - 0.5) * -10`. `maxTilt: 10deg`. `power2.out` restore.
- Tilt is the *only* 3D transform in the system. Using it here and nowhere else makes it land.
- A subtle `box-shadow` in `rgba(255,179,0,0.06)` (ambient amber) appears on hover — not visible until inspected, but felt.

**Terminal Panel / InfraCards (Systems I Build):**
- No 3D tilt. Zero. The terminal metaphor breaks if a terminal window tilts.
- On hover: `border-color` transitions from `hairline` to `accent` at `opacity:0.25`. `duration-micro` (160ms).
- Hidden detail expands via `max-height` transition: `0 → auto` (implemented via `grid-template-rows: 0fr → 1fr` for layout stability).

---

### Hover Motion

**Principle:** Hover states are responses, not performances. They confirm that an element is interactive. They should feel like the element noticed you, not like it's showing off.

| Element | Hover behavior | Duration |
|---|---|---|
| NavRail link | Underline draws left-to-right via `scaleX` | 200ms |
| Email link | Same underline draw + color → `accent` | 200ms |
| Project card | Tilt + image scale + stack chips fade up | 300ms |
| Terminal card | Border `hairline → accent/25` + detail expand | 160ms |
| Toolkit chip | Opacity lift `56% → 100%`, marquee slows | 200ms |
| CTA button | Background fills from left via `::before` pseudo | 280ms |
| Social icons | `translateY: 0 → -3px` | 150ms |
| Back to top | `rotate: 0deg → -90deg` | 200ms |

---

### Cursor Behavior

**The decision:** No magnetic-circle cursor. This is the #1 over-indexed "creative dev" cursor pattern of 2024. It is a template signal, not a differentiator.

**Instead:** A blinking text caret `|` that appears *alongside* the system cursor on interactive elements. The system cursor remains; the caret appears 4px to the right of the cursor position when hovering anything with `data-cursor="terminal"`. This is specific to the terminal metaphor and cannot be mistaken for a borrowed pattern.

Implementation: a small `<div>` in the DOM, `position:fixed`, tracks mouse via `requestAnimationFrame` + lerp `0.12`. The caret is `1px × 20px`, `accent` color, blinks at 530ms. On non-interactive zones, the caret `opacity:0`. On interactive zones, `opacity:1`, transition `80ms`.

On mobile: entirely suppressed. No custom cursor on touch devices.

---

### Pinned Sections

**Two pinned chapters:**

1. **Systems I Build** — Horizontal scroll pin on desktop. Pin the entire section wrapper. The horizontal ScrollTrigger maps `x` translation of the cards track to vertical scroll progress. On mobile: standard vertical stacked cards, pin disabled.

2. **Testimonials** — Vertical sequential pin. Each quote pins for `30vh` of scroll, then exits via opacity dim and the next pins. Five quotes × 30vh = 150vh of "virtual scroll distance" for the section. This is how a 5-item list becomes a cinematic sequence.

**Pin philosophy:** Pin sections are the moments where the page says "stay here." Use them to force reading of critical content. Systems I Build forces the visitor to move through every infra card before continuing. Testimonials forces the visitor to absorb each quote rather than skimming the grid.

---

### Scroll Choreography

The page can be divided into three scroll zones:

| Zone | Sections | Lenis behavior | GSAP strategy |
|---|---|---|---|
| **Cinematic entry** | Preloader → Hero → About | Full smoothing, 1.2 duration | Timeline-based, not scroll-scrubbed |
| **Narrative depth** | Systems I Build → Works | ScrollTrigger scrub, pinned | Horizontal scroll + card orchestration |
| **Deceleration** | Testimonials → Toolkit → Contact | Smoothing maintained, reduced parallax density | Sequential pin + ambient marquee |

Lenis `wheelMultiplier: 1.0` throughout — resist the temptation to increase this. Faster scroll feels less premium.

---

### Lenis Configuration

```
duration: 1.2
easing: cubic-bezier(0.16, 1, 0.3, 1) — matches luxury_ease token
orientation: vertical
gestureOrientation: vertical
smoothWheel: true
wheelMultiplier: 1.0
touchMultiplier: 1.8  ← slightly higher for mobile thumb scroll
infinite: false
```

**GSAP integration:**
```
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => { lenis.raf(time * 1000) })
gsap.ticker.lagSmoothing(0)  ← critical: prevents timing drift on tab-focus
```

---

### GSAP Timeline Strategy

**Three timeline types:**

1. **Load timelines** — `gsap.timeline()` instances created once in `useLayoutEffect`, bound to specific elements via `context()` for proper React cleanup. Used for: preloader, hero entrance.

2. **ScrollTrigger timelines** — Created inside `useLayoutEffect` with the `ScrollTrigger` plugin. Scrub values: `scrub: 1` for fluid (subtle parallax), `scrub: 1.5` for heavier scrubs (horizontal card scroll). Used for: all scroll-driven motion.

3. **Event timelines** — Created on demand inside event handlers (hover, click, focus). These are `gsap.to()` calls, not full timelines, and they kill themselves on the reverse event. Used for: all hover and interaction states.

**Context cleanup:** Every GSAP instance created inside a React component must be wrapped in `gsap.context()` and returned from `useLayoutEffect`'s cleanup function. No exceptions. Memory leaks from GSAP contexts are the #1 production performance issue in complex scroll sites.

---

### Canvas / R3F Opportunities

**Principle:** 3D for this portfolio should be ambient, not dominant. The systems thesis is already strong. WebGL would add craft signal, not differentiation. Use it where it earns its bundle weight.

**One identified R3F opportunity — hero background:**
A very subtle field of floating dot particles in `ink-raised` color (barely visible, `opacity: 0.15–0.25`). Quantity: ~400 particles. They drift with near-zero velocity — `0.1 units/s` — and respond to mouse position via a weak attraction force (`strength: 0.003`). This is the ambient "infrastructure humming in the background" metaphor made visual. It costs very little GPU and adds depth to an otherwise flat dark field. The canvas is `aria-hidden`.

**This is the only WebGL element.** Do not add more. A hero particle field is already in the vocabulary of this genre; keeping it minimal and near-invisible prevents it from becoming a showcase.

**Canvas opportunity — preloader:**
The `00→100` counter is drawn on a Canvas element rather than in the DOM. This allows the counter to be composited precisely with the wipe exit animation. Not required, but a performance win if the preloader has any compositing complexity.

---

### Page Exit / Enter Transitions (Barba.js)

Barba.js is already in the stack. Use it for `/works`, `/case-studies`, `/blogs`, `/contact` route transitions.

**Exit:** Current page wrapper clips upward via `clip-path: inset(0 0 100% 0)` over 600ms, `power4.inOut`. A thin `hairline` line sweeps upward in front of it — same motion as the preloader exit, maintaining visual language consistency.

**Enter:** New page is already positioned beneath, unmasked from bottom via `clip-path: inset(100% 0 0 0) → inset(0 0 0 0)`, 600ms, `power4.out`. The two motions overlap by 300ms: the exit finishes, the enter starts before it does.

**Philosophy:** The transition must feel like turning a physical page, not loading a new one. The user never sees a blank state between pages. The site is a single continuous object that reveals new chapters, not a collection of separate pages.

---

### Micro Interactions

| Interaction | Behavior |
|---|---|
| Form field focus | `border-color: hairline → accent`, label floats up at 0.85× scale |
| Form field error | Error text slides down from field bottom, `translateY: -4px → 0`, 150ms |
| Toast on submit | Mounts from bottom-right, `TerminalPanel` style, auto-dismisses at 4s |
| Nav active state | Dot indicator translates vertically to align with active link, `spring` physics |
| Budget radio select | Selected option's border draws to `accent`, others dim to `32%` opacity |
| Status badge | Pulse ring animates outward from dot at `0.8s` interval, `opacity: 0.5 → 0` |

---

## 4. COMPONENT ARCHITECTURE

### Core Component Inventory

---

#### TerminalPanel

**Purpose:** The signature structural component. Every surface that communicates systems-layer content uses this component. It is not a decorative wrapper — it is the primary content vessel for the site's differentiating content.

**Variants:**
- `identity` — Hero terminal block. Fixed dimensions, constrained content.
- `infra` — Systems I Build cards. Variable height, expandable detail section.
- `demo` — Simulated dashboard / code output (locale manager, starter kit tree).
- `deprecated` — Visually distinct variant for the abandoned component library card.
- `contact` — Form fields styled within the terminal metaphor.

**Responsibilities:** Provide a consistent dark-surface frame with hairline border, mono header path label, scrollable content region (where appropriate), and variant-specific chrome (status tags, `[DEPRECATED]` badge, blinking cursor).

**Dependencies:** Design tokens (ink-raised, hairline, foreground-muted, accent), GSAP for hover border transition, Radix Tooltip for the deprecated tooltip.

**Animation behavior:**
- `identity`: Types in line-by-line via the typewriter technique on mount. Cursor blinks at 530ms post-type.
- `infra`: Detail section expands via `grid-template-rows` on hover.
- `deprecated`: No hover expand. Tooltip only.

**Interaction:** `infra` variant — hover reveals hidden architectural insight. `contact` variant — focus state on contained inputs changes border to `accent`.

**Accessibility:** `role="region"`, `aria-label` per variant. `aria-live="polite"` on typewriter output so screen readers receive it as it types.

**Responsive:** Full width on mobile. Horizontal scroll disabled on mobile (becomes vertical stack).

**Reuse:** This component is used in sections 01, 03, and 07. It should be designed once and configured, not reimplemented per section.

---

#### NavRail

**Purpose:** Primary navigation. Persistent on scroll (sticky), minimal, numbered.

**Variants:** `desktop` (vertical or horizontal rail), `mobile` (hamburger → full-screen overlay).

**Responsibilities:** Route links, active state tracking, mobile menu open/close state, availability badge housing.

**Dependencies:** `next/navigation` (usePathname for active state), GSAP for mobile overlay entrance, StatusBadge component.

**Animation behavior:**
- Desktop: on mount, links stagger in from `translateY: -10px`, 40ms stagger.
- Mobile overlay: full-screen reveal via `clip-path: inset(0 0 100% 0) → inset(0 0 0% 0)`, 500ms, `power4.out`. Links stagger in 80ms each.
- Active indicator: a dot or underline that translates via GSAP `to()` to the active link on route change.

**Interaction:** Underline draw on hover (CSS `scaleX`), active state maintained via pathname match. Mobile close on `Escape` key and outside click.

**Accessibility:** `<nav>`, `aria-label="Main navigation"`, `aria-current="page"` on active link. Mobile overlay: focus trap when open, returns focus to trigger on close.

**Responsive:** Transitions from horizontal desktop rail to hamburger-triggered mobile overlay at `md` breakpoint.

---

#### SplitTextReveal

**Purpose:** A motion utility wrapper, not a visual component. Accepts children, splits them via GSAP SplitText (or a manual implementation if SplitText Club plugin is unavailable), and exposes `animate()` / `reset()` imperative handles.

**Variants:** `lines`, `words`, `characters`.

**Responsibilities:** DOM splitting, animation orchestration, cleanup of split instances on unmount.

**Dependencies:** GSAP, `useImperativeHandle` for ref-based control.

**Animation behavior:** Configured via props — `delay`, `stagger`, `duration`, `ease`. Animates from `translateY(110%) opacity:0` behind an `overflow:hidden` wrapper to `translateY(0%) opacity:1`.

**Accessibility:** The original unsplit text content is preserved in a `sr-only` span that is not animated and remains in the DOM for screen readers.

**Reuse:** Used by HeroHeadline, SectionTitle, TestimonialQuote, AboutManifesto.

---

#### MaskReveal

**Purpose:** A motion utility wrapper for image and block-level reveals. Wraps children in an `overflow:hidden` container and animates a clip-path or child transform to reveal from a specified direction.

**Variants:** `left`, `bottom`, `top`.

**Responsibilities:** Manages ScrollTrigger entry detection, applies the reveal animation once, disconnects ScrollTrigger after animation completes.

**Dependencies:** GSAP + ScrollTrigger.

**Reuse:** Used by every image in Selected Works, the project cards, the photo in Hero.

---

#### ProjectCard

**Purpose:** The primary display unit for Selected Works.

**Variants:** `large` (hero slot, full-width or half-width), `standard` (remaining four).

**Responsibilities:** Display project category label, project name, one-line value prop (always visible), stack chips and arrow CTA (visible on hover), external link target.

**Dependencies:** MaskReveal (for image), GSAP (for 3D tilt), next/image.

**Animation behavior:** Entrance via MaskReveal. Hover: 3D tilt (calculated from mouse position relative to card center), image scale `1.04`, stack chips `translateY: 8px → 0 + opacity: 0 → 1`, arrow rotates from `45deg → 0deg`.

**Interaction:** Entire card is a link. Arrow CTA is a visual affordance, not a separate interactive element.

**Accessibility:** `role="article"` on the card, `aria-label` includes project name + type + value prop text. External link: `rel="noopener noreferrer"`, `aria-label` appended with `"opens in new tab"`.

---

#### InfraCard

**Purpose:** The display unit for Systems I Build section. A TerminalPanel `infra` variant with specific content structure.

**Variants:** `active` (all cards except deprecated), `deprecated` (component library card).

**Responsibilities:** Display terminal path header, card number, section title, body content, tags (ReusableClientReadyModular etc.), hidden architectural insight (revealed on hover), deprecated badge.

**Dependencies:** TerminalPanel, Radix Tooltip (deprecated variant).

**Animation behavior:** As specified in TerminalPanel `infra` variant. The deprecated card: no hover expand, tooltip on badge hover instead.

**Reuse:** Six instances in Systems I Build.

---

#### TestimonialFrame

**Purpose:** Single-quote display unit for the pinned testimonial sequence.

**Responsibilities:** Display quote text, author name, job title, company, thin amber-ring avatar. Progress indicator (01/05).

**Dependencies:** SplitTextReveal (for quote text), GSAP ScrollTrigger (for pin).

**Animation behavior:** Word-level mask reveal on pin enter. Name/company slides up 200ms after quote begins. Prior quote dims to `opacity:0.15` as next enters.

**Accessibility:** `<blockquote>`, `<cite>` for author attribution. `aria-label="Testimonial 1 of 5"` on the wrapper.

---

#### StatusBadge

**Purpose:** The canonical availability signal. Used in: NavRail, Hero terminal panel, Contact section header. One component, three placements.

**Responsibilities:** Display a pulsing dot + mono label. The pulse ring is a CSS animation only — no JS.

**Variants:** `default` (amber dot, available), `unavailable` (dimmed, no pulse) — toggled via a prop, so availability can be updated in one place.

**Single source of truth:** The copy is `"open to work · open to collabs"` everywhere it appears. This canonical phrasing must not drift between placements.

---

#### SectionTransition

**Purpose:** Manages the connective tissue between sections — the mono log lines (`$ cd ./systems`, etc.) and hairline rules that run as structural markers.

**Responsibilities:** Renders a mono label at a specified scroll trigger point. The label types in at 8 chars/100ms, mimics a terminal `cd` command, then fades to `opacity:0.15` as the destination section rises.

**This component exists because:** The transition moments between sections are currently completely unmarked in the live site — the visitor moves between sections with no structural signal. This component fixes that without breaking the design system.

---

#### ToolkitMarquee

**Purpose:** Ambient technical inventory display.

**Responsibilities:** Two rows of stack chips scrolling in opposite directions. Seamless loop via single-list DOM + CSS transform. Speed deceleration on Contact section proximity.

**Dependencies:** GSAP (for deceleration tween on `animation-duration`), IntersectionObserver for Contact proximity detection.

**Critical implementation note:** The source chip list is defined once in a single array. The DOM contains two copies of the array (for seamless loop), never three or more. The current live site has the list printed twice in static markup — this component replaces that with a proper implementation.

---

#### ContactForm

**Purpose:** The conversion point.

**Responsibilities:** Name, Email, Project description, Budget radio group, Message textarea, submit handler, inline validation via Zod + react-hook-form, Sonner toast on success.

**Terminal treatment:** Form fields use `TerminalPanel contact` variant styling. Each field label is a mono string prefixed with `❯`. The submit button reads `$ send.message →` at rest, `⟳ sending...` on submit, `✓ 200 OK` on success.

**Accessibility:** Full keyboard navigation. Each field has a visible label (not placeholder-as-label). Error messages are `aria-live="polite"`. Budget radio group is a proper `<fieldset>` with `<legend>`.

---

## 5. FOLDER ARCHITECTURE

```
src/
├── app/
│   ├── (portfolio)/              # Route group — public-facing portfolio
│   │   ├── layout.tsx            # Root layout: NavRail, SmoothScrollProvider
│   │   ├── page.tsx              # Homepage: Hero → Contact (all homepage sections)
│   │   ├── works/
│   │   │   └── page.tsx          # Extended works page
│   │   ├── case-studies/
│   │   │   ├── page.tsx          # Case studies index
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Individual case study
│   │   ├── blogs/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.ts          # Contact form handler
│   │   └── og/
│   │       └── route.tsx         # Dynamic OG image generation
│   ├── globals.css               # Tailwind v4 @theme tokens, base resets
│   ├── layout.tsx                # Root HTML shell, metadata, fonts
│   └── sitemap.ts
│
├── components/
│   ├── ui/                       # shadcn/ui primitives (un-modified baseline)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── radio-group.tsx
│   │   ├── separator.tsx
│   │   └── sonner.tsx
│   │
│   ├── common/                   # Global layout and navigation
│   │   ├── NavRail/
│   │   │   ├── NavRail.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── index.ts
│   │   ├── Footer/
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts
│   │   ├── Preloader/
│   │   │   ├── Preloader.tsx
│   │   │   └── index.ts
│   │   ├── PageTransition/
│   │   │   ├── PageTransition.tsx
│   │   │   └── index.ts
│   │   ├── StatusBadge/
│   │   │   ├── StatusBadge.tsx
│   │   │   └── index.ts
│   │   └── SectionTransition/
│   │       ├── SectionTransition.tsx
│   │       └── index.ts
│   │
│   ├── sections/                 # Full page sections (one folder per section)
│   │   ├── Hero/
│   │   │   ├── Hero.tsx
│   │   │   ├── HeroHeadline.tsx
│   │   │   └── index.ts
│   │   ├── About/
│   │   │   ├── About.tsx
│   │   │   └── index.ts
│   │   ├── Systems/
│   │   │   ├── Systems.tsx       # Section wrapper + pin logic
│   │   │   ├── InfraCard.tsx
│   │   │   ├── ReflectionCoda.tsx
│   │   │   └── index.ts
│   │   ├── Works/
│   │   │   ├── Works.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   └── index.ts
│   │   ├── Testimonials/
│   │   │   ├── Testimonials.tsx  # Pin sequence wrapper
│   │   │   ├── TestimonialFrame.tsx
│   │   │   └── index.ts
│   │   ├── Toolkit/
│   │   │   ├── Toolkit.tsx
│   │   │   ├── ToolkitMarquee.tsx
│   │   │   └── index.ts
│   │   └── Contact/
│   │       ├── Contact.tsx
│   │       ├── ContactForm.tsx
│   │       └── index.ts
│   │
│   ├── motion/                   # Pure motion utility components
│   │   ├── SplitTextReveal/
│   │   │   ├── SplitTextReveal.tsx
│   │   │   └── index.ts
│   │   ├── MaskReveal/
│   │   │   ├── MaskReveal.tsx
│   │   │   └── index.ts
│   │   └── ScrollProgress/
│   │       ├── ScrollProgress.tsx
│   │       └── index.ts
│   │
│   ├── primitives/               # Reusable styled primitives above shadcn
│   │   ├── TerminalPanel/
│   │   │   ├── TerminalPanel.tsx
│   │   │   ├── TerminalPanel.types.ts
│   │   │   └── index.ts
│   │   └── CursorCaret/
│   │       ├── CursorCaret.tsx
│   │       └── index.ts
│   │
│   └── visual/                   # WebGL and Canvas components
│       ├── ParticleField/
│       │   ├── ParticleField.tsx  # R3F particle field for hero bg
│       │   └── index.ts
│       └── PreloaderCanvas/
│           ├── PreloaderCanvas.tsx
│           └── index.ts
│
├── hooks/
│   ├── useLenis.ts               # Lenis instance + GSAP ticker sync
│   ├── useGSAPContext.ts         # GSAP context factory for component isolation
│   ├── useScrollTrigger.ts       # Abstracted ScrollTrigger setup + cleanup
│   ├── useReducedMotion.ts       # prefers-reduced-motion hook
│   ├── useMousePosition.ts       # rAF-based mouse tracking + lerp
│   └── useIntersection.ts        # IntersectionObserver wrapper
│
├── lib/
│   ├── gsap.ts                   # GSAP + plugins registration (ScrollTrigger, SplitText)
│   ├── lenis.ts                  # Lenis singleton factory
│   ├── db.ts                     # Mongoose connection singleton
│   ├── cloudinary.ts             # Cloudinary client config
│   ├── validations/
│   │   └── contact.ts            # Zod schema for contact form
│   └── utils.ts                  # cn(), clamp(), lerp(), mapRange()
│
├── styles/
│   └── globals.css               # @theme token definitions, @layer base resets
│
├── types/
│   ├── motion.ts                 # GSAP timeline params, easing token types
│   ├── components.ts             # TerminalPanel variants, ProjectCard props, etc.
│   ├── content.ts                # Project, Testimonial, InfraCard data shapes
│   └── api.ts                    # Contact form payload, API response types
│
└── data/
    ├── projects.ts               # Selected works data (typed against content.ts)
    ├── infra-cards.ts            # Systems I Build content
    ├── testimonials.ts           # Testimonials data
    └── toolkit.ts                # Toolkit stack list
```

**Rationale for key decisions:**
- `sections/` separated from `common/` — section components are consumed once; common components are reused across routes. Different change frequency, different ownership.
- `motion/` isolated from `components/` — motion utilities have no visual output; they are behavioral. Keeping them separate prevents conflating presentation with animation logic.
- `data/` as flat typed files rather than CMS-driven — the portfolio content changes infrequently; a build-time data layer is faster to render, zero-latency, and avoids an unnecessary API hop.
- `visual/` isolated — WebGL components have completely different lifecycle management rules. Any engineer touching `visual/` must know they are inside a different performance contract.

---

## 6. IMPLEMENTATION ORDER

### Phase 0 — Infrastructure (before any UI work)

These systems must exist before a single component is built. Building UI without these in place guarantees rework.

1. **Design token layer** — `globals.css` with all Tailwind v4 `@theme` tokens: color palette, spacing scale, type scale fluid clamps, motion duration/easing tokens as CSS custom properties.
2. **GSAP registration** — `lib/gsap.ts` with all plugins registered (ScrollTrigger, SplitText if available). A single import surface for the entire app.
3. **Lenis singleton** — `lib/lenis.ts` + `hooks/useLenis.ts`. Verified GSAP ticker integration. No component should instantiate Lenis directly.
4. **Type definitions** — `types/content.ts`, `types/motion.ts`, `types/components.ts`. Build the type contracts before implementations.
5. **Utility functions** — `lib/utils.ts`: `cn()`, `clamp()`, `lerp()`, `mapRange()`. These are called by motion hooks and component logic.
6. **Data files** — `data/projects.ts`, `data/infra-cards.ts`, etc. Static typed content. Fixes the identity bug (`pranav`) here, in the data layer, not scattered in JSX.
7. **`useReducedMotion` hook** — This must be built before any motion component, because every motion component gates on it.

---

### Phase 1 — Navigation + Layout Shell (2–3 days)

1. Root `layout.tsx` — HTML shell, font loading (`next/font`), metadata template.
2. `SmoothScrollProvider` — wraps the app, initializes Lenis, syncs GSAP. Must be client component, wraps everything except server-rendered shell.
3. `NavRail` — desktop + mobile. Route-active state. StatusBadge integrated.
4. `Footer` — static, minimal.
5. `PageTransition` (Barba.js or Next.js View Transitions API) — must be in place before section development so all route transitions are consistent from day one.

**Why navigation first:** Every subsequent section test requires being able to navigate between routes. Building navigation last introduces delay into testing all scrollytelling sections.

---

### Phase 2 — Preloader + Hero (3–4 days)

1. `Preloader` component — counter, logotype, clip-path exit.
2. `ParticleField` (R3F) — hero background. Built separately, added to Hero after Hero is stable.
3. `HeroHeadline` — display type, SplitTextReveal, mask animation.
4. `TerminalPanel (identity variant)` — typewriter entrance, blinking cursor.
5. `CursorCaret` — the custom caret cursor behavior.
6. Full hero entrance timeline — tying all above into a single sequenced GSAP timeline.

**Why Hero before anything else:** The hero establishes the motion language for the entire site. Every subsequent section's animation quality is calibrated against the hero. Build the gold standard first, then reference it.

---

### Phase 3 — Motion Primitives (2 days)

1. `SplitTextReveal` — universal text animation wrapper.
2. `MaskReveal` — universal image/block reveal wrapper.
3. `ScrollProgress` — scroll progress utility for any component needing it.
4. `SectionTransition` — the terminal `cd` transition connector.

**Why these before sections:** These primitives are used by every remaining section. Building sections without them means inline animation code that must be refactored later.

---

### Phase 4 — About + Systems I Build (3–5 days)

1. `About` section — manifesto paragraph, word-group reveal.
2. `InfraCard` — all variants including deprecated.
3. `TerminalPanel` — all remaining variants (infra, demo, deprecated).
4. `Systems` section wrapper — horizontal pin ScrollTrigger, card orchestration.
5. `ReflectionCoda` — the final quote moment.

**Why Systems before Works:** Systems I Build is the most technically complex section (pinned horizontal scroll, multiple card variants, ScrollTrigger orchestration). Building it before the simpler Works section means the hardest problem is solved with maximum energy and attention.

---

### Phase 5 — Selected Works (2–3 days)

1. `ProjectCard` — all variants (large, standard), tilt, MaskReveal integration.
2. `Works` section — asymmetric editorial grid layout.
3. Individual project data connected to typed data layer.

---

### Phase 6 — Testimonials + Toolkit (2–3 days)

1. `TestimonialFrame` — single quote display.
2. `Testimonials` section — sequential pin logic, progress counter.
3. `ToolkitMarquee` — seamless two-row implementation, deceleration on Contact proximity.
4. `Toolkit` section wrapper.

---

### Phase 7 — Contact + Form (2 days)

1. `ContactForm` — terminal-styled fields, Zod validation, react-hook-form integration.
2. API route `api/contact/route.ts` — server action for form submission.
3. `Contact` section — headline, email link, form integration.
4. Sonner toast system for submit feedback.

---

### Phase 8 — Audit + Polish (2–3 days)

1. Cross-browser motion testing (Safari has the most WebGL and clip-path edge cases).
2. `prefers-reduced-motion` verification across every section.
3. Lighthouse audit — CLS target 0.0, LCP target <1.2s.
4. Accessibility audit — keyboard navigation, screen reader test with VoiceOver/NVDA.
5. Fix all remaining live-site bugs (identity bug, dead Resume link, toolkit duplication, "Explore" CTA repetition).
6. Typography optical adjustments at all breakpoints.

---

### Phase 9 — Route Pages (ongoing)

`/works`, `/case-studies`, `/blogs`, `/contact` as dedicated pages. These build on the component library already established. Not blocking the homepage, which is the primary portfolio surface.

---

## 7. RISKS

### Technical Risks

**T1 — Horizontal pin + Lenis interaction**
Lenis and horizontal ScrollTrigger pins have known interaction edge cases. The horizontal translation needs to be applied to an inner wrapper, not the pinned element itself, to prevent Lenis from fighting the pin. **Mitigation:** Implement Systems I Build horizontal scroll first in Phase 4 with a dedicated test route. Validate Lenis + ScrollTrigger coexistence before integrating other sections.

**T2 — GSAP cleanup in React 19 StrictMode**
React 19 StrictMode double-invokes effects. GSAP ScrollTrigger instances created in `useLayoutEffect` without proper context cleanup will duplicate on mount. **Mitigation:** Every GSAP instance uses `gsap.context()`, returned from the `useLayoutEffect` cleanup. Never create ScrollTrigger instances in `useEffect` — `useLayoutEffect` only.

**T3 — R3F + Lenis frame budget**
The R3F render loop and Lenis RAF loop both consume frame budget. On lower-end devices, running both simultaneously can drop below 60fps. **Mitigation:** R3F canvas `frameloop="demand"` on the hero particle field (renders only when scroll position changes, not every frame). Implement `useIntersection` pause when canvas leaves viewport.

**T4 — SplitText and SSR**
GSAP SplitText requires DOM access and cannot run on the server. Any component using SplitTextReveal must be a client component, and the split must occur inside `useLayoutEffect`. **Mitigation:** SplitTextReveal is always `'use client'`. The original text is rendered server-side in a `sr-only` span so content is always in the initial HTML for SEO.

**T5 — `clip-path` performance on Safari**
Safari has historically had `clip-path` compositing bugs, particularly on elements with `will-change: transform`. **Mitigation:** Test all reveal animations in Safari 17+ specifically. Fall back to `opacity` + `translateY` if clip-path causes compositing artifacts.

---

### Design Risks

**D1 — Terminal metaphor fatigue**
Using the terminal panel in the hero, across all Systems cards, and in the contact form risks the metaphor feeling mechanically applied rather than genuinely thematic. **Mitigation:** Each variant of TerminalPanel must feel contextually appropriate. The contact form version earns its terminal styling because it's a literal `$ send.message` action. If any use of the terminal panel feels forced rather than natural, remove it.

**D2 — Monochrome + no color relief**
A pure monochrome site can feel airless over a long scroll session. Single accent appears only a few times. **Mitigation:** The phosphor amber accent must appear at every major interactive moment and CTA — ensuring the visitor's eye is regularly refreshed without introducing color noise.

**D3 — The "Raven Unleashed" brand name vs. the real name**
"Raven Unleashed" as a studio name doesn't appear in any of the content until the footer marquee. Everywhere else, "Ashutosh Sharan" is used. This creates an ambiguity about whether this is a personal portfolio or a studio. **Mitigation:** Decide on a clear primary identity: personal portfolio with "Raven Unleashed" as a handle/alias, or a solo studio brand. The hero should use the real name for trust, and "Raven Unleashed" as a project title/brand identity.

---

### Performance Risks

**P1 — Preloader blocking LCP**
A preloader that runs for 2.4 seconds will tank Lighthouse LCP. Lighthouse measures LCP at first contentful paint, which the preloader delays. **Mitigation:** LCP measurement happens on the hidden content *behind* the preloader as well. Ensure the hero headline text is in the DOM behind the preloader from t=0 (just visually hidden), so Lighthouse can index it. Use `visibility:hidden` on the hero, not `display:none`.

**P2 — Bundle size from dual animation libraries**
Framer Motion and GSAP are both in the stack. Framer Motion adds ~25KB gzipped. If GSAP handles all complex animation, Framer Motion should be removed or restricted to layout transitions only (where it adds genuine value over GSAP). **Mitigation:** Audit every Framer Motion usage at the start of Phase 0. Remove any that can be replaced with GSAP without additional code complexity.

**P3 — R3F bundle weight**
`@react-three/fiber` + `@react-three/drei` + Three.js together are ~500KB gzipped. For a single ambient particle field, this is a significant cost. **Mitigation:** Dynamic import with `next/dynamic` and `ssr:false`. The particle field is non-critical; it should never block the LCP render path.

---

### Accessibility Risks

**A1 — Pinned scroll sections on assistive technology**
Screen readers do not understand scroll-triggered reveals. All content inside pinned sections must be accessible without the scroll interaction. **Mitigation:** Every InfraCard's content is fully readable in the DOM, visually hidden state or not. The scroll animation is a presentation layer over complete semantic content.

**A2 — Preloader focus management**
When the preloader exits, focus must move to the correct element (the first interactive element in the hero) and not be trapped or lost. **Mitigation:** On preloader exit, `focus()` the first nav link or the "Let's build" CTA explicitly.

**A3 — Typewriter effect and screen readers**
Live-typing text can be read by screen readers character by character if `aria-live="polite"` is too aggressive. **Mitigation:** Use `aria-live="off"` on the typing container; place the full text in a separate `aria-live="polite"` container that populates only once, at animation end.

---

### Animation Risks

**AN1 — Testimonial pin depth**
Five testimonials × 30vh = 150vh of additional document height. On very long monitors or devices with small scroll ranges, the pacing may feel wrong. **Mitigation:** Use a `clamp()` on the pin scroll distance per testimonial, parameterized by viewport height, so the ratio is consistent across devices.

**AN2 — Horizontal scroll discoverability**
Users do not instinctively scroll horizontally. The "scroll to explore" affordance must be clear and persistent. **Mitigation:** The horizontal scroll section (Systems I Build) must have: a visible scroll indicator, a faint progress bar at the bottom, and the card track must be partially revealed on load (so the right edge of the second card is visible, implying there is more).

---

## 8. FINAL CREATIVE REVIEW

*Judging this blueprint as an Awwwards SOTD submission. What still feels average?*

---

**🔴 The headline needs one more step.**
"SYSTEMS / THAT / OUTLAST / THE BRIEF" is strategically correct but typographically static. The *four words enter independently* but they should *mean something in combination* as they accumulate on screen — the visitor reads the first word, forms a partial meaning, then the second rewrites it, then the third complicates it, then the fourth resolves it. That's the "reading experience" version of a split-text reveal that earns its complexity. Consider the sequence: `SYSTEMS` (ambiguous) → `THAT` (connective, increasing suspense) → `OUTLAST` (the verb that changes everything) → `THE BRIEF` (the punchline). This already works — lean into the timing: add a 150ms extra pause between `OUTLAST` and `THE BRIEF` specifically. That silence is where the visitor finishes your sentence before you do.

**🔴 The ReflectionCoda is underdesigned.**
The line *"Most of these tools were never meant to be showcased. They were built to solve real problems."* is the most differentiated piece of copy on the site. But in the blueprint, it enters as a standard centered display text reveal. It should feel different. One option: the text enters in a large mono typeface (not display — *mono*, like a comment in code), preceded by a `//` comment marker, as if this is a code comment that escaped the codebase and found its way onto the page. The visual language shift (display → mono at this moment) communicates the reflection tonally, not just textually.

**🟡 The About section risks being invisible.**
"No header, no label, it floats between sections" — this is correct as a concept, but in execution, there's a real risk of the paragraph feeling orphaned rather than intentional. The one addition: a very faint `02` in display-scale type (at `opacity: 0.04`, `foreground`) positioned absolutely behind the paragraph text, visible only as a watermark. It anchors the floating paragraph to the page structure without labeling it.

**🟡 The contact headline is still slightly generic.**
"If you have a system that needs building / — or one that needs rebuilding — I'm available." is better than the current version, but it still starts with "if." Starting with the condition weakens the authority. Reframe as a declaration, not an invitation: consider: `"The system you need built — let's talk."` or even just `"Build it right."` followed by the body copy. The shorter the better at this narrative destination.

**🟡 There is no "Raven" moment.**
The name "Raven" appears in the brand (Raven Unleashed, the URL, the footer marquee) but has no moment in the design that expresses what "Raven" *means* as a signal. If it's just a handle with no resonance, it reads as arbitrary. Either give it a moment (even a micro one — perhaps the cursor caret is a small raven feather shape? too literal. Or the `>` terminal prompt is replaced by a subtle raven glyph in certain placements?) or deprioritize the Raven branding and lead fully with "Ashutosh Sharan." Half-committed brand naming is weaker than a strong personal name.

**🟢 What the blueprint gets right:**
- The strategic differentiation is sharp. Systems before Works before Testimonials is the correct narrative sequence.
- The terminal metaphor is specific enough to be a real identity, not just a style.
- The single accent color with complete discipline everywhere else is the correct restraint.
- The honest card treatment for the abandoned component library is the bravest decision in the entire design, and the correct one. Every mid-senior engineer who sees it will trust everything else immediately.
- The choice to *not* copy Luke Baffait's cursor, not to use the generic magnetic circle, and to design a cursor that is *native to the terminal metaphor*, is exactly the differentiation-over-imitation principle that the original teardown analysis recommended.

---

## SIGN-OFF

This blueprint is ready for implementation. Recommended first action: fix the `pranav` identity bug in `data/` files before Phase 0 begins — so nothing built on top of it inherits that error.

Implementation begins at Phase 0. Each phase produces a testable, deployable unit. No phase should be started until its predecessor is verified in the browser.

**Target calibration:** This should feel like a site built by someone who has read the same infrastructure code at 2am that they're now displaying on this page. Not cinematic for cinema's sake. Systems-cinematic — the beauty of a well-architected thing.

---
*Document version: 1.0 · Pre-development approved · Design System v1 applied*