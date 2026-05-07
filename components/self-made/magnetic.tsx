"use client";

import gsap from "gsap";
import clsx from "clsx";
import {
  useRef,
  useEffect,
  useCallback,
  ReactNode,
  CSSProperties,
  RefObject,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Props for the {@link Magnetic} component.
 *
 * `Magnetic` wraps any element and applies a smooth elastic attraction
 * toward the cursor while the pointer is within the element's bounding
 * rectangle. It uses GSAP `quickTo` for buttery, spring-like motion and
 * is fully inert on touch devices.
 *
 * @example
 * // Minimal usage
 * <Magnetic>
 *   <button>Hover me</button>
 * </Magnetic>
 *
 * @example
 * // Custom strength + slower spring
 * <Magnetic strength={0.6} duration={1.4} ease="elastic.out(1, 0.2)">
 *   <MyIcon />
 * </Magnetic>
 */
export interface MagneticProps {
  /**
   * The element(s) to magnetize. Can be a single element or a fragment.
   *
   * The direct child is wrapped in a `<div>` that GSAP translates. All
   * pointer events are preserved on the child — clicks, hover styles, and
   * focus states all work normally.
   *
   * @example
   * children={<button>Click me</button>}
   * children={<a href="/about">About</a>}
   * children={<MyCustomIcon />}
   */
  children: ReactNode;

  /**
   * How strongly the element is pulled toward the cursor.
   *
   * `1.0` means the element moves pixel-for-pixel with the cursor offset
   * from center. Values below `1.0` dampen the effect; above `1.0`
   * amplify it beyond the cursor position (rubber-band feel).
   *
   * Typical range: `0.2` – `0.8` for subtle UI; `1.0`+ for dramatic
   * hero elements.
   *
   * @default 0.4
   *
   * @example
   * strength={0.4}   // default — balanced, natural
   * strength={0.2}   // very subtle — barely noticeable shift
   * strength={0.6}   // pronounced — good for large interactive targets
   * strength={1.0}   // full pull — cursor locks element to pointer
   * strength={1.5}   // overshoot — element moves past cursor (dramatic)
   */
  strength?: number;

  /**
   * GSAP animation duration in seconds for the spring-back and follow motion.
   *
   * Higher values make the element feel heavier and more elastic.
   * Lower values make it snappier and more immediate.
   *
   * @default 1
   *
   * @example
   * duration={1}     // default — elastic spring
   * duration={0.5}   // snappy, quick response
   * duration={1.6}   // slow, heavy, exaggerated elastic
   * duration={0.3}   // nearly immediate — barely any spring
   */
  duration?: number;

  /**
   * GSAP ease string applied to both the follow and the spring-back motion.
   *
   * The default `"elastic.out(1, 0.3)"` gives a satisfying overshoot on
   * both enter and leave. You can use any GSAP ease string here.
   *
   * @default "elastic.out(1, 0.3)"
   *
   * @example
   * ease="elastic.out(1, 0.3)"   // default — bouncy spring
   * ease="elastic.out(1, 0.5)"   // tighter spring, less overshoot
   * ease="power3.out"             // smooth deceleration, no overshoot
   * ease="expo.out"               // fast start, very smooth settle
   * ease="back.out(2)"            // slight overshoot, no oscillation
   * ease="sine.inOut"             // gentle, organic feel
   */
  ease?: string;

  /**
   * Whether the magnetic effect is active.
   *
   * When `false`, the element renders normally with no GSAP listeners
   * and no transform applied. The component re-initializes automatically
   * if this prop changes from `false` to `true`.
   *
   * Useful for:
   * - Disabling on low-power/battery-saver mode
   * - Pausing during page transitions
   * - A/B testing the effect
   *
   * @default true
   *
   * @example
   * enabled={true}   // active (default)
   * enabled={false}  // no effect, renders children as-is
   *
   * @example
   * // Disable during route transition
   * const isTransitioning = usePageTransition()
   * <Magnetic enabled={!isTransitioning}>
   *   <NavLink href="/work">Work</NavLink>
   * </Magnetic>
   */
  enabled?: boolean;

  /**
   * Multiplier applied to the **X axis** displacement only.
   *
   * Use when you want asymmetric attraction — e.g. full horizontal pull
   * but reduced vertical pull for wide, short elements like pill buttons.
   *
   * Final X offset = `(cursorX - centerX) * strength * xFactor`
   *
   * @default 1
   *
   * @example
   * xFactor={1}     // default — same as strength
   * xFactor={0.5}   // horizontal pull halved relative to vertical
   * xFactor={1.5}   // horizontal pull amplified
   * xFactor={0}     // locks X axis — only vertical movement
   */
  xFactor?: number;

  /**
   * Multiplier applied to the **Y axis** displacement only.
   *
   * Use when you want asymmetric attraction — e.g. full vertical pull
   * but reduced horizontal pull for tall, narrow elements like icon buttons.
   *
   * Final Y offset = `(cursorY - centerY) * strength * yFactor`
   *
   * @default 1
   *
   * @example
   * yFactor={1}     // default — same as strength
   * yFactor={0.5}   // vertical pull halved relative to horizontal
   * yFactor={0}     // locks Y axis — only horizontal movement
   * yFactor={1.5}   // vertical pull amplified
   */
  yFactor?: number;

  /**
   * Called when the cursor enters the magnetic element's bounds.
   *
   * Receives the raw `MouseEvent`. Use for coordinating custom cursor
   * state changes, sound effects, or other side effects.
   *
   * @example
   * onEnter={(e) => setCursorVariant("magnetic")}
   * onEnter={() => setIsHovered(true)}
   */
  onEnter?: (e: MouseEvent) => void;

  /**
   * Called when the cursor leaves the magnetic element's bounds.
   *
   * The element has already begun its spring-back animation by the time
   * this fires. Use to reset custom cursor state or other side effects.
   *
   * @example
   * onLeave={(e) => setCursorVariant("default")}
   * onLeave={() => setIsHovered(false)}
   */
  onLeave?: (e: MouseEvent) => void;

  /**
   * Called on every `mousemove` event while the cursor is inside the
   * element's bounds.
   *
   * Receives the normalized offset as `{ x, y }` — values in the range
   * roughly `[-0.5, 0.5]` relative to the element's width/height. Use
   * for driving secondary effects like parallax layers, lighting, or tilt.
   *
   * @example
   * onMove={({ x, y }) => setTilt({ rotateX: y * 20, rotateY: -x * 20 })}
   * onMove={({ x, y }) => moveShadow(x, y)}
   */
  onMove?: (offset: { x: number; y: number }) => void;

  /**
   * Extra Tailwind class names applied to the outer wrapper `<div>`.
   *
   * The wrapper is `inline-block` by default. Override to `block`,
   * `flex`, etc. as needed. Avoid overriding `position` or `transform`
   * as these are managed by GSAP.
   *
   * @default ""
   *
   * @example
   * className="block w-full"
   * className="flex-1"
   * className="relative z-10"
   */
  className?: string;

  /**
   * Inline styles applied to the outer wrapper `<div>`.
   *
   * Avoid setting `transform` or `translate` here — GSAP owns those
   * properties and will overwrite them.
   *
   * @example
   * style={{ touchAction: "none" }}
   * style={{ willChange: "transform" }}
   */
  style?: CSSProperties;

  /**
   * A ref forwarded to the outer wrapper `<div>` managed by GSAP.
   *
   * Useful when you need direct DOM access to the animated element from
   * a parent — e.g. to measure its position or trigger external animations.
   *
   * Note: do **not** apply transforms via this ref while the magnetic
   * effect is active, as GSAP will overwrite them.
   *
   * @example
   * const ref = useRef<HTMLDivElement>(null)
   * <Magnetic wrapperRef={ref}>
   *   <button>Hello</button>
   * </Magnetic>
   */
  wrapperRef?: RefObject<HTMLDivElement>;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * `Magnetic` wraps any element and applies smooth, elastic cursor-following
 * motion using GSAP `quickTo`. The element springs back to its origin when
 * the cursor leaves. Completely inert on touch devices — no listeners are
 * attached and no transforms are applied.
 *
 * ---
 *
 * ### How it works
 *
 * On `mousemove`, the cursor offset from the element's center is computed
 * and multiplied by `strength` (× `xFactor` / `yFactor` per axis). GSAP
 * `quickTo` drives the `x` / `y` CSS transform with an elastic ease,
 * giving the element a satisfying spring quality. On `mouseleave`, both
 * axes animate back to `0`.
 *
 * SSR-safe: the `window` object and GSAP listeners are only accessed
 * inside `useEffect`, so the component renders correctly on the server.
 *
 * Touch-safe: a `(window.matchMedia("(pointer: coarse)"))` check at
 * effect time (not just mount) means the effect is skipped on touch
 * devices even when `enabled` is `true`.
 *
 * ---
 *
 * ### Minimal usage
 * ```tsx
 * import { Magnetic } from "@/components/magnetic"
 *
 * <Magnetic>
 *   <button>Hover me</button>
 * </Magnetic>
 * ```
 *
 * ### Navigation links (subtle)
 * ```tsx
 * <Magnetic strength={0.25} duration={0.8}>
 *   <a href="/work" className="text-sm font-medium">Work</a>
 * </Magnetic>
 * ```
 *
 * ### Hero CTA button (pronounced)
 * ```tsx
 * <Magnetic strength={0.55} ease="elastic.out(1, 0.25)">
 *   <Button variant="pseudo">Get started</Button>
 * </Magnetic>
 * ```
 *
 * ### Icon button (full pull, no overshoot)
 * ```tsx
 * <Magnetic strength={0.7} ease="power3.out" duration={0.6}>
 *   <IconButton icon={<ArrowRight />} />
 * </Magnetic>
 * ```
 *
 * ### Asymmetric axis — wide pill button (more X, less Y)
 * ```tsx
 * <Magnetic strength={0.5} xFactor={1.2} yFactor={0.4}>
 *   <button className="px-8 py-3 rounded-full">Subscribe</button>
 * </Magnetic>
 * ```
 *
 * ### Coordinated with a custom cursor
 * ```tsx
 * const { setCursorState } = useCursor()
 *
 * <Magnetic
 *   strength={0.45}
 *   onEnter={() => setCursorState("magnetic")}
 *   onLeave={() => setCursorState("default")}
 * >
 *   <button>Contact</button>
 * </Magnetic>
 * ```
 *
 * ### Driving a secondary tilt effect via onMove
 * ```tsx
 * const [tilt, setTilt] = useState({ x: 0, y: 0 })
 *
 * <Magnetic
 *   strength={0.4}
 *   onMove={({ x, y }) => setTilt({ x: y * 20, y: -x * 20 })}
 * >
 *   <div style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
 *     <Card />
 *   </div>
 * </Magnetic>
 * ```
 *
 * ### Conditionally disabled (page transitions, low-power mode)
 * ```tsx
 * const isTransitioning = usePageTransition()
 * <Magnetic enabled={!isTransitioning} strength={0.4}>
 *   <NavLink href="/about">About</NavLink>
 * </Magnetic>
 * ```
 *
 * ### With forwarded ref for external measurement
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null)
 * <Magnetic wrapperRef={ref} strength={0.3}>
 *   <Logo />
 * </Magnetic>
 * ```
 *
 * ### Multiple instances — each manages its own GSAP timeline
 * ```tsx
 * {navLinks.map(link => (
 *   <Magnetic key={link.href} strength={0.3}>
 *     <a href={link.href}>{link.label}</a>
 *   </Magnetic>
 * ))}
 * ```
 *
 * ### Stacking inside a Magnetic (outer moves, inner stays)
 * ```tsx
 * // Outer magnetic moves the whole card; inner keeps icon still
 * <Magnetic strength={0.3}>
 *   <div className="card">
 *     <Magnetic strength={0} enabled={false}>
 *       <Icon />
 *     </Magnetic>
 *   </div>
 * </Magnetic>
 * ```
 */
export function Magnetic({
  children,
  strength = 0.4,
  duration = 1,
  ease = "elastic.out(1, 0.3)",
  enabled = true,
  xFactor = 1,
  yFactor = 1,
  onEnter,
  onLeave,
  onMove,
  className,
  style,
  wrapperRef,
}: MagneticProps) {
  const internalRef = useRef<HTMLDivElement>(null);

  // Prefer the forwarded ref if provided, otherwise use our internal one
  const elementRef = (wrapperRef ?? internalRef) as RefObject<HTMLDivElement>;

  // Stable callbacks — avoids re-registering listeners on every render
  const onEnterRef = useRef(onEnter);
  const onLeaveRef = useRef(onLeave);
  const onMoveRef  = useRef(onMove);

  useEffect(() => { onEnterRef.current = onEnter; }, [onEnter]);
  useEffect(() => { onLeaveRef.current = onLeave; }, [onLeave]);
  useEffect(() => { onMoveRef.current  = onMove;  }, [onMove]);

  const strengthRef  = useRef(strength);
  const xFactorRef   = useRef(xFactor);
  const yFactorRef   = useRef(yFactor);

  useEffect(() => { strengthRef.current = strength; }, [strength]);
  useEffect(() => { xFactorRef.current  = xFactor;  }, [xFactor]);
  useEffect(() => { yFactorRef.current  = yFactor;  }, [yFactor]);

  // Keep a handle on GSAP quickTo functions so we can kill them on cleanup
  const xToRef = useRef<gsap.QuickToFunc | null>(null);
  const yToRef = useRef<gsap.QuickToFunc | null>(null);

  const reset = useCallback(() => {
    xToRef.current?.(0);
    yToRef.current?.(0);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    // Touch devices: coarse pointer means no hover, skip entirely
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches
    ) return;

    // Initialise GSAP quick tweens — created once per mount / enabled change
    xToRef.current = gsap.quickTo(element, "x", { duration, ease });
    yToRef.current = gsap.quickTo(element, "y", { duration, ease });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;

      const rawX = e.clientX - cx;
      const rawY = e.clientY - cy;

      xToRef.current!(rawX * strengthRef.current * xFactorRef.current);
      yToRef.current!(rawY * strengthRef.current * yFactorRef.current);

      if (onMoveRef.current) {
        onMoveRef.current({
          x: rawX / rect.width,
          y: rawY / rect.height,
        });
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      onEnterRef.current?.(e);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      reset();
      onLeaveRef.current?.(e);
    };

    element.addEventListener("mousemove",  handleMouseMove);
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove",  handleMouseMove);
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);

      // Hard-reset position on unmount / disabled toggle
      gsap.killTweensOf(element);
      gsap.set(element, { x: 0, y: 0 });
    };
  }, [enabled, duration, ease, reset, elementRef]);

  return (
    <div
      ref={elementRef as RefObject<HTMLDivElement>}
      className={clsx("inline-block", className)}
      style={{ touchAction: "none", willChange: "transform", ...style }}
    >
      {children}
    </div>
  );
}