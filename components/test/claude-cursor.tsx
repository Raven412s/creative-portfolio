/* eslint-disable react-hooks/refs */
"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
  isValidElement,
  type ReactNode,
  type CSSProperties,
  type JSX,
  type MouseEvent as ReactMouseEvent,
} from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export type CursorState =
  | "default"
  | "pointer"
  | "text"
  | "icon"
  | "hidden"
  | "exclusion"
  | "media";

type EffectiveState = CursorState | "active";

export interface CursorConfig {
  speed:           number;
  skewing:         number;
  skewingText:     number;
  skewingDelta:    number;
  skewingDeltaMax: number;
}

export interface CursorElementOptions {
  state?: CursorState;
  /**
   * Short text label rendered inside the circle.
   * @example "View" | "Play" | "Drag"
   */
  text?: string;
  /**
   * Icon rendered inside the cursor circle.
   * Accepts a plain string glyph OR any React element (Lucide, SVG, emoji…).
   *
   * @example string glyph
   * icon="↗"
   *
   * @example Lucide React icon
   * import { ArrowUpRight } from 'lucide-react'
   * icon={<ArrowUpRight size={16} />}
   *
   * @example any SVG / emoji ReactNode
   * icon={<MyCustomSvg />}
   * icon="🚀"
   */
  icon?: ReactNode;
  /** Image URL shown as a circular preview */
  mediaSrc?: string;
}

export interface CursorContextValue {
  setState:    (s: CursorState, opts?: Omit<CursorElementOptions, "state">) => void;
  resetState:  () => void;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  isActive:    boolean;
}

export interface CursorElementHandlers {
  onMouseEnter: (e: ReactMouseEvent) => void;
  onMouseLeave: (e: ReactMouseEvent) => void;
  onMouseDown:  (e: ReactMouseEvent) => void;
  onMouseUp:    (e: ReactMouseEvent) => void;
}

interface FrameCallback {
  (x: number, y: number, skewXDeg: number, skewYDeg: number, visible: boolean): void;
}

interface Vec2 { x: number; y: number }

// ─────────────────────────────────────────────────────────────────────────────
// Internal LabelPayload — discriminated union keeps text vs icon logic clean
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Stored in Provider state.
 * - "text"  → plain string, small uppercase font
 * - "icon"  → ReactNode (Lucide element, string glyph, SVG…)
 * - "none"  → nothing to render
 */
type LabelPayload =
  | { kind: "text"; content: string   }
  | { kind: "icon"; content: ReactNode }
  | { kind: "none"                    };

function resolveLabelPayload(
  opts: Omit<CursorElementOptions, "state">
): LabelPayload {
  // icon wins over text if provided
  if (opts.icon !== undefined && opts.icon !== null && opts.icon !== "") {
    return { kind: "icon", content: opts.icon };
  }
  if (opts.text) {
    return { kind: "text", content: opts.text };
  }
  return { kind: "none" };
}

function hasLabel(p: LabelPayload): p is Exclude<LabelPayload, { kind: "none" }> {
  return p.kind !== "none";
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: CursorConfig = {
  speed:           0.2,
  skewing:         2,
  skewingText:     2.5,
  skewingDelta:    0.004,
  skewingDeltaMax: 0.15,
};

const SCALE_MAP: Record<EffectiveState, number> = {
  default:   0.5,
  pointer:   0.3,
  text:      1.7,
  icon:      1.5,
  hidden:    0,
  exclusion: 0.5,
  media:     0.2,
  active:    0.15,
};

const ACTIVE_OVERRIDE_STATES: CursorState[] = ["default", "pointer", "text", "icon"];

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const CursorContext = createContext<CursorContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// CursorProvider
// ─────────────────────────────────────────────────────────────────────────────

export interface CursorProviderProps {
  children: ReactNode;
  config?:  Partial<CursorConfig>;
}

export function CursorProvider({
  children,
  config = {},
}: CursorProviderProps): JSX.Element {
  const [cursorState, setCursorState] = useState<CursorState>("exclusion");
  const [label,       setLabel]       = useState<LabelPayload>({ kind: "none" });
  const [mediaSrc,    setMediaSrc]    = useState<string>("");
  const [isActive,    setIsActive]    = useState<boolean>(false);

  const cfg: CursorConfig = { ...DEFAULT_CONFIG, ...config };

  const setState = useCallback<CursorContextValue["setState"]>(
    (state, opts = {}) => {
      setCursorState(state ?? "default");
      setLabel(resolveLabelPayload(opts));
      setMediaSrc(opts.mediaSrc ?? "");
    },
    []
  );

  const resetState = useCallback<CursorContextValue["resetState"]>(() => {
    setCursorState("exclusion");
    setLabel({ kind: "none" });
    setMediaSrc("");
  }, []);

  return (
    <CursorContext.Provider value={{ setState, resetState, setIsActive, isActive }}>
      {children}
      <MouseFollower
        cursorState={cursorState}
        label={label}
        mediaSrc={mediaSrc}
        isActive={isActive}
        config={cfg}
      />
    </CursorContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// useCursor
// ─────────────────────────────────────────────────────────────────────────────

export function useCursor(): CursorContextValue {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursor must be used inside <CursorProvider>");
  return ctx;
}

// ─────────────────────────────────────────────────────────────────────────────
// useCursorElement
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Spread the returned handlers onto any hoverable element to activate cursor states.
 *
 * @example  string glyph
 * const h = useCursorElement({ state: 'icon', icon: '↗' })
 *
 * @example  Lucide React icon
 * import { Play } from 'lucide-react'
 * const h = useCursorElement({ state: 'icon', icon: <Play size={16} /> })
 *
 * @example  text label
 * const h = useCursorElement({ state: 'text', text: 'View' })
 *
 * @example  media preview
 * const h = useCursorElement({ state: 'media', mediaSrc: '/thumb.jpg' })
 */
export function useCursorElement(
  options: CursorElementOptions = {}
): CursorElementHandlers {
  const { setState, resetState, setIsActive } = useCursor();
  return {
    onMouseEnter: () => setState(options.state ?? "pointer", options),
    onMouseLeave: () => resetState(),
    onMouseDown:  () => setIsActive(true),
    onMouseUp:    () => setIsActive(false),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// useMouseFollower — RAF loop (lerp + velocity skew)
// ─────────────────────────────────────────────────────────────────────────────

interface UseMouseFollowerReturn {
  onFrameRef: React.MutableRefObject<FrameCallback | null>;
  stateRef:   React.MutableRefObject<CursorState>;
}

function useMouseFollower(config: CursorConfig): UseMouseFollowerReturn {
  const rafRef     = useRef<number | null>(null);
  const mouseRef   = useRef<Vec2>({ x: -400, y: -400 });
  const posRef     = useRef<Vec2>({ x: -400, y: -400 });
  const skewRef    = useRef<Vec2>({ x: 0,    y: 0    });
  const visRef     = useRef<boolean>(false);
  const stateRef   = useRef<CursorState>("default");
  const onFrameRef = useRef<FrameCallback | null>(null);

  const lerp  = (a: number, b: number, t: number): number => a + (b - a) * t;
  const clamp = (v: number, mn: number, mx: number): number => Math.min(Math.max(v, mn), mx);

  const getSkewing = useCallback(
    (s: CursorState): number => {
      if (s === "text" || s === "icon") return config.skewingText;
      if (s === "hidden") return 0;
      return config.skewing;
    },
    [config]
  );

  useEffect(() => {
    const onMove = (e: MouseEvent): void => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!visRef.current) {
        posRef.current = { x: e.clientX, y: e.clientY };
        visRef.current = true;
      }
    };
    const onLeave = (): void => { visRef.current = false; };
    const onEnter = (): void => { visRef.current = true; };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  useEffect(() => {
    const loop = (): void => {
      const { x: mx, y: my } = mouseRef.current;
      const pos  = posRef.current;
      const skew = skewRef.current;

      pos.x = lerp(pos.x, mx, config.speed);
      pos.y = lerp(pos.y, my, config.speed);

      const velX = mx - pos.x;
      const velY = my - pos.y;
      const sf   = getSkewing(stateRef.current);

      const tSkX = clamp(velX * config.skewingDelta * sf, -config.skewingDeltaMax, config.skewingDeltaMax);
      const tSkY = clamp(velY * config.skewingDelta * sf, -config.skewingDeltaMax, config.skewingDeltaMax);
      skew.x = lerp(skew.x, tSkX, 0.15);
      skew.y = lerp(skew.y, tSkY, 0.15);

      // ×90 maps radian-scale (0–0.15) → visible degrees (0–13.5°)
      onFrameRef.current?.(pos.x, pos.y, skew.x * 90, skew.y * 90, visRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [config, getSkewing]);

  return { onFrameRef, stateRef };
}

// ─────────────────────────────────────────────────────────────────────────────
// MouseFollower — cursor DOM
// ─────────────────────────────────────────────────────────────────────────────

interface MouseFollowerProps {
  cursorState: CursorState;
  label:       LabelPayload;
  mediaSrc:    string;
  isActive:    boolean;
  config:      CursorConfig;
}

function MouseFollower({
  cursorState, label, mediaSrc, isActive, config,
}: MouseFollowerProps): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const { onFrameRef, stateRef } = useMouseFollower(config);

  // Sync RAF state ref without a re-render
  useEffect(() => { stateRef.current = cursorState; }, [cursorState, stateRef]);

  // RAF writes directly to DOM — no React overhead on every frame
  onFrameRef.current = (x, y, skewX, skewY, visible): void => {
    if (!rootRef.current) return;
    rootRef.current.style.opacity   = visible ? "1" : "0";
    rootRef.current.style.transform =
      `translate3d(${x}px,${y}px,0) skewX(${skewX}deg) skewY(${skewY}deg)`;
  };

  // ── Derived values ─────────────────────────────────────────────────────
  const effectiveState: EffectiveState =
    isActive && ACTIVE_OVERRIDE_STATES.includes(cursorState) ? "active" : cursorState;

  const scale:        number  = SCALE_MAP[effectiveState] ?? 0.2;
  const isExclusion:  boolean = cursorState === "exclusion";
  const isMedia:      boolean = cursorState === "media";
  const labelVisible: boolean =
    (cursorState === "text" || cursorState === "icon") && hasLabel(label);

  // ── Font / size for the label slot ─────────────────────────────────────
  // • Lucide element (isValidElement) → size driven by the element itself; slot = 18px
  // • Short string glyph (≤2 chars)   → 16px  (glyphs look best bigger)
  // • Multi-char text label (>2 chars) → 9px uppercase
  const labelFontSize: number = (() => {
    if (!hasLabel(label)) return 9;
    if (label.kind === "icon" && isValidElement(label.content)) return 18;
    if (label.kind === "icon") return (label.content as string).length > 2 ? 9 : 16;
    return label.content.length > 2 ? 9 : 16;
  })();

  // ── Build renderable label node ────────────────────────────────────────
  const labelNode: ReactNode = (() => {
    if (!hasLabel(label)) return null;

    if (label.kind === "icon") {
      return isValidElement(label.content) ? (
        // Lucide / ReactNode — wrap in flex to center and allow currentColor inheritance
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {label.content}
        </span>
      ) : (
        label.content  // plain string glyph
      );
    }

    return label.content;  // text string
  })();

  // ── Styles ─────────────────────────────────────────────────────────────
  const rootStyle: CSSProperties = {
    position:      "fixed",
    top:           0,
    left:          0,
    zIndex:        9999999,
    opacity:       0,
    contain:       "layout style size",
    direction:     "ltr",
    pointerEvents: "none",
    userSelect:    "none",
    willChange:    "transform",
    mixBlendMode:  isExclusion ? "difference" : "normal",
    color:         "#f0ece4",
    transition:    "opacity .3s, color .4s",
  };

  const circleStyle: CSSProperties = {
    position:     "absolute",
    width:        48,
    height:       48,
    top:          -24,
    left:         -24,
    borderRadius: "50%",
    background:   isExclusion ? "#ffffff" : "#1cf3a105",
    transform:    `scale(${scale})`,
    opacity: cursorState === "text" || cursorState === "icon" ? 0.65 : 1,
    transition:   `transform ${isActive ? ".1s" : ".25s"} ease-in-out, opacity .1s, background .4s`,
  };

  const labelStyle: CSSProperties = {
    position:       "absolute",
    width:          36,
    height:         36,
    top:            -18,
    left:           -18,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    textAlign:      "center",
    fontSize:       labelFontSize,
    // Lucide icons use currentColor — this ensures they contrast with the circle
    color:          isExclusion ? "#fff" : "#0e0e0e",
    fontFamily:     "'Helvetica Neue', sans-serif",
    fontWeight:     700,
    letterSpacing:  ".08em",
    textTransform:  "uppercase",
    lineHeight:     1.2,
    opacity:        labelVisible ? 1 : 0,
    transform:      labelVisible ? "scale(1) rotate(0deg)" : "scale(0) rotate(10deg)",
    transition:     "opacity .4s, transform .3s",
    pointerEvents:  "none",
    whiteSpace:     "nowrap",
  };

  const mediaBoxStyle: CSSProperties = {
    position:     "relative",
    width:        "100%",
    height:       "100%",
    overflow:     "hidden",
    borderRadius: "50%",
    padding:      1,
    opacity:      isMedia ? 1 : 0,
    transform:    isMedia ? "scale(0.696) translateZ(0)" : "scale(0) translateZ(0)",
    transition:   "transform .4s, opacity .4s",
  };

  return (
    <>
      <style>{`html, *, *:hover { cursor: none !important; }`}</style>

      <div ref={rootRef} style={rootStyle} className="hidden md:block">
        {/* Circle */}
        <div style={circleStyle} />

        {/* Label: text string, glyph, or Lucide/ReactNode icon */}
        <div style={labelStyle}>{labelNode}</div>

        {/* Media circle preview */}
        <div style={{ position:"absolute", width:400, height:400, top:-200, left:-200, pointerEvents:"none" }}>
          <div style={mediaBoxStyle}>
            {mediaSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mediaSrc} alt=""
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo Component Prop Types
// ─────────────────────────────────────────────────────────────────────────────

interface NavLinkProps    { children: ReactNode; href?: string }
interface StateCardProps  { tag: string; title: string; desc: string; state: CursorState; text?: string; icon?: ReactNode }
interface BigLinkProps    { children: ReactNode }
interface MediaCardProps  { label: string; gradient: string; imgSrc: string }
interface BtnProps        { children: ReactNode; state?: CursorState; text?: string; icon?: ReactNode; filled?: boolean }
interface SLabelProps     { n: string; children: ReactNode }

// ─────────────────────────────────────────────────────────────────────────────
// Demo Components
// ─────────────────────────────────────────────────────────────────────────────

export function NavLink({ children, href = "#" }: NavLinkProps): JSX.Element {
  const [hov, setHov] = useState<boolean>(false);
  const h = useCursorElement({ state: "pointer" });
  return (
    <a href={href} {...h}
      onMouseEnter={(e) => { setHov(true);  h.onMouseEnter(e); }}
      onMouseLeave={(e) => { setHov(false); h.onMouseLeave(e); }}
      style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:11, letterSpacing:".14em",
               textTransform:"uppercase", textDecoration:"none",
               color:hov?"#f0ece4":"#555", transition:"color .2s" }}
    >{children}</a>
  );
}

export function StateCard({ tag, title, desc, state, text, icon }: StateCardProps): JSX.Element {
  const [hov, setHov] = useState<boolean>(false);
  const h = useCursorElement({ state, text, icon });
  return (
    <div {...h}
      onMouseEnter={(e) => { setHov(true);  h.onMouseEnter(e); }}
      onMouseLeave={(e) => { setHov(false); h.onMouseLeave(e); }}
      style={{ background:hov?"#1c1c1c":"#141414", padding:"44px 32px",
               display:"flex", flexDirection:"column", gap:14, transition:"background .3s" }}
    >
      <span style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:9, letterSpacing:".28em", textTransform:"uppercase", color:"#444" }}>{tag}</span>
      <h3 style={{ fontSize:24, letterSpacing:"-.02em", fontWeight:400, margin:0 }}>{title}</h3>
      <p style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:12, color:"#666", lineHeight:1.65, margin:0 }}>{desc}</p>
    </div>
  );
}

export function BigLink({ children }: BigLinkProps): JSX.Element {
  const [hov, setHov] = useState<boolean>(false);
  const h = useCursorElement({ state: "pointer" });
  return (
    <a href="#" {...h}
      onMouseEnter={(e) => { setHov(true);  h.onMouseEnter(e); }}
      onMouseLeave={(e) => { setHov(false); h.onMouseLeave(e); }}
      style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
               fontSize:"clamp(28px,4.5vw,56px)", letterSpacing:"-.03em", lineHeight:1.05,
               textDecoration:"none", color:hov?"#666":"#f0ece4",
               padding:"18px 0", borderBottom:"1px solid #1a1a1a", transition:"color .3s" }}
    >
      <span>{children}</span>
      <span style={{ fontSize:20, opacity:hov?1:0, transform:hov?"none":"translateX(-12px)", transition:"all .3s" }}>→</span>
    </a>
  );
}

export function MediaCard({ label, gradient, imgSrc }: MediaCardProps): JSX.Element {
  const [hov, setHov] = useState<boolean>(false);
  const h = useCursorElement({ state: "media", mediaSrc: imgSrc });
  return (
    <div {...h}
      onMouseEnter={(e) => { setHov(true);  h.onMouseEnter(e); }}
      onMouseLeave={(e) => { setHov(false); h.onMouseLeave(e); }}
      style={{ position:"relative", height:220, overflow:"hidden", display:"flex", alignItems:"flex-end", padding:"20px 24px" }}
    >
      <div style={{ position:"absolute", inset:0, background:gradient, transform:hov?"scale(1.06)":"scale(1)", transition:"transform .7s cubic-bezier(.23,1,.32,1)" }} />
      <span style={{ position:"relative", zIndex:1, fontFamily:"'Helvetica Neue',sans-serif", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:"rgba(255,255,255,.4)" }}>{label}</span>
    </div>
  );
}

export function Btn({ children, state = "pointer", text, icon, filled = false }: BtnProps): JSX.Element {
  const [hov, setHov] = useState<boolean>(false);
  const h = useCursorElement({ state, text, icon });
  const style: CSSProperties = {
    fontFamily:"'Helvetica Neue',sans-serif", fontSize:11, letterSpacing:".16em",
    textTransform:"uppercase", padding:"13px 28px", borderRadius:100, transition:"all .3s", border:"1px solid",
    ...(filled
      ? { background:hov?"transparent":"#f0ece4", color:hov?"#f0ece4":"#0e0e0e", borderColor:"#f0ece4" }
      : { background:hov?"#f0ece4":"transparent", color:hov?"#0e0e0e":"#f0ece4", borderColor:hov?"#f0ece4":"#333" }),
  };
  return (
    <button {...h} style={style}
      onMouseEnter={(e) => { setHov(true);  h.onMouseEnter(e); }}
      onMouseLeave={(e) => { setHov(false); h.onMouseLeave(e); }}
    >{children}</button>
  );
}

export function HiddenZone(): JSX.Element {
  const h = useCursorElement({ state: "hidden" });
  return (
    <div {...h} style={{ border:"1px solid #1e1e1e", borderRadius:6, height:96, display:"flex", alignItems:"center", justifyContent:"center", marginTop:20, fontFamily:"'Helvetica Neue',sans-serif", fontSize:9, letterSpacing:".14em", textTransform:"uppercase", color:"#444" }}>
      ⬚ &nbsp; Hover here — cursor hides
    </div>
  );
}

export function ExclusionBand(): JSX.Element {
  const h = useCursorElement({ state: "exclusion" });
  return (
    <div {...h} style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
      <div style={{ background:"#0e0e0e", padding:"60px 52px" }}>
        <span style={{ fontSize:44, letterSpacing:"-.03em", lineHeight:1, color:"#f0ece4" }}>Dark<br />Side</span>
      </div>
      <div style={{ background:"#f0ece4", padding:"60px 52px", display:"flex", justifyContent:"flex-end" }}>
        <span style={{ fontSize:44, letterSpacing:"-.03em", lineHeight:1, color:"#0e0e0e", textAlign:"right" }}>Light<br />Side</span>
      </div>
    </div>
  );
}

export function SectionLabel({ n, children }: SLabelProps): JSX.Element {
  return (
    <p style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:9, letterSpacing:".3em", textTransform:"uppercase", color:"#555", marginBottom:44 }}>
      {n} — {children}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Real-world usage with Lucide React:
 *
 *   import { Play, ArrowUpRight, ExternalLink, MoveRight } from 'lucide-react'
 *
 *   useCursorElement({ state: 'icon', icon: <Play size={16} /> })
 *   <StateCard state="icon" icon={<ArrowUpRight size={14} />} ... />
 *   <Btn state="icon" icon={<MoveRight size={14} />}>Open Project</Btn>
 */
export default function App(): JSX.Element {
  return (
    <CursorProvider>
      <div style={{ minHeight:"100vh", background:"#0e0e0e", color:"#f0ece4", fontFamily:"'Times New Roman',Times,serif" }}>
        <div style={{ maxWidth:1040, margin:"0 auto", padding:"0 48px" }}>

          <header style={{ padding:"34px 0 30px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #1a1a1a" }}>
            <div style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:12, letterSpacing:".28em", textTransform:"uppercase" }}>Cursor Studio</div>
            <nav style={{ display:"flex", gap:32 }}>
              <NavLink>Work</NavLink><NavLink>About</NavLink>
              <NavLink>Lab</NavLink><NavLink>Contact</NavLink>
            </nav>
          </header>

          <section style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"end", padding:"108px 0 92px", borderBottom:"1px solid #1a1a1a" }}>
            <h1 style={{ fontSize:"clamp(44px,6.5vw,84px)", lineHeight:.93, letterSpacing:"-.03em", fontWeight:400, margin:0 }}>
              Cuberto<br />
              <em style={{ fontStyle:"italic", color:"#555" }}>Cursor</em><br />
              Recreation
            </h1>
            <p style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:13, lineHeight:1.8, color:"#666", maxWidth:340, margin:0 }}>
              Now with <strong style={{ color:"#f0ece4", fontWeight:500 }}>Lucide icon</strong> support.
              Pass any <code style={{ fontSize:10, background:"#1a1a1a", padding:"2px 6px", borderRadius:3 }}>ReactNode</code> as the{" "}
              <code style={{ fontSize:10, background:"#1a1a1a", padding:"2px 6px", borderRadius:3 }}>icon</code> prop —
              Lucide elements, SVGs, glyphs, emoji.
            </p>
          </section>

          <section style={{ padding:"76px 0", borderBottom:"1px solid #1a1a1a" }}>
            <SectionLabel n="01">Icon Variants</SectionLabel>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
              {/* String glyphs */}
              <StateCard tag="String glyph" title="Arrow" state="icon" icon="↗"
                desc='icon="↗"  — any Unicode glyph works.' />
              <StateCard tag="String glyph" title="Star" state="icon" icon="✦"
                desc='icon="✦"  — keeps the short-glyph 16px sizing.' />
              {/* Multi-char text via text prop */}
              <StateCard tag="Text label" title="View" state="text" text="View"
                desc='text="View"  — multi-char triggers 9px uppercase.' />
              {/* ReactNode — in your project use <Play size={16} /> etc. */}
              <StateCard tag="ReactNode icon" title="Lucide Play" state="icon" icon="▶"
                desc="icon={<Play size={16} />}  — Lucide or any React element." />
              <StateCard tag="ReactNode icon" title="Lucide Arrow" state="icon" icon="↗"
                desc="icon={<ArrowUpRight size={16} />}  — inherits currentColor." />
              <StateCard tag="Exclusion" title="Blend" state="exclusion"
                desc="mix-blend-mode: exclusion inverts whatever is underneath." />
            </div>
          </section>

          <section style={{ padding:"76px 0", borderBottom:"1px solid #1a1a1a" }}>
            <SectionLabel n="02">Links</SectionLabel>
            <BigLink>Brand Identity</BigLink>
            <BigLink>UX / UI Design</BigLink>
            <BigLink>Development</BigLink>
            <BigLink>Motion & 3D</BigLink>
          </section>

          <section style={{ padding:"76px 0", borderBottom:"1px solid #1a1a1a" }}>
            <SectionLabel n="03">Media Preview</SectionLabel>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
              <MediaCard label="Mountains" gradient="linear-gradient(135deg,#1a1a2e,#0f3460)" imgSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop" />
              <MediaCard label="Desert"    gradient="linear-gradient(135deg,#2d1b00,#8b4513)" imgSrc="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=400&fit=crop" />
              <MediaCard label="Forest"    gradient="linear-gradient(135deg,#0a2a0a,#2d6a2d)" imgSrc="https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=400&fit=crop" />
            </div>
          </section>

        </div>

        <div style={{ borderTop:"1px solid #1a1a1a", borderBottom:"1px solid #1a1a1a" }}>
          <div style={{ maxWidth:1040, margin:"0 auto", padding:"60px 48px 20px" }}>
            <SectionLabel n="04">Exclusion</SectionLabel>
          </div>
          <ExclusionBand />
        </div>

        <div style={{ maxWidth:1040, margin:"0 auto", padding:"0 48px" }}>
          <section style={{ padding:"76px 0 100px" }}>
            <SectionLabel n="05">Buttons</SectionLabel>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap", alignItems:"center" }}>
              <Btn>Outline</Btn>
              <Btn filled>Filled</Btn>
              <Btn state="text" text="Go">Text</Btn>
              <Btn state="icon" icon="✦">Glyph</Btn>
              {/* In your project: icon={<Play size={14} />} */}
              <Btn state="icon" icon="▶">Lucide</Btn>
              <Btn state="hidden">Hidden</Btn>
            </div>
            <HiddenZone />
          </section>
        </div>

        <div style={{ position:"fixed", bottom:24, right:24, fontFamily:"'Helvetica Neue',sans-serif", fontSize:9, letterSpacing:".12em", textTransform:"uppercase", color:"#3a3a3a", pointerEvents:"none", zIndex:100 }}>
          Move fast — watch the skew
        </div>
      </div>
    </CursorProvider>
  );
}