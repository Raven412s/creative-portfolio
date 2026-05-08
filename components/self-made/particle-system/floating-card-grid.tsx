"use client"

import { cn } from "@/lib/utils"
import { useRef, useState } from "react"
import { CardGlowConfig, ParticleCanvas } from "./particle-canvas"

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Configuration for a single card rendered inside {@link FloatingCardGrid}.
 *
 * All positional / visual values are Tailwind class strings so the consumer
 * retains full control without touching internal CSS.
 */
export interface FloatingCardItem {
  /** Unique stable key — used as React `key`. */
  id: string | number

  /**
   * Arbitrary React content rendered inside the card.
   * Receives no extra props; wrap in your own anchor/button as needed.
   */
  content: React.ReactNode

  /**
   * Tailwind `rotate-*` class applied to the card wrapper.
   * Example: `"-rotate-3"`, `"rotate-6"`.
   *
   * @default `"rotate-0"`
   */
  rotation?: string

  /**
   * Tailwind `absolute` positioning classes.
   * Example: `"top-8 left-[10%]"`.
   *
   * Only used in the **desktop** layout — the mobile grid ignores this.
   */
  position?: string

  /**
   * Tailwind width / height classes for the card wrapper.
   * Example: `"w-64 h-72"`.
   *
   * Only used in the **desktop** layout.
   */
  size?: string

  /**
   * Full `rgba(…)` string used for the CSS box-shadow glow overlay
   * rendered on top of the card when the particle system triggers it.
   *
   * Example: `"rgba(59, 130, 246, 0.6)"`.
   */
  glowColor: string

  /**
   * Raw RGB triplet used inside canvas `rgba(R,G,B,α)` calls.
   * **Must not** include the alpha value or surrounding `rgba()`.
   *
   * Example: `"59, 130, 246"`.
   */
  glowColorEdge: string

  /**
   * Additional Tailwind classes applied to the card wrapper `<div>`.
   * Useful for custom z-index, pointer events, etc.
   */
  className?: string
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** @internal Renders the coloured CSS glow halo that appears on card hover. */
function GlowOverlay({
  glowColorEdge,
  visible,
}: {
  glowColorEdge: string
  visible: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 z-19",
        visible ? "opacity-100" : "opacity-0"
      )}
      style={{
        boxShadow: `
          0 0 0 1.5px rgba(${glowColorEdge}, 0.7),
          0 0 16px 6px  rgba(${glowColorEdge}, 0.45),
          0 0 32px 12px rgba(${glowColorEdge}, 0.25),
          0 0 56px 20px rgba(${glowColorEdge}, 0.1)
        `,
      }}
    />
  )
}

// ─── Component props ──────────────────────────────────────────────────────────

/**
 * Props for the {@link FloatingCardGrid} component.
 */
export interface FloatingCardGridProps {
  /**
   * Array of card definitions to render.
   * Must be stable between renders (define outside the component or memoize)
   * so that React does not re-mount the canvas on every render.
   */
  items: FloatingCardItem[]

  /**
   * Breakpoint class at which to switch from the 2-column mobile grid to
   * the absolute-positioned desktop layout.
   *
   * @default `"md"`
   */
  breakpoint?: "sm" | "md" | "lg" | "xl"

  /**
   * Extra Tailwind classes on the desktop `<div>` that wraps all cards.
   * Use this to control `max-w-*` and `h-*`.
   *
   * @default `"max-w-7xl h-[600px]"`
   */
  desktopContainerClassName?: string

  /**
   * Extra Tailwind classes on the mobile grid wrapper `<div>`.
   *
   * @default `"grid-cols-2 gap-4"`
   */
  mobileGridClassName?: string

  /**
   * Fixed height (Tailwind class) for each card in the mobile grid.
   *
   * @default `"h-40"`
   */
  mobileCardHeight?: string

  /**
   * Whether to render the {@link ParticleCanvas} background effect.
   * Set to `false` when embedding the grid on a non-dark background or
   * when performance is a concern.
   *
   * @default `true`
   */
  enableParticles?: boolean

  /**
   * Extra Tailwind classes applied to the `<section>` root element.
   *
   * @default `"bg-[#0a0a0a]"`
   */
  className?: string

  /**
   * Optional children rendered inside the root `<section>` at `z-20`,
   * above the canvas and cards. Useful for headings, overlays, or decorative
   * elements that should sit on top of everything.
   */
  children?: React.ReactNode
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * `FloatingCardGrid` — an animated card layout with an optional GSAP-powered
 * particle system background.
 *
 * ### Layout behaviour
 * - **Mobile** (below `breakpoint`): 2-column CSS grid, no absolute
 *   positioning, no floating animation.
 * - **Desktop** (above `breakpoint`): Each card is `position: absolute`
 *   using the `position` and `size` values from {@link FloatingCardItem}.
 *   Cards continuously float via a CSS keyframe animation with per-card
 *   `animation-delay` and `animation-duration` values so they drift
 *   independently.
 *
 * ### Particle system
 * When `enableParticles` is `true` (default), a {@link ParticleCanvas} is
 * mounted behind the cards. Hovering a card attracts all particles to that
 * card's border and then illuminates it with a coloured glow ring.
 *
 * ### Minimal usage
 * ```tsx
 * import { FloatingCardGrid, FloatingCardItem } from "@/components/FloatingCardGrid"
 *
 * const CARDS: FloatingCardItem[] = [
 *   {
 *     id: "resume",
 *     content: <ResumeCard />,
 *     rotation: "-rotate-3",
 *     position: "top-8 left-[10%]",
 *     size: "w-64 h-72",
 *     glowColor: "rgba(255, 100, 100, 0.6)",
 *     glowColorEdge: "255, 100, 100",
 *   },
 *   // ...more cards
 * ]
 *
 * export default function Page() {
 *   return (
 *     <FloatingCardGrid
 *       items={CARDS}
 *       desktopContainerClassName="max-w-7xl h-[600px]"
 *     />
 *   )
 * }
 * ```
 *
 * ### Animation details
 * - Floating: sinusoidal Y-axis CSS animation, paused on hover.
 * - Particle field: GSAP tweens, clipped behind card areas.
 * - Glow halo: CSS `box-shadow` transition, triggered by particle arrival count.
 *
 * ### Accessibility
 * - The particle canvas is `aria-hidden` and purely decorative.
 * - The glow overlay is `aria-hidden`.
 * - Card content is slotted in as-is — ensure your `content` nodes carry
 *   appropriate roles/labels.
 *
 * @param props - See {@link FloatingCardGridProps}.
 */
export function FloatingCardGrid({
  items,
  breakpoint = "md",
  desktopContainerClassName = "max-w-7xl h-[600px]",
  mobileGridClassName = "grid-cols-2 gap-4",
  mobileCardHeight = "h-40",
  enableParticles = true,
  className,
  children,
}: FloatingCardGridProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>(Array(items.length).fill(null))
  const [glowFlags, setGlowFlags] = useState<boolean[]>(Array(items.length).fill(false))

  /** Stable glow configs derived from items — passed straight to ParticleCanvas. */
  const glowConfigs: CardGlowConfig[] = items.map((item) => ({
    glowColor: item.glowColor,
    glowColorEdge: item.glowColorEdge,
  }))

  const handleGlowChange = (index: number, glowing: boolean) => {
    setGlowFlags((prev) => {
      const next = [...prev]
      next[index] = glowing
      return next
    })
  }

  // Floating animation timing — each card gets a unique duration and delay so
  // they appear to drift independently rather than in lockstep.
  const floatDurations = [6, 7, 5, 8, 6, 7]
  const floatDelays = [0, -2, -4, -1, -3, -5]

  return (
    <section
      className={cn(
        "relative w-full min-h-screen overflow-hidden flex items-center justify-center",
        "bg-[#0a0a0a]",
        className
      )}
    >
      {/* ── Particle canvas (decorative, aria-hidden) ────────────────────── */}
      {enableParticles && (
        <ParticleCanvas
          cardRefs={cardRefs as React.RefObject<(HTMLElement | null)[]>}
          glowConfigs={glowConfigs}
          onGlowChange={handleGlowChange}
          className="absolute inset-0 w-full h-full z-0"
          aria-hidden="true"
        />
      )}

      {/* ── Slot for headings / overlays passed as children ──────────────── */}
      {children}

      {/* ── Desktop layout ───────────────────────────────────────────────── */}
      <div
        className={cn(
          `hidden ${breakpoint}:block`,
          "relative w-full mx-auto",
          "card-floating-grid",
          desktopContainerClassName
        )}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => { cardRefs.current[i] = el }}
            className={cn(
              "card-floating-item",
              `absolute ${item.position ?? ""} ${item.size ?? ""} ${item.rotation ?? ""}`,
              "z-10 hover:z-20",
              "transform transition-all duration-300 ease-in-out",
              "hover:scale-105 hover:rotate-0 cursor-pointer group",
              item.className
            )}
            style={{
              // Inline styles so the animation timing is dynamic without
              // needing arbitrary Tailwind config extensions.
              animationDuration: `${floatDurations[i % floatDurations.length]}s`,
              animationDelay: `${floatDelays[i % floatDelays.length]}s`,
            }}
          >
            {/* CSS glow halo — triggered by particle system */}
            <GlowOverlay
              glowColorEdge={item.glowColorEdge}
              visible={glowFlags[i]}
            />

            {item.content}
          </div>
        ))}
      </div>

      {/* ── Mobile layout ────────────────────────────────────────────────── */}
      <div
        className={cn(
          `${breakpoint}:hidden`,
          "relative z-10 w-full px-4 py-10"
        )}
      >
        <div className={cn("grid", mobileGridClassName)}>
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "relative group cursor-pointer",
                "transition-transform duration-300 active:scale-95",
                mobileCardHeight
              )}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>

      {/* ── Floating keyframe styles ─────────────────────────────────────── */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-18px); }
        }

        .card-floating-grid > .card-floating-item {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .card-floating-grid > .card-floating-item:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}