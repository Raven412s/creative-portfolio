'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Menu, MousePointerClickIcon, X } from 'lucide-react'
import { useIsTouchDevice } from '@/hooks/use-is-touch-device'
import { Magnetic } from '../buttons'
import RavenLogo from '../svgs/raven-logo'
import { useCursorElement, type CursorElementHandlers } from '../cursor/claude-cursor'
import StaggerText from '../ui/stagger-text'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

// ── Constants ─────────────────────────────────────────────────────────────────
const NAV_LINKS = [
    { label: "Home",         href: "/",            num: "00" },
    { label: "About",        href: "/about",        num: "01" },
    { label: "Works",        href: "/works",        num: "02" },
    { label: "Case Studies", href: "/case-studies", num: "03" },
    { label: "Blogs",        href: "/blog",         num: "04" },
    { label: "Contact",      href: "/contact",      num: "05" },
] as const

const STACK = [
    { label: "Next.js",          color: "#fff" },
    { label: "TypeScript",        color: "#3B82F6" },
    { label: "Tailwind",          color: "#38BDF8" },
    { label: "GSAP",              color: "#88CC00" },
    { label: "Framer Motion",     color: "#BB55FF" },
    { label: "Node.js",           color: "#68A063" },
    { label: "Prisma",            color: "#5A67D8" },
    { label: "PostgreSQL",        color: "#336791" },
]

const NOISE_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`

const glassStyle: React.CSSProperties = {
    backgroundImage: NOISE_BG,
    backdropFilter: 'blur(20px) saturate(180%) contrast(120%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%) contrast(120%)',
    backgroundColor: 'rgba(10, 10, 10, 0.65)',
    border: '1px solid rgba(255,255,255,0.08)',
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface MenuToggleContentProps {
    isOpen: boolean
    h: Partial<React.HTMLAttributes<HTMLDivElement>> & CursorElementHandlers
}

// ── Sub-component: toggle icon ────────────────────────────────────────────────
const MenuToggleContent = ({ isOpen, h }: MenuToggleContentProps) => (
    <div className="relative flex items-center justify-center pointer-events-auto" {...h}>
        <AnimatePresence mode="wait">
            {isOpen ? (
                <motion.div
                    className='mix-blend-difference'
                    key="close"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                    <X className="menuIconSize text-white" />
                </motion.div>
            ) : (
                <motion.div
                    className='mix-blend-difference'
                    key="menu"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                    <Menu className="menuIconSize text-white" />
                </motion.div>
            )}
        </AnimatePresence>
    </div>
)

// ── Sub-component: Blinking cursor ────────────────────────────────────────────
const BlinkCursor = () => (
    <motion.span
        className="inline-block w-0.5 h-[1em] bg-emerald-400 ml-0.5 align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
    />
)

// ── Sub-component: Terminal block ─────────────────────────────────────────────
const TerminalBlock = () => {
    const lines = [
        { prompt: '~', cmd: 'whoami',           out: 'pranav · full-stack dev' },
        { prompt: '~', cmd: 'uptime',            out: '3 yrs of shipping code' },
        { prompt: '~', cmd: 'cat status.txt',    out: '✦ open to work · collabs' },
        { prompt: '~', cmd: 'ping email',        out: 'hi@pranav.dev' },
    ]

    return (
        <div
            className="rounded-xl overflow-hidden text-[11px] leading-relaxed font-mono"
            style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
            {/* Terminal titlebar */}
            <div className="flex items-center gap-1.5 px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                <span className="ml-2 text-white/20 text-[10px] tracking-widest uppercase">terminal</span>
            </div>

            {/* Lines */}
            <div className="px-4 py-3 flex flex-col gap-1.5">
                {lines.map((l, i) => (
                    <div key={i}>
                        <div className="flex items-center gap-1.5">
                            <span className="text-emerald-400">❯</span>
                            <span className="text-white/50">{l.prompt}</span>
                            <span className="text-white/90">{l.cmd}</span>
                        </div>
                        <div className="text-white/40 pl-4">{l.out}</div>
                    </div>
                ))}
                {/* active line */}
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-emerald-400">❯</span>
                    <span className="text-white/50">~</span>
                    <BlinkCursor />
                </div>
            </div>
        </div>
    )
}

// ── Sub-component: Stack pills ────────────────────────────────────────────────
const StackPills = () => (
    <div className="flex flex-wrap gap-1.5">
        {STACK.map((s) => (
            <span
                key={s.label}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full tracking-wide"
                style={{
                    border: `1px solid ${s.color}30`,
                    color: s.color,
                    background: `${s.color}10`,
                }}
            >
                {s.label}
            </span>
        ))}
    </div>
)

// ── Sub-component: Availability badge ────────────────────────────────────────
const AvailBadge = () => (
    <div className="flex items-center gap-2">
        <motion.span
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
        />
        <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase">
            Available for hire
        </span>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Nav = () => {
    const pathname  = usePathname()
    const isTouchDevice = useIsTouchDevice()
    const [isOpen, setIsOpen] = useState(false)
    const activeIndex = NAV_LINKS.findIndex(l => l.href === pathname)

    // ── Refs ───────────────────────────────────────────────────────────────────
    const navRef        = useRef<HTMLElement | null>(null)
    const menuRef       = useRef<HTMLDivElement | null>(null)
    const topLineRef    = useRef<HTMLSpanElement | null>(null)
    const bottomLineRef = useRef<HTMLSpanElement | null>(null)
    const linksRef      = useRef<(HTMLAnchorElement | null)[]>([])
    const linkRowsRef   = useRef<(HTMLDivElement | null)[]>([])
    const indicatorRef  = useRef<HTMLDivElement | null>(null)
    const containerRef  = useRef<HTMLDivElement | null>(null)
    const contactRef    = useRef<HTMLDivElement | null>(null)
    const timelineRef   = useRef<gsap.core.Timeline | null>(null)
    const allLinesRef   = useRef<Element[]>([])
    const splitsRef     = useRef<SplitText[]>([])
    const rotationRef   = useRef(0)

    // ── SplitText setup ────────────────────────────────────────────────────────
    useEffect(() => {
        const splits: SplitText[] = []
        const lines: Element[]    = []

        const els: Element[] = [
            ...linksRef.current.filter((el): el is HTMLAnchorElement => el !== null),
            ...(contactRef.current?.querySelectorAll('p') ?? []),
        ]

        els.forEach(el => {
            const split = new SplitText(el as HTMLElement, { type: 'lines', mask: 'lines', linesClass: 'split-line' })
            splits.push(split)
            split.lines.forEach(line => { gsap.set(line, { y: '100%' }); lines.push(line) })
        })

        splitsRef.current = splits
        allLinesRef.current = lines

        return () => { timelineRef.current?.kill(); splits.forEach(s => s.revert()) }
    }, [])

    // ── Indicator hover ────────────────────────────────────────────────────────
    const animateToLink = (index: number) => {
        const indicator = indicatorRef.current
        const container = containerRef.current
        if (!indicator || !container) return

        if (index >= 0 && linkRowsRef.current[index]) {
            const cRect  = container.getBoundingClientRect()
            const rRect  = linkRowsRef.current[index]!.getBoundingClientRect()
            const targetY = rRect.top - cRect.top + rRect.height / 2 - indicator.offsetHeight / 2
            rotationRef.current += 180
            gsap.to(indicator, { x: 0, y: targetY, rotation: rotationRef.current, opacity: 1, duration: 0.5, ease: 'back.out(1.4)', overwrite: true })
        } else {
            gsap.to(indicator, { x: '-2vw', opacity: 0, duration: 0.3, ease: 'power2.out', overwrite: true })
        }

        // links stay in place — only the indicator moves
    }

    // ── Open / close timeline ──────────────────────────────────────────────────
    useEffect(() => {
        timelineRef.current?.kill()
        const tl = gsap.timeline()
        timelineRef.current = tl

        if (isOpen) {
            gsap.set(indicatorRef.current, { x: '-2vw', opacity: 0 })

            tl.to(navRef.current,      { width: '90vw', duration: 0.5, ease: 'power3.inOut' })
              .to(topLineRef.current,    { rotation: 45,  y: 0, duration: 0.3, ease: 'power2.inOut' }, 0)
              .to(bottomLineRef.current, { rotation: -45, y: 0, duration: 0.3, ease: 'power2.inOut' }, 0)
              .to(menuRef.current,       { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.inOut' }, 0.3)
              .to(allLinesRef.current,   { y: '0%', stagger: 0.03, duration: 0.5, ease: 'power3.out' }, 0.5)
              .call(() => animateToLink(activeIndex))
        } else {
            tl.to(topLineRef.current,    { rotation: 0, y: '-0.3vw', duration: 0.3, ease: 'power2.inOut' }, 0)
              .to(bottomLineRef.current,  { rotation: 0, y:  '0.3vw', duration: 0.3, ease: 'power2.inOut' }, 0)
              .to(menuRef.current,        { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.5, ease: 'power3.inOut' }, 0)
              .to(navRef.current,         { width: '95vw', duration: 0.5, ease: 'power3.inOut' }, 0.3)
              .set(allLinesRef.current,   { y: '100%' }, 0.5)
        }
    
    }, [isOpen, activeIndex])

    // ── Cursor ─────────────────────────────────────────────────────────────────
    const h      = useCursorElement({ state: 'text', text: isOpen ? 'Close' : 'Open' })
    const h_link = useCursorElement({ state: 'icon', icon: <MousePointerClickIcon className="size-10 inline text-white" /> })
    const h_build = useCursorElement({ state: 'icon', icon: <MousePointerClickIcon className="size-7 inline text-white" /> })
    const h_socials = useCursorElement({ state: 'pointer' })

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <>
            {/* Invisible nav — GSAP width target */}
            <nav ref={navRef} className="fixed top-0 left-1/2 -translate-x-1/2 w-[95vw] pointer-events-none" aria-hidden="true" />

            {/* Dual logo bars */}
            <div
                aria-label="Site logo"
                className="fixed top-0 w-full  flex justify-between mix-blend-difference z-1000 mt-2 lg:mt-[0.9vw] pointer-events-none"
            >
                {[0, 1].map(i => (
                    <div key={i} className={isTouchDevice ? '' : 'pointer-events-auto'}>
                        <Magnetic>
                            <div className="flex items-center">
                                <p className="navText">RAVEN</p>
                                <RavenLogo />
                                <p className="navText">UNLEASHED</p>
                            </div>
                        </Magnetic>
                    </div>
                ))}
            </div>

            {/* Centered pill toggle */}
            <motion.div
                onClick={() => setIsOpen(v => !v)}
                onKeyDown={e => e.key === 'Enter' && setIsOpen(v => !v)}
                role="button"
                tabIndex={0}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={glassStyle}
                className="
                    fixed top-3 left-1/2 -translate-x-1/2
                    flex items-center justify-center
                    px-3    py-2
                    sm:px-3.5 sm:py-2
                    md:px-4   md:py-2.5
                    lg:px-[1.2vw] lg:py-[0.6vw]
                    xl:px-[1.4vw] xl:py-[0.7vw]
                    2xl:px-[1.5vw] 2xl:py-[0.8vw]
                    border rounded-full lg:rounded-[2vw]
                    shadow-[0_0_50px_-10px_rgba(0,0,0,0.65)]
                    z-9999 cursor-pointer
                    min-h-11 min-w-11 sm:min-h-0 sm:min-w-0
                "
            >
                {isTouchDevice
                    ? <MenuToggleContent isOpen={isOpen} h={h} />
                    : <Magnetic><MenuToggleContent isOpen={isOpen} h={h} /></Magnetic>
                }
            </motion.div>

            {/* ═══════════════════════════════════════════════════════════════
                DROPDOWN MENU — developer portfolio edition
            ═══════════════════════════════════════════════════════════════ */}
            <div
                ref={menuRef}
                style={{ ...glassStyle, clipPath: 'inset(0% 0% 100% 0%)' }}
                className="fixed top-[calc(2vw+5%)] left-1/2 -translate-x-1/2 max-w-[90vw] w-full border border-white/10 rounded-2xl z-40"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                data-lenis-prevent
            >
                {/* subtle green glow top-left */}
                <div
                    className="absolute -top-20 -left-20 w-56 h-56 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)' }}
                />

                <div className="relative p-5 md:p-[2vw] flex flex-col lg:flex-row gap-6 lg:gap-[2vw]">

                    {/* ── LEFT: big nav links ──────────────────────────────── */}
                    <div
                        ref={containerRef}
                        className="relative shrink-0 flex flex-col gap-1 lg:border-r lg:border-white/8 lg:pr-[2vw]"
                        onMouseLeave={() => animateToLink(activeIndex)}
                    >
                        {/* flying indicator diamond — sits between number col and link text */}
                        <div
                            ref={indicatorRef}
                            className="absolute top-0 w-3 h-3 bg-emerald-400 opacity-0 pointer-events-none z-10 rotate-45"
                            style={{ left: '-1rem', transform: 'translateX(-2vw)' }}
                        />

                        {NAV_LINKS.map((link, i) => (
                            <div
                                key={link.href}
                                ref={el => { linkRowsRef.current[i] = el }}
                                className="group flex items-center gap-3"
                                onMouseEnter={() => animateToLink(i)}
                            >
                                {/* index number */}
                                <span
                                    className="font-mono text-[10px] tabular-nums transition-colors duration-200 w-6 text-right shrink-0"
                                    style={{ color: pathname === link.href ? '#34D399' : 'rgba(255,255,255,0.2)' }}
                                >
                                    {link.num}
                                </span>

                                <Link
                                    ref={el => { linksRef.current[i] = el }}
                                    href={link.href}
                                    {...(isTouchDevice ? {} : h_link)}
                                    className={`
                                        font-semibold tracking-tight leading-none py-1.5 transition-colors duration-200
                                        text-[clamp(1.6rem,4vw,3rem)]
                                        ${pathname === link.href ? 'text-emerald-400' : 'text-white/85 hover:text-white'}
                                    `}
                                    onClick={() => setIsOpen(false)}
                                    role="menuitem"
                                    tabIndex={isOpen ? 0 : -1}
                                >
                                    <StaggerText text={link.label} className='h-8 lg:h-16'/>
                                </Link>

                                {/* active dot */}
                                {pathname === link.href && (
                                    <motion.span
                                        layoutId="active-dot"
                                        className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── RIGHT: developer meta ────────────────────────────── */}
                    <div
                        ref={contactRef}
                        className="flex flex-col gap-5 lg:gap-[1.5vw] flex-1 justify-between"
                    >
                        {/* availability */}
                        <div className="flex flex-col gap-2">
                            <p className="text-white/30 uppercase text-[10px] font-mono tracking-[0.15em]">Status</p>
                            <AvailBadge />
                        </div>

                        {/* terminal block */}
                        <div className="flex flex-col gap-2">
                            <p className="text-white/30 uppercase text-[10px] font-mono tracking-[0.15em]">Logs</p>
                            <TerminalBlock />
                        </div>

                        {/* stack pills */}
                        <div className="flex flex-col gap-2">
                            <p className="text-white/30 uppercase text-[10px] font-mono tracking-[0.15em]">Stack</p>
                            <StackPills />
                        </div>

                        {/* CTA + socials row */}
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <Link
                            {...h_build}
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="
                                    flex items-center gap-2 px-4 py-2 rounded-full
                                    text-xs font-mono font-semibold tracking-wider uppercase
                                    text-emerald-400 border border-emerald-400/40
                                    bg-emerald-400/5 hover:bg-emerald-400/15
                                    transition-all duration-200 hover:scale-[1.03]
                                "
                            >
                                <motion.span
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                />
                                Let&apos;s build
                            </Link>

                            {/* social icon links */}
                            {[
                                { label: 'GH',  href: 'https://github.com',   title: 'GitHub'   },
                                { label: 'LI',  href: 'https://linkedin.com', title: 'LinkedIn' },
                                { label: 'TW',  href: 'https://twitter.com',  title: 'Twitter'  },
                            ].map(s => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={s.title}
                                    className="
                                        w-8 h-8 rounded-full flex items-center justify-center
                                        text-[10px] font-mono font-bold text-white/40
                                        border border-white/10 hover:border-white/30
                                        hover:text-muted-foreground transition-all duration-200 hover:bg-muted
                                    "
                                    {...h_socials}
                                >
                                    {s.label}
                                </a>
                            ))}

                            {/* location blip */}
                            <span className="ml-auto text-[10px] font-mono text-white/60 hidden sm:block">
                                 India · UTC+5:30
                            </span>
                        </div>
                    </div>
                </div>

                {/* bottom strip — minimal scanline */}
                <div
                    className="h-px w-full"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.3), transparent)' }}
                />
            </div>
        </>
    )
}

export default Nav