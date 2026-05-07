"use client";
import { useIsTouchDevice } from '@/hooks/use-is-touch-device';
import { motion } from 'framer-motion';
import { MousePointerClickIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCursorElement } from '../self-made/advance-cursor';
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
import { NAV_LINKS } from '@/constants';
import GlowText from '../self-made/glow-text';


function Socials() {
    const h = useCursorElement({
        state: 'icon',
        icon: <MousePointerClickIcon className="size-7 inline text-white" />,
    })
    const socials = [
        {
            href: "https://instagram.com",
            icon: <Instagram className="size-6 sm:size-8 md:size-10 lg:size-24 stroke-[0.5]" />,
            label: "Instagram",
        },
        {
            href: "https://github.com",
            icon: <Github className="size-6 sm:size-8 md:size-10 lg:size-24 stroke-[0.5]" />,
            label: "GitHub",
        },
        {
            href: "https://linkedin.com",
            icon: <Linkedin className="size-6 sm:size-8 md:size-10 lg:size-24 stroke-[0.5]" />,
            label: "LinkedIn",
        },
    ];

    return (
        <TooltipProvider delayDuration={100}>
            <div className="flex items-center gap-4 sm:gap-6">
                {socials.map((item, i) => (
                    <Tooltip key={i}>
                        <TooltipTrigger asChild>
                            <Link
                                {...h}
                                href={item.href}
                                target="_blank"
                                className="text-white/40 hover:text-lime-accent transition-colors duration-300"
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
    }

    return (
        <footer
            className="fixed bottom-0 left-0 w-full z-0 h-[60vh] lg:h-[150vh]"
        // style={{ height: "var(--footer-height, 200%)" }}
        >
            <div className="w-full h-full bg-[#0a0a0a] flex flex-col pt-16 sm:pt-20 md:pt-24">
                <div className="flex-1 relative flex flex-col justify-end">

                    {/* UNLEASHED heading */}
                    <div className="w-full">
                    <GlowText text='UNLEASHED' strokeWidth='1.5' strokeColor='rgba(255,255,255,0.3)' glowBlur='100px' />
                    </div>

                    {/*
                     * ── Main content area ───────────────────────────────────────
                     *
                     * Mobile  (<lg): stacked — nav links, then socials row, ASCII hidden
                     * Desktop (≥lg): two-column grid — links left | ascii+socials right
                     */}
                    <div className="px-6 md:px-16 lg:px-28 w-full">

                        {/* Two-column grid — only active on lg+ */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-end">

                            {/* ── Left col: Nav links ── */}
                            <div
                                ref={containerRef}
                                className="relative flex flex-col border-white/10 lg:border-r lg:pr-12"
                                onMouseLeave={() => animateToLink(activeIndex)}
                            >
                                {/* Flying indicator diamond */}
                                <div
                                    ref={indicatorRef}
                                    className="absolute top-0 w-3 h-3 bg-emerald-400 opacity-0 pointer-events-none z-10 rotate-45"
                                    style={{ left: '-1rem', transform: 'translateX(-2vw)' }}
                                />

                                {NAV_LINKS.map((link, i) => (
                                    <div
                                        key={link.href}
                                        ref={el => { linkRowsRef.current[i] = el }}
                                        className="group flex items-center gap-6 sm:gap-9"
                                        onMouseEnter={() => animateToLink(i)}
                                    >
                                        {/* Index number */}
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
                                                font-semibold tracking-tight leading-none py-1 sm:py-1.5
                                                transition-colors duration-200
                                                text-[clamp(1.4rem,5vw,3rem)]
                                                ${pathname === link.href ? 'text-emerald-400' : 'text-white/85 hover:text-white'}
                                            `}
                                            onClick={() => setIsOpen(false)}
                                            role="menuitem"
                                            tabIndex={isOpen ? 0 : -1}
                                        >
                                            {/*
                                             * StaggerText height:
                                             *   mobile  → h-7  (matches clamp floor ~1.4rem)
                                             *   sm      → h-9
                                             *   lg      → h-14
                                             */}
                                            <StaggerText
                                                text={link.label}
                                                className="h-7 sm:h-9 lg:h-14"
                                            />
                                        </Link>

                                        {/* Active dot */}
                                        {pathname === link.href && (
                                            <motion.span
                                                layoutId="active-dot"
                                                className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* ── Right col (lg+): Socials + ASCII ── */}
                            <div className="hidden lg:flex items-end h-40 relative min-h-40 ">
                                {/* Socials sit above the ASCII art */}
                                <div className="z-10 w-full ml-40">
                                    <Socials />
                                </div>

                                {/* ASCII Morph — pinned bottom-right of this column */}
                                <AsciiMorph
                                    morph={false}
                                    files={['/ascii/raven.txt']}
                                    pause={4500}
                                    className="-ml-80
                                        scale-50 origin-bottom-right
                                        translate-x-1/6 
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

                        {/* ── Mobile-only socials row (below nav links) ── */}
                        <div className="lg:hidden flex items-center gap-4 mt-8 mb-2">
                            <Socials />
                        </div>
                    </div>
                </div>

                {/* ── Bottom bar ── */}
                <div className="border-t border-white/10 w-full min-h-10 mt-8 sm:mt-12">
                    <div className="px-6 md:px-16 lg:px-28 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                        {/* Copyright */}
                        <p className="text-white/40 text-xs sm:text-sm font-mono text-center sm:text-left">
                            © {new Date().getFullYear()} Raven Unleashed. All rights reserved.
                        </p>

                        {/* Footer links */}
                        <div className="flex items-center gap-4 sm:gap-6 text-white/40 text-xs sm:text-sm flex-wrap justify-center">
                            <Link href="/privacy" className="hover:text-lime-accent transition-colors duration-300">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-lime-accent transition-colors duration-300">
                                Terms of Service
                            </Link>
                            <Link href="/sitemap" className="hover:text-lime-accent transition-colors duration-300">
                                Sitemap
                            </Link>
                        </div>

                        {/* Back to top */}
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="text-white/40 hover:text-lime-accent transition-colors duration-300 text-xs sm:text-sm"
                        >
                            Back to top ↑
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}