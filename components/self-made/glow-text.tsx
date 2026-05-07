"use client";

import { useRef, useEffect, useState, useId } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Props for the {@link GlowText} component.
 *
 * A zero-dependency, SVG-powered outlined text block with a cursor-following
 * radial glow effect that is clipped strictly inside each letter's shape.
 * Every visual property is individually overridable; sensible defaults ship
 * out-of-the-box so a bare `<GlowText text="HELLO" />` already looks great.
 *
 * @example
 * // Minimal — lime glow, white stroke, dark bg assumed
 * <GlowText text="UNLEASHED" />
 *
 * @example
 * // Footer hero with explicit sizing
 * <GlowText
 *   text="UNLEASHED"
 *   fontSize="14vw"
 *   fontWeight={900}
 *   letterSpacing="-0.04em"
 * />
 */
export interface GlowTextProps {
  /**
   * The string to render as outlined glowing text.
   *
   * Keep it short — text is rendered at very large sizes and `fontSize`
   * scales with viewport width by default. Long strings will overflow or
   * shrink beyond readability unless you reduce `fontSize`.
   *
   * @example
   * text="UNLEASHED"
   * text="LAUNCH"
   * text="404"
   */
  text: string;

  /**
   * CSS font-size applied to the SVG `<text>` element.
   *
   * Viewport-relative units (`vw`) work best for responsive hero text.
   * Fixed units (`px`, `rem`) suit static or card contexts.
   *
   * @default "14vw"
   *
   * @example
   * fontSize="14vw"   // scales with viewport — recommended for heroes
   * fontSize="10vw"   // slightly smaller, fits more characters
   * fontSize="120px"  // fixed, ignores viewport width
   * fontSize="8rem"   // rem-based, respects user font preferences
   */
  fontSize?: string;

  /**
   * CSS font-weight for the text.
   *
   * Higher weights make the stroke more visible and the glow more dramatic
   * because there is more surface area inside each letter.
   *
   * @default 900
   *
   * @example
   * fontWeight={900}  // Black — maximum impact (recommended)
   * fontWeight={700}  // Bold — balanced
   * fontWeight={400}  // Regular — delicate, thin-stroke effect
   * fontWeight="900"  // String form also accepted
   */
  fontWeight?: number | string;

  /**
   * CSS letter-spacing applied to the SVG text.
   *
   * Negative values tighten tracking, which suits large display text.
   * Positive values spread letters apart — useful for short, punchy words.
   *
   * @default "-0.02em"
   *
   * @example
   * letterSpacing="-0.04em"  // very tight — modern editorial style
   * letterSpacing="-0.02em"  // default — slightly condensed
   * letterSpacing="0"        // normal tracking
   * letterSpacing="0.2em"    // wide — pairs well with fontWeight 400
   */
  letterSpacing?: string;

  /**
   * CSS font-family for the SVG `<text>` elements.
   *
   * Defaults to `"inherit"` so the component picks up whatever font the
   * parent applies (e.g. your Next.js `localFont` or a Tailwind font class).
   * Pass an explicit family to override independently of the page.
   *
   * @default "inherit"
   *
   * @example
   * fontFamily="inherit"                  // picks up parent font (recommended)
   * fontFamily="monospace"                // system monospace stack
   * fontFamily="'Bebas Neue', sans-serif" // custom display font
   * fontFamily="var(--font-heading)"      // CSS variable from your theme
   */
  fontFamily?: string;

  /**
   * Color of the outline stroke drawn around each letterform.
   *
   * Accepts any CSS color string — hex, rgb, rgba, hsl, or named colors.
   * Using `rgba` lets you control opacity without touching `strokeWidth`.
   *
   * @default "rgba(255,255,255,0.55)"
   *
   * @example
   * strokeColor="rgba(255,255,255,0.55)"  // default: semi-transparent white
   * strokeColor="rgba(255,255,255,0.2)"   // ghost-thin outline
   * strokeColor="rgba(255,255,255,1)"     // fully opaque white stroke
   * strokeColor="#1cf3a1"                 // lime — matches default glowColor
   * strokeColor="rgba(200,180,255,0.6)"   // purple tint
   */
  strokeColor?: string;

  /**
   * Width of the outline stroke in SVG user units (≈ px at 1:1 scale).
   *
   * SVG strokes are centered on the path edge — half the width sits inside
   * the glyph and half outside. Increase carefully: thick strokes can
   * occlude fine details in narrow letterforms.
   *
   * @default "1"
   *
   * @example
   * strokeWidth="1"    // hairline — default
   * strokeWidth="1.5"  // slightly bolder, good for heavy fonts
   * strokeWidth="2"    // prominent outline
   * strokeWidth="0.5"  // ultra-thin on hi-DPI displays
   */
  strokeWidth?: string;

  /**
   * Opacity of the semi-transparent white fill painted *inside* each letter
   * via an SVG mask. Creates a frosted-glass depth effect — the text feels
   * slightly lifted off the background without a solid fill color.
   *
   * Values between `0.02` – `0.08` are most effective.
   * Set to `0` for pure outline text with no fill whatsoever.
   *
   * @default 0.04
   *
   * @example
   * fillOpacity={0.04}   // default — subtle lift
   * fillOpacity={0}      // pure outline, no fill
   * fillOpacity={0.1}    // more pronounced inner fill
   * fillOpacity={0.15}   // strong frosted-glass look
   */
  fillOpacity?: number;

  /**
   * Peak color of the radial glow blob that follows the cursor.
   *
   * The component automatically derives a 20%-opacity variant for the outer
   * rim of the radial gradient, so you only need to specify the bright core.
   *
   * **The string must end with a closing `)` (valid `rgba`/`rgb`/`hsl`)**
   * for the auto-dim variant to be computed correctly via string replacement.
   *
   * @default "rgba(28,243,161,0.9)"
   *
   * @example
   * glowColor="rgba(28,243,161,0.9)"   // lime/emerald — default
   * glowColor="rgba(99,102,241,0.9)"   // indigo/violet
   * glowColor="rgba(251,113,133,0.9)"  // rose/pink
   * glowColor="rgba(234,179,8,0.9)"    // amber/gold
   * glowColor="rgba(56,189,248,0.9)"   // sky blue
   * glowColor="rgba(255,255,255,0.8)"  // pure white glow
   */
  glowColor?: string;

  /**
   * Diameter of the circular glow blob in pixels.
   *
   * Larger values spread light across more letters at once.
   * Smaller values create a tight, focused spotlight feel.
   * The blob is always centered on the cursor regardless of size.
   *
   * @default 800
   *
   * @example
   * glowSize={800}   // default — wide ambient wash
   * glowSize={400}   // focused, illuminates 1–2 letters
   * glowSize={1200}  // very broad, full-word saturation
   * glowSize={200}   // pinpoint, cursor-tight spotlight
   */
  glowSize?: number;

  /**
   * CSS `filter: blur(...)` value applied to the glow blob element.
   *
   * More blur = softer, more diffuse/ambient glow.
   * Less blur = sharper edges, more neon-sign-like effect.
   *
   * Combine with `glowSize` for fine control:
   * - Small size + low blur → tight neon
   * - Large size + high blur → painterly ambient wash
   *
   * @default "80px"
   *
   * @example
   * glowBlur="80px"   // default — soft ambient
   * glowBlur="40px"   // tighter, more defined edge
   * glowBlur="120px"  // very diffuse, dreamlike
   * glowBlur="20px"   // neon-sign style, crisp
   * glowBlur="0px"    // raw radial gradient, no blur
   */
  glowBlur?: string;

  /**
   * Toggle the entire glow effect on or off.
   *
   * When `false`, only the base SVG (stroke + translucent fill) renders.
   * The mobile gradient fallback is also suppressed.
   *
   * Useful for:
   * - Reduced-motion user preferences (`prefers-reduced-motion`)
   * - Server-rendered OG image snapshots
   * - Simpler contexts where animation feels out of place
   *
   * @default true
   *
   * @example
   * showGlow={true}   // glow active (default)
   * showGlow={false}  // outline-only, no glow layer
   *
   * @example
   * // Reduced-motion aware usage
   * const prefersReduced = useReducedMotion()
   * <GlowText text="LAUNCH" showGlow={!prefersReduced} />
   */
  showGlow?: boolean;

  /**
   * Bottom color of the linear gradient used as a **mobile fallback** for
   * the hover glow. On touch devices cursor events don't fire, so a static
   * bottom-up gradient gives the text the same chromatic quality without
   * requiring interaction.
   *
   * This gradient is hidden at and above `glowBreakpoint`, where cursor
   * events take over. Set this to match your `glowColor` hue for consistency.
   *
   * @default "#1cf3a1"
   *
   * @example
   * mobileGradientColor="#1cf3a1"  // lime — matches default glowColor
   * mobileGradientColor="#818cf8"  // indigo
   * mobileGradientColor="#fb7185"  // rose
   * mobileGradientColor="#facc15"  // amber
   */
  mobileGradientColor?: string;

  /**
   * Additional Tailwind class names for the outermost wrapper `<div>`.
   *
   * Use for layout overrides — margin, padding, overflow, position context.
   * Avoid overriding `height` here; use the `height` prop instead so the
   * internal SVG layout stays synchronized.
   *
   * @default ""
   *
   * @example
   * className="mb-8"
   * className="mt-0 overflow-visible"
   * className="opacity-80 grayscale hover:grayscale-0 transition-all"
   */
  className?: string;

  /**
   * Explicit height for the component wrapper.
   *
   * By default the component self-measures its `<text>` bounding box via
   * `getBBox()` on mount and on window resize, then sets its height to
   * `bbox.height × 1.1`. Pass an explicit value to skip measurement and
   * hard-code the height — useful to prevent layout shift on first paint.
   *
   * @example
   * height="15vw"   // vw-based — matches default fontSize="14vw" roughly
   * height="160px"  // fixed pixel
   * height="10rem"  // rem-based
   * // omit (default) → auto-measured from SVG text getBBox()
   */
  height?: string;

  /**
   * CSS `mix-blend-mode` applied to the glow overlay SVG layer.
   *
   * Controls how the glow composites with whatever is beneath it
   * (background color, imagery, gradients, other elements).
   *
   * | Value | Best for |
   * |---|---|
   * | `"screen"` | Dark backgrounds — brightens underlying pixels, most common |
   * | `"overlay"` | High-contrast, more dramatic — works light & dark |
   * | `"color-dodge"` | Extreme intensity, blows to white near cursor |
   * | `"lighten"` | Subtle — glow shows only where lighter than background |
   * | `"normal"` | No blend — raw radial gradient, good for debugging |
   *
   * @default "screen"
   *
   * @example
   * blendMode="screen"       // default — dark bg
   * blendMode="overlay"      // more contrast, dramatic
   * blendMode="color-dodge"  // neon-intense
   * blendMode="lighten"      // subtle, conservative
   * blendMode="normal"       // debug — see raw glow shape
   */
  blendMode?: "screen" | "overlay" | "color-dodge" | "lighten" | "normal";

  /**
   * Tailwind responsive prefix at which the desktop glow activates and
   * the mobile gradient fallback is hidden.
   *
   * - **Below** this breakpoint: static gradient fill (no cursor events)
   * - **At / above** this breakpoint: cursor-following glow
   *
   * Match to the point in your layout where the component is large enough
   * for the glow effect to be worthwhile (usually when it spans > 50vw).
   *
   * @default "md"
   *
   * @example
   * glowBreakpoint="sm"  // glow on all but smallest phones
   * glowBreakpoint="md"  // default — tablets and up
   * glowBreakpoint="lg"  // desktop only
   * glowBreakpoint="xl"  // wide desktop only
   */
  glowBreakpoint?: "sm" | "md" | "lg" | "xl";
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * `GlowText` renders large outlined display text with a cursor-following
 * radial glow that is hard-clipped to the interior of each letter using SVG
 * masks — the glow never bleeds outside the letterforms.
 *
 * ---
 *
 * ### How it works
 *
 * Three SVG layers are stacked:
 * 1. **Base** — translucent white fill masked to text shape + outline stroke.
 * 2. **Glow overlay** *(desktop)* — a blurred `div` inside `<foreignObject>`,
 *    masked to the same text shape. Follows cursor via `onMouseMove`.
 * 3. **Mobile fallback** — bottom-up linear gradient masked to text shape.
 *    Visible below `glowBreakpoint`; hidden on desktop.
 *
 * Multiple instances on the same page are safe — each gets unique SVG mask
 * IDs via React's `useId()`.
 *
 * ---
 *
 * ### Quick-start
 * ```tsx
 * import GlowText from "@/components/glow-text"
 *
 * // Bare minimum
 * <GlowText text="UNLEASHED" />
 * ```
 *
 * ### Footer hero (matches original Unleashed design)
 * ```tsx
 * <GlowText
 *   text="UNLEASHED"
 *   fontSize="14vw"
 *   fontWeight={900}
 *   letterSpacing="-0.02em"
 *   strokeColor="rgba(255,255,255,0.55)"
 *   glowColor="rgba(28,243,161,0.9)"
 *   glowSize={800}
 *   blendMode="screen"
 *   glowBreakpoint="md"
 * />
 * ```
 *
 * ### Indigo / violet theme
 * ```tsx
 * <GlowText
 *   text="INFINITE"
 *   glowColor="rgba(99,102,241,0.9)"
 *   mobileGradientColor="#6366f1"
 *   strokeColor="rgba(199,210,254,0.5)"
 * />
 * ```
 *
 * ### Rose / pink theme
 * ```tsx
 * <GlowText
 *   text="DESIRE"
 *   glowColor="rgba(251,113,133,0.9)"
 *   mobileGradientColor="#fb7185"
 *   strokeColor="rgba(254,205,211,0.5)"
 *   blendMode="overlay"
 * />
 * ```
 *
 * ### Tight spotlight — neon-sign feel
 * ```tsx
 * <GlowText
 *   text="FOCUS"
 *   glowSize={300}
 *   glowBlur="20px"
 *   blendMode="color-dodge"
 * />
 * ```
 *
 * ### Minimal — pure outline, no glow
 * ```tsx
 * <GlowText
 *   text="SILENT"
 *   showGlow={false}
 *   strokeColor="rgba(255,255,255,0.2)"
 *   fillOpacity={0}
 * />
 * ```
 *
 * ### Fixed / non-responsive size
 * ```tsx
 * <GlowText
 *   text="FIXED"
 *   fontSize="120px"
 *   height="160px"
 * />
 * ```
 *
 * ### Reduced-motion aware
 * ```tsx
 * const prefersReduced = useReducedMotion()
 * <GlowText text="AWARE" showGlow={!prefersReduced} />
 * ```
 *
 * ### Multiple instances (unique IDs, no collision)
 * ```tsx
 * <GlowText text="FIRST"  glowColor="rgba(28,243,161,0.9)" />
 * <GlowText text="SECOND" glowColor="rgba(99,102,241,0.9)" />
 * <GlowText text="THIRD"  glowColor="rgba(251,113,133,0.9)" />
 * ```
 *
 * ### Custom display font
 * ```tsx
 * <GlowText
 *   text="CUSTOM"
 *   fontFamily="'Bebas Neue', sans-serif"
 *   letterSpacing="0.05em"
 *   fontWeight={400}
 * />
 * ```
 *
 * ### Wide ambient wash (full-word saturation)
 * ```tsx
 * <GlowText
 *   text="AMBIENT"
 *   glowSize={1400}
 *   glowBlur="120px"
 *   glowColor="rgba(56,189,248,0.7)"
 *   mobileGradientColor="#38bdf8"
 * />
 * ```
 *
 * ### Using a CSS variable glow color from your theme
 * ```tsx
 * // In globals.css: --color-brand: 28, 243, 161;
 * <GlowText
 *   text="BRANDED"
 *   glowColor="rgba(var(--color-brand), 0.9)"
 *   mobileGradientColor="rgb(var(--color-brand))"
 * />
 * ```
 */
export default function GlowText({
  text = "UNLEASHED",
  fontSize = "14vw",
  fontWeight = 900,
  letterSpacing = "-0.02em",
  fontFamily = "inherit",
  strokeColor = "rgba(255,255,255,0.55)",
  strokeWidth = "1",
  fillOpacity = 0.04,
  glowColor = "rgba(28,243,161,0.9)",
  glowSize = 800,
  glowBlur = "80px",
  showGlow = true,
  mobileGradientColor = "#1cf3a1",
  className = "",
  height,
  blendMode = "screen",
  glowBreakpoint = "md",
}: GlowTextProps) {
  // Unique IDs so multiple instances don't collide on SVG mask ids
  const uid = useId().replace(/:/g, "");
  const maskId      = `text-mask-${uid}`;
  const maskGlowId  = `text-mask-glow-${uid}`;
  const maskGradId  = `text-mask-grad-${uid}`;
  const gradId      = `grad-mobile-${uid}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef      = useRef<HTMLDivElement>(null);
  const textRef      = useRef<SVGTextElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);

  // ── Measure SVG text height ──────────────────────────────────────────────
  useEffect(() => {
    const measure = () => {
      if (!textRef.current) return;
      try {
        const bbox = textRef.current.getBBox();
        setMeasuredHeight(bbox.height * 1.1);
      } catch {
        /* element not in DOM yet */
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text, fontSize]);

  // ── Glow blob: follow cursor ─────────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !glowRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const half = glowSize / 2;
    glowRef.current.style.left = `${x - half}px`;
    glowRef.current.style.top  = `${y - half}px`;
  };

  const resolvedHeight = height ?? (measuredHeight ? `${measuredHeight}px` : "15vw");

  // Tailwind visibility classes derived from the breakpoint prop
  const glowVisibility   = `hidden ${glowBreakpoint}:block`;
  const mobileVisibility = `block ${glowBreakpoint}:hidden`;

  // Shared SVG text props — keeps the four <text> instances DRY
  const sharedTextProps = {
    x: "50%",
    y: "50%",
    dominantBaseline: "middle"  as const,
    textAnchor:       "middle"  as const,
    fontSize,
    fontWeight,
    fontFamily,
    letterSpacing,
  };

  return (
    <div
      style={{ height: resolvedHeight }}
      className={`relative w-full transition-[height] duration-0 ${className}`}
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => { if (glowRef.current) glowRef.current.style.opacity = "1"; }}
        onMouseLeave={() => { if (glowRef.current) glowRef.current.style.opacity = "0"; }}
        className="relative w-full h-full flex cursor-none overflow-hidden"
      >
        {/* ── Layer 1: base SVG — mask fill + outline stroke ── */}
        <svg className="absolute w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <mask id={maskId}>
              <rect width="100%" height="100%" fill="black" />
              <text ref={textRef} {...sharedTextProps} fill="white">{text}</text>
            </mask>
          </defs>

          {/* Translucent frosted fill clipped to letterforms */}
          <rect
            width="100%" height="100%"
            fill="white" fillOpacity={fillOpacity}
            mask={`url(#${maskId})`}
          />

          {/* Outline stroke */}
          <text
            {...sharedTextProps}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          >
            {text}
          </text>
        </svg>

        {/* ── Layer 2: glow overlay — desktop only ── */}
        {showGlow && (
          <svg
            className={`absolute w-full h-full z-10 pointer-events-none ${glowVisibility}`}
            style={{ mixBlendMode: blendMode }}
          >
            <defs>
              <mask id={maskGlowId}>
                <rect width="100%" height="100%" fill="black" />
                <text {...sharedTextProps} fill="white">{text}</text>
              </mask>
            </defs>
            <foreignObject width="100%" height="100%" mask={`url(#${maskGlowId})`}>
              
              <div className="w-full h-full relative overflow-hidden">
                <div
                  ref={glowRef}
                  className="pointer-events-none absolute opacity-0 transition-opacity duration-300"
                  style={{
                    width:      glowSize,
                    height:     glowSize,
                    filter:     `blur(${glowBlur})`,
                    background: `radial-gradient(circle, ${glowColor} 0%, ${glowColor.replace(/[\d.]+\)$/, "0.2)")} 40%, transparent 70%)`,
                  }}
                />
              </div>
            </foreignObject>
          </svg>
        )}

        {/* ── Layer 3: mobile static gradient fallback ── */}
        <svg className={`absolute w-full h-full pointer-events-none ${mobileVisibility}`}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%"   stopColor={mobileGradientColor} stopOpacity="0.8" />
              <stop offset="40%"  stopColor="white"               stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <mask id={maskGradId}>
              <rect width="100%" height="100%" fill="black" />
              <text {...sharedTextProps} fill="white">{text}</text>
            </mask>
          </defs>
          <rect
            width="100%" height="100%"
            mask={`url(#${maskGradId})`}
            fill={`url(#${gradId})`}
          />
        </svg>
      </div>
    </div>
  );
}