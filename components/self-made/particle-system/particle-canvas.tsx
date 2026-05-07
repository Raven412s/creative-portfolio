"use client"

import gsap from "gsap"
import { RefObject, useEffect, useRef } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

/** Internal representation of a single particle. */
interface Particle {
  /** Current X position (may be tweened). */
  x: number
  /** Current Y position (may be tweened). */
  y: number
  /** Resting X position particles return to after mouse leaves. */
  originX: number
  /** Resting Y position particles return to after mouse leaves. */
  originY: number
  size: number
  baseSize: number
  opacity: number
  baseOpacity: number
  /** Controls floating speed (radians per tick). */
  speed: number
  /** Random phase offset so particles don't all float in sync. */
  phase: number
  /** True while a mouse is within ATTRACTION_RADIUS of this particle's origin. */
  attracted: boolean
  /** True while the particle is flying toward a hovered card's border. */
  glowing: boolean
  /** True once the particle has arrived at the card border and is ready to emit glow. */
  glowReady?: boolean
  /** Index of the card this particle belongs to, if glowing. */
  cardIndex?: number
}

/** Canvas-relative bounding rect (offsets already applied). */
interface RelativeRect {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

/**
 * Per-card colour config consumed by the particle system.
 * `glowColor` is used for the outer box-shadow glow (e.g. `"rgba(59,130,246,0.6)"`),
 * while `glowColorEdge` is the raw RGB triplet used inside `rgba()` calls on the canvas
 * (e.g. `"59, 130, 246"`).
 */
export interface CardGlowConfig {
  /** Full `rgba(…)` string, e.g. `"rgba(59, 130, 246, 0.6)"`. */
  glowColor: string
  /**
   * Raw RGB triplet **without** alpha — used directly inside `rgba(R,G,B,α)`.
   * Example: `"59, 130, 246"`.
   */
  glowColorEdge: string
}

// ─── Configuration constants ──────────────────────────────────────────────────

/** Total number of particles scattered across the canvas. */
const PARTICLE_COUNT = 500

/**
 * Radius (px) around a particle's *origin* within which the mouse
 * causes it to drift toward the cursor.
 */
const ATTRACTION_RADIUS = 40

/**
 * Maximum displacement (px) toward the cursor when a particle
 * is within ATTRACTION_RADIUS.
 */
const ATTRACTION_DISTANCE = 10

/** Peak-to-peak amplitude (px) of the background floating sine wave. */
const FLOAT_AMPLITUDE = 5

/** Angular frequency of the floating animation (radians per frame-tick). */
const FLOAT_FREQUENCY = 0.02

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Spawn `count` particles distributed randomly over `(width × height)`.
 *
 * @param count  - Number of particles to create.
 * @param width  - Canvas logical width in CSS pixels.
 * @param height - Canvas logical height in CSS pixels.
 * @returns      An array of freshly initialised {@link Particle} objects.
 */
function generateParticles(count: number, width: number, height: number): Particle[] {
  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() * 2 + 0.8
    const opacity = Math.random() * 0.5 + 0.4
    particles.push({
      x, y,
      originX: x,
      originY: y,
      size,
      baseSize: size,
      opacity,
      baseOpacity: opacity,
      speed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 7,
      attracted: false,
      glowing: false,
    })
  }
  return particles
}

/**
 * Sample a uniformly random point on the perimeter of a {@link RelativeRect}.
 *
 * Particles animate toward these points when a card is hovered so they
 * appear to "magnetise" onto the card border.
 *
 * @param r - The bounding rectangle to sample from.
 * @returns   A `{ x, y }` point somewhere on the rect's perimeter.
 */
function borderPoint(r: RelativeRect): { x: number; y: number } {
  const perimeter = 2 * (r.width + r.height)
  const t = Math.random() * perimeter
  if (t < r.width) return { x: r.left + t, y: r.top }
  if (t < r.width + r.height) return { x: r.right, y: r.top + (t - r.width) }
  if (t < 2 * r.width + r.height)
    return { x: r.right - (t - r.width - r.height), y: r.bottom }
  return { x: r.left, y: r.bottom - (t - 2 * r.width - r.height) }
}

/**
 * Returns `true` when the particle is within a `margin`-px band around
 * the canvas — particles far outside need not be drawn.
 *
 * @param p      - Particle to test.
 * @param width  - Canvas logical width.
 * @param height - Canvas logical height.
 * @param margin - Extra pixels outside the canvas boundary to still render.
 */
function isVisible(p: Particle, width: number, height: number, margin = 50): boolean {
  return p.x > -margin && p.x < width + margin && p.y > -margin && p.y < height + margin
}

// ─── Component props ──────────────────────────────────────────────────────────

/**
 * Props for the {@link ParticleCanvas} component.
 */
export interface ParticleCanvasProps {
  /**
   * Refs to the DOM elements that act as "card" targets.
   * The particle system will read their bounding rects to
   * drive the glow / attraction effects.
   *
   * The order must match the order of `glowConfigs`.
   */
  cardRefs: RefObject<(HTMLElement | null)[]>

  /**
   * Per-card colour configuration.
   * Index `i` corresponds to `cardRefs.current[i]`.
   */
  glowConfigs: CardGlowConfig[]

  /**
   * Called when enough particles have arrived at a card's border
   * and the card should display its CSS glow halo.
   *
   * @param index   - Zero-based index of the card.
   * @param glowing - `true` when glow should be shown, `false` when it should hide.
   */
  onGlowChange?: (index: number, glowing: boolean) => void

  /**
   * Extra CSS class names applied to the underlying `<canvas>` element.
   * Use this to position / size the canvas (e.g. `"absolute inset-0 w-full h-full z-0"`).
   */
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * `ParticleCanvas` — a self-contained, GPU-friendly canvas that renders
 * an interactive particle field over a dark background section.
 *
 * ### Features
 * - **Mouse attraction**: particles near the cursor drift gently toward it.
 * - **Card glow**: hovering a card (tracked via `cardRefs`) attracts *all*
 *   particles toward that card's border; once enough arrive a coloured glow
 *   ring is drawn around the card.
 * - **Floating idle animation**: resting particles oscillate on a sine wave
 *   so the field feels alive even without interaction.
 * - **DPR-aware rendering**: respects `devicePixelRatio` (capped at 2×) for
 *   crisp output on HiDPI screens.
 * - **Clip masking**: particles are clipped so they don't render on top of
 *   cards (even-odd fill rule), keeping card text readable.
 *
 * ### Usage
 * ```tsx
 * const cardRefs = useRef<(HTMLDivElement | null)[]>([])
 * const [glowFlags, setGlowFlags] = useState<boolean[]>(Array(cards.length).fill(false))
 *
 * return (
 *   <section className="relative w-full h-screen bg-[#0a0a0a]">
 *     <ParticleCanvas
 *       cardRefs={cardRefs}
 *       glowConfigs={cards.map(c => ({ glowColor: c.glowColor, glowColorEdge: c.glowColorEdge }))}
 *       onGlowChange={(i, v) =>
 *         setGlowFlags(prev => { const n = [...prev]; n[i] = v; return n })
 *       }
 *       className="absolute inset-0 w-full h-full z-0"
 *     />
 *
 *     {cards.map((card, i) => (
 *       <div key={card.id} ref={el => { cardRefs.current[i] = el }} ...>
 *         {// card content}
 *       </div>
 *     ))}
 *   </section>
 * )
 * ```
 *
 * ### Dependencies
 * - `gsap` for smooth tween-based particle movement.
 *
 * @param props - See {@link ParticleCanvasProps}.
 */
export function ParticleCanvas({
  cardRefs,
  glowConfigs,
  onGlowChange,
  className,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true })
    if (!ctx) return

    const CARD_COUNT = glowConfigs.length

    // ── Per-card glow state (ref-based to avoid stale closures) ──────────────
    const glowState = Array(CARD_COUNT).fill(false) as boolean[]
    const activeGlowEdgeColors: Record<number, string> = {}

    // ── Canvas sizing ─────────────────────────────────────────────────────────
    let width = 0
    let height = 0
    let cardRects: (RelativeRect | null)[] = []

    const updateCardRects = () => {
      const canvasRect = canvas.getBoundingClientRect()
      cardRects = (cardRefs.current ?? []).map((card) => {
        if (!card) return null
        const r = card.getBoundingClientRect()
        return {
          left: r.left - canvasRect.left,
          top: r.top - canvasRect.top,
          right: r.right - canvasRect.left,
          bottom: r.bottom - canvasRect.top,
          width: r.width,
          height: r.height,
        }
      })
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      width = rect.width
      height = rect.height
      updateCardRects()
    }

    resize()
    window.addEventListener("resize", resize)

    // ── Particle pool ─────────────────────────────────────────────────────────
    const particles = generateParticles(PARTICLE_COUNT, width, height)

    // ── Mouse tracking ────────────────────────────────────────────────────────
    let mouseX = -9999
    let mouseY = -9999
    let needsMouseUpdate = false

    const processMouseUpdate = () => {
      if (!needsMouseUpdate) return
      const mx = mouseX
      const my = mouseY

      // Process every other frame to reduce CPU pressure.
      if (frameRef.current % 2 === 0 && mx !== -9999) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          if (p.glowing) continue
          const dx = mx - p.originX
          const dy = my - p.originY
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < ATTRACTION_RADIUS) {
            if (!p.attracted) {
              p.attracted = true
              gsap.to(p, {
                x: p.originX + (dx / dist) * ATTRACTION_DISTANCE,
                y: p.originY + (dy / dist) * ATTRACTION_DISTANCE,
                duration: 0.3,
                ease: "power2.out",
                overwrite: true,
              })
            }
          } else if (p.attracted) {
            p.attracted = false
            gsap.to(p, {
              x: p.originX,
              y: p.originY,
              duration: 0.6,
              ease: "elastic.out(1, 0.4)",
              overwrite: true,
            })
          }
        }
      }
      needsMouseUpdate = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
      needsMouseUpdate = true
    }

    const handleMouseLeave = () => {
      mouseX = -9999
      mouseY = -9999
      needsMouseUpdate = false
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        if (p.attracted && !p.glowing) {
          p.attracted = false
          gsap.to(p, {
            x: p.originX,
            y: p.originY,
            duration: 0.6,
            ease: "elastic.out(1, 0.4)",
            overwrite: true,
          })
        }
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    // ── Card hover listeners ──────────────────────────────────────────────────
    const enterHandlers: (() => void)[] = []
    const leaveHandlers: (() => void)[] = []
    const cardReadyCount = new Array(CARD_COUNT).fill(0) as number[]

    ;(cardRefs.current ?? []).forEach((card, idx) => {
      if (!card) return
      let isHovered = false

      const onEnter = () => {
        if (isHovered) return
        isHovered = true
        updateCardRects()
        const r = cardRects[idx]
        if (!r) return

        activeGlowEdgeColors[idx] = glowConfigs[idx].glowColorEdge
        cardReadyCount[idx] = 0

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          if (p.glowing) continue
          const pos = borderPoint(r)
          p.glowing = true
          p.cardIndex = idx
          p.glowReady = false

          gsap.to(p, {
            x: pos.x,
            y: pos.y,
            opacity: 1,
            duration: 1.5 + Math.random() * 1.5,
            ease: "power2.inOut",
            overwrite: true,
            onComplete: () => {
              p.glowReady = true
              cardReadyCount[idx]++
              // Trigger glow halo once at least 10 particles are in position.
              if (!glowState[idx] && cardReadyCount[idx] >= 10) {
                glowState[idx] = true
                onGlowChange?.(idx, true)
              }
            },
          })
        }
      }

      const onLeave = () => {
        if (!isHovered) return
        isHovered = false
        delete activeGlowEdgeColors[idx]
        cardReadyCount[idx] = 0

        if (glowState[idx]) {
          glowState[idx] = false
          onGlowChange?.(idx, false)
        }

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          if (!p.glowing || p.cardIndex !== idx) continue
          p.glowing = false
          p.attracted = false
          p.glowReady = false
          p.cardIndex = undefined
          gsap.to(p, {
            x: p.originX,
            y: p.originY,
            opacity: p.baseOpacity,
            duration: 1.8 + Math.random() * 1.2,
            ease: "power2.inOut",
            overwrite: true,
          })
        }
      }

      card.addEventListener("mouseenter", onEnter)
      card.addEventListener("mouseleave", onLeave)
      enterHandlers.push(onEnter)
      leaveHandlers.push(onLeave)
    })

    // ── Render loop ───────────────────────────────────────────────────────────
    let animationId: number
    let t = 0

    const draw = () => {
      frameRef.current++
      processMouseUpdate()

      if (document.hidden) {
        animationId = requestAnimationFrame(draw)
        return
      }

      ctx.clearRect(0, 0, width, height)

      // Clip particles away from card areas (even-odd rule).
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, width, height)
      for (let i = 0; i < cardRects.length; i++) {
        const r = cardRects[i]
        if (r) ctx.rect(r.left, r.top, r.width, r.height)
      }
      ctx.clip("evenodd")

      // Draw each particle.
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        if (!isVisible(p, width, height)) continue
        if (p.glowReady) continue

        const twinkle = p.glowing ? 0 : Math.sin(t * p.speed * 60 + p.phase) * 0.07
        const alpha = Math.max(0, Math.min(1, p.opacity + twinkle))
        if (alpha < 0.02) continue

        // Only floating (idle) particles receive Y-axis sine offset.
        const offsetY =
          !p.attracted && !p.glowing
            ? Math.sin(t * FLOAT_FREQUENCY + p.phase) * FLOAT_AMPLITUDE
            : 0

        if (p.glowing) {
          const edge =
            p.cardIndex !== undefined
              ? (activeGlowEdgeColors[p.cardIndex] ?? "255,255,255")
              : "255,255,255"
          ctx.beginPath()
          ctx.arc(p.x, p.y + offsetY, p.size * 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${edge}, ${alpha})`
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y + offsetY, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
          ctx.fill()
        }
      }

      ctx.restore()

      // Draw card glow rings over the clip region.
      for (let idx = 0; idx < CARD_COUNT; idx++) {
        if (!glowState[idx]) continue
        const r = cardRects[idx]
        if (!r) continue
        const edge = activeGlowEdgeColors[idx]
        if (!edge) continue

        // Outer diffuse glow.
        ctx.save()
        ctx.shadowBlur = 28
        ctx.shadowColor = `rgba(${edge}, 0.5)`
        ctx.strokeStyle = `rgba(${edge}, 0.15)`
        ctx.lineWidth = 14
        ctx.beginPath()
        ctx.roundRect(r.left, r.top, r.width, r.height, 16)
        ctx.stroke()
        ctx.restore()

        // Inner sharp border.
        ctx.save()
        ctx.shadowBlur = 10
        ctx.shadowColor = `rgba(${edge}, 0.9)`
        ctx.strokeStyle = `rgba(${edge}, 0.7)`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.roundRect(r.left, r.top, r.width, r.height, 16)
        ctx.stroke()
        ctx.restore()
      }

      t++
      animationId = requestAnimationFrame(draw)
    }

    draw()

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      ;(cardRefs.current ?? []).forEach((card, i) => {
        if (!card) return
        card.removeEventListener("mouseenter", enterHandlers[i])
        card.removeEventListener("mouseleave", leaveHandlers[i])
      })
      gsap.killTweensOf(particles)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <canvas ref={canvasRef} className={className} />
}