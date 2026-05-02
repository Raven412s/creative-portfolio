"use client";
import { useIsTouchDevice } from '@/hooks/use-is-touch-device';
import { motion } from 'framer-motion';
import { MousePointerClickIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCursorElement } from '../cursor/claude-cursor';
import StaggerText from '../ui/stagger-text';


import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Github, Instagram, Linkedin } from "lucide-react";
import { AsciiMorph } from "../ascii-morph";
import gsap from 'gsap';

// ── Constants ─────────────────────────────────────────────────────────────────
const NAV_LINKS = [
    { label: "Home", href: "/", num: "00" },
    { label: "About", href: "/about", num: "01" },
    { label: "Works", href: "/works", num: "02" },
    { label: "Case Studies", href: "/case-studies", num: "03" },
    { label: "Blogs", href: "/blog", num: "04" },
    { label: "Contact", href: "/contact", num: "05" },
] as const

function Socials() {
    const h = useCursorElement({
        state: 'icon',
        icon: <MousePointerClickIcon className="size-7 inline text-white" />,
    })
    const socials = [
        {
            href: "https://instagram.com",
            icon: <Instagram className="size-24 stroke-[0.5] " />,
            label: "Instagram",
        },
        {
            href: "https://github.com",
            icon: <Github className="size-24 stroke-[0.5] " />,
            label: "GitHub",
        },
        {
            href: "https://linkedin.com",
            icon: <Linkedin className="size-24 stroke-[0.5] " />,
            label: "LinkedIn",
        },
    ];

    return (
        <TooltipProvider delayDuration={100}>
            <div className="flex items-center gap-6">
                {socials.map((item, i) => (
                    <Tooltip key={i}>
                        <TooltipTrigger asChild>
                            <Link
                                {...h}
                                href={item.href}
                                target="_blank"
                                className="
                  text-white/40 
                  hover:text-lime-accent
                  transition-colors duration-300
                "
                            >
                                {item.icon}
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs bg-neutral-900 z-40 text-lime-accent">
                            {item.label}
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    );
}

function Unleashed() {
    const containerRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<SVGTextElement>(null);
    const [textHeight, setTextHeight] = useState<number | null>(null);

    // Measure actual rendered text height via getBBox
    useEffect(() => {
        const measure = () => {
            if (!textRef.current) return;
            try {
                const bbox = textRef.current.getBBox();
                // Add small vertical padding (10% of height)
                setTextHeight(bbox.height * 1.1);
            } catch {
                // getBBox fails if element not in DOM yet
            }
        };

        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    return (
        // Wrapper height = exact text height, measured from SVG
        <div
            style={{ height: textHeight ? `${textHeight}px` : "15vw" }}
            className="relative w-full transition-[height] duration-0"
        >
            <div
                ref={containerRef}
                onMouseMove={(e) => {
                    if (!containerRef.current || !glowRef.current) return;
                    const rect = containerRef.current.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    glowRef.current.style.left = `${x - 400}px`;
                    glowRef.current.style.top = `${y - 400}px`;
                }}
                onMouseEnter={() => {
                    if (glowRef.current) glowRef.current.style.opacity = "1";
                }}
                onMouseLeave={() => {
                    if (glowRef.current) glowRef.current.style.opacity = "0";
                }}
                className="relative w-full h-full flex cursor-none overflow-hidden"
            >
                {/* Single SVG — mask + stroke share identical coordinate system */}
                <svg
                    className="absolute w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <mask id="text-mask">
                            <rect width="100%" height="100%" fill="black" />
                            <text
                                ref={textRef}
                                x="50%"
                                y="50%"
                                dominantBaseline="middle"
                                textAnchor="middle"
                                fontSize="14vw"
                                fontWeight="900"
                                fontFamily="inherit"
                                letterSpacing="-0.02em"
                                fill="white"
                            >
                                UNLEASHED
                            </text>
                        </mask>
                    </defs>

                    <rect
                        width="100%"
                        height="100%"
                        fill="white"
                        fillOpacity="0.04"
                        mask="url(#text-mask)"
                    />

                    <text
                        x="50%"
                        y="50%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize="14vw"
                        fontWeight="900"
                        fontFamily="inherit"
                        letterSpacing="-0.02em"
                        fill="none"
                        stroke="rgba(255,255,255,0.55)"
                        strokeWidth="1"
                        className="md:stroke-[1.5]"
                    >
                        UNLEASHED
                    </text>
                </svg>

                {/* Glow SVG overlay */}
                <svg
                    className="absolute w-full h-full z-10 pointer-events-none"
                    style={{ mixBlendMode: "screen" }}
                >
                    <defs>
                        <mask id="text-mask-glow">
                            <rect width="100%" height="100%" fill="black" />
                            <text
                                x="50%"
                                y="50%"
                                dominantBaseline="middle"
                                textAnchor="middle"
                                fontSize="14vw"
                                fontWeight="900"
                                fontFamily="inherit"
                                letterSpacing="-0.02em"
                                fill="white"
                            >
                                UNLEASHED
                            </text>
                        </mask>
                    </defs>
                    <foreignObject width="100%" height="100%" mask="url(#text-mask-glow)">
                        <div
                            // @ts-ignore
                            xmlns="http://www.w3.org/1999/xhtml"
                            className="w-full h-full relative overflow-hidden"
                        >
                            <div
                                ref={glowRef}
                                className="hidden md:block pointer-events-none absolute w-200 h-200 opacity-0 transition-opacity duration-300 blur-3xl z-10 bg-[radial-gradient(circle,rgba(28,243,161,0.9)_0%,rgba(28,243,161,0.2)_40%,transparent_70%)]"
                            />
                        </div>
                    </foreignObject>
                </svg>

                {/* Mobile fallback gradient */}
                <svg className="absolute w-full h-full pointer-events-none md:hidden">
                    <defs>
                        <linearGradient id="grad-mobile" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#1cf3a1" stopOpacity="0.8" />
                            <stop offset="40%" stopColor="white" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                        <mask id="text-mask-gradient">
                            <rect width="100%" height="100%" fill="black" />
                            <text
                                x="50%"
                                y="50%"
                                dominantBaseline="middle"
                                textAnchor="middle"
                                fontSize="14vw"
                                fontWeight="900"
                                fontFamily="inherit"
                                letterSpacing="-0.02em"
                                fill="white"
                            >
                                UNLEASHED
                            </text>
                        </mask>
                    </defs>
                    <rect
                        width="100%"
                        height="100%"
                        mask="url(#text-mask-gradient)"
                        fill="url(#grad-mobile)"
                    />
                </svg>
            </div>
        </div>
    );
}

export default function Footer() {
    const h = useCursorElement({
        state: 'icon',
        icon: <MousePointerClickIcon className="size-7 inline text-white" />,
    })

    const pathname = usePathname()
    const isTouchDevice = useIsTouchDevice()
    const [isOpen, setIsOpen] = useState(false)
    const activeIndex = NAV_LINKS.findIndex(l => l.href === pathname)
    const linksRef = useRef<(HTMLAnchorElement | null)[]>([])
    const linkRowsRef = useRef<(HTMLDivElement | null)[]>([])
    const indicatorRef = useRef<HTMLDivElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const rotationRef = useRef(0)
    const animateToLink = (index: number) => {
        const indicator = indicatorRef.current
        const container = containerRef.current
        if (!indicator || !container) return

        if (index >= 0 && linkRowsRef.current[index]) {
            const cRect = container.getBoundingClientRect()
            const rRect = linkRowsRef.current[index]!.getBoundingClientRect()
            const targetY = rRect.top - cRect.top + rRect.height / 2 - indicator.offsetHeight / 2
            rotationRef.current += 180
            gsap.to(indicator, { x: 0, y: targetY, rotation: rotationRef.current, opacity: 1, duration: 0.5, ease: 'back.out(1.4)', overwrite: true })
        } else {
            gsap.to(indicator, { x: '-2vw', opacity: 0, duration: 0.3, ease: 'power2.out', overwrite: true })
        }

        // links stay in place — only the indicator moves
    }
    return (
        <footer
            className="fixed bottom-0 left-0 w-full z-0"
            style={{ height: "var(--footer-height, 100%)" }}
        >
            <div className="w-full h-full bg-[#0a0a0a] flex flex-col pt-24">
                <div className="flex-1 relative flex flex-col justify-between">
                    {/* Unleashed hugs the top, height = exact text height */}
                    <div className="w-full">
                        <Unleashed />
                    </div>
                    <div className="
                                  px-6 md:px-16 lg:px-28 
                                  w-full 
                                  grid 
                                  grid-cols-1 lg:grid-cols-2 
                                  gap-12
                                  items-end
                                ">
                        {/* Links */}
                        <div
                            ref={containerRef}
                            className="
                                    relative flex flex-col gap-1 
                                    border-white/10 lg:border-r 
                                    lg:pr-12
                                "
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
                                        {...(isTouchDevice ? {} : h)}
                                        className={`
                                        font-semibold tracking-tight leading-none py-1.5 transition-colors duration-200
                                        text-[clamp(1.6rem,4vw,3rem)]
                                        ${pathname === link.href ? 'text-emerald-400' : 'text-white/85 hover:text-white'}
                                    `}
                                        onClick={() => setIsOpen(false)}
                                        role="menuitem"
                                        tabIndex={isOpen ? 0 : -1}
                                    >
                                        <StaggerText text={link.label} className='h-8 lg:h-16' />
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

                        {/* Socials — left of raven */}
                        <div className="absolute bottom-4 right-90 z-9">
                            <Socials />
                        </div>

                        {/* Raven ASCII tag */}
                        <AsciiMorph
                        morph={false}
                            files={['/ascii/raven.txt']}
                            pause={4500}
                            className="
                                     absolute bottom-4 right-0 
                                     scale-50 
                                     translate-x-1/4 translate-y-1/4 
                                     bg-red-900 
                                     w-fit 
                                     pointer-events-none 
                                     rounded-l-full 
                                     pl-12 
                                   "

                            fontColor="text-white"
                        />

                    </div>
                </div>
                
            </div>
        </footer>
    );
}