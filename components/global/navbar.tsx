"use client";
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { Menu, MousePointerClickIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsTouchDevice } from '@/hooks/use-is-touch-device';
import { Magnetic } from '../buttons';
import RavenLogo from '../svgs/raven-logo';
import { useCursorElement, type CursorElementHandlers } from '../cursor/claude-cursor';
import StaggerText from '../ui/stagger-text';

// ── Constants outside component to avoid re-allocation on every render ──────
const LINKS = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Works", href: "/works" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Blogs", href: "/blog" },
    { name: "Contact", href: "/contact" },
] as const;

const getSquareSize = () => (window.innerWidth < 640 ? 80 : 100);

// ── Sub-component ────────────────────────────────────────────────────────────
interface MenuToggleContentProps {
    overlayVisible: boolean;
    h: Partial<React.HTMLAttributes<HTMLDivElement>> & CursorElementHandlers;
}

const MenuToggleContent = ({ overlayVisible, h }: MenuToggleContentProps) => (
    <div className="relative flex items-center justify-center pointer-events-auto" {...h}>
        <AnimatePresence mode="wait">
            {overlayVisible ? (
                <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                    <X className="menuIconSize" />
                </motion.div>
            ) : (
                <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                    <Menu className="menuIconSize" />
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// ── Main Component ───────────────────────────────────────────────────────────
const Navbar = () => {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const squareContainerRef = useRef<HTMLDivElement | null>(null);
    const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);

    const [overlayVisible, setOverlayVisible] = useState(false);
    // Ref mirror of state so GSAP callbacks always read the latest value
    // without needing to be re-created on every state change.
    const overlayVisibleRef = useRef(false);

    const isTouchDevice = useIsTouchDevice();

    // ── Build the square grid ──────────────────────────────────────────────
    const buildGrid = useCallback(() => {
        const container = squareContainerRef.current;
        if (!container) return;

        const squareSize = getSquareSize();
        const numCols = Math.ceil(window.innerWidth / squareSize);
        const numRows = Math.ceil(window.innerHeight / squareSize);

        container.style.width = `${numCols * squareSize}px`;
        container.style.height = `${numRows * squareSize}px`;
        container.innerHTML = "";

        const fragment = document.createDocumentFragment();
        for (let i = 0; i < numCols * numRows; i++) {
            const square = document.createElement("div");
            // Tailwind purge-safe: keep these classes in your safelist if needed
            square.className = "w-[100px] h-[100px] bg-[#1cf3a1] opacity-0 pointer-events-none";
            fragment.appendChild(square);
        }
        container.appendChild(fragment);
    }, []);

    useEffect(() => {
        buildGrid();

        let debounceTimer: ReturnType<typeof setTimeout>;
        const onResize = () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(buildGrid, 200);
        };

        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
            squareContainerRef.current && (squareContainerRef.current.innerHTML = "");
        };
    }, [buildGrid]);

    // ── Menu toggle with GSAP ──────────────────────────────────────────────
    const handleMenuToggle = useCallback(() => {
        const squares = squareContainerRef.current?.children;
        const menu = menuRef.current;
        if (!squares || !menu) return;

        // Kill any running animation to prevent stacking on rapid clicks
        activeTimelineRef.current?.kill();

        const opening = !overlayVisibleRef.current;
        overlayVisibleRef.current = opening;
        setOverlayVisible(opening);

        const tl = gsap.timeline();
        activeTimelineRef.current = tl;

        tl.to(squares, {
            opacity: 1,
            duration: 0.05,
            stagger: { each: 0.004, from: "random" },
        })
            .set(
                menu,
                opening
                    ? { visibility: "visible", opacity: 1, zIndex: 50 }
                    : { visibility: "hidden", opacity: 0, zIndex: -1 },
                "-=0.2",
            )
            .to(squares, {
                opacity: 0,
                duration: 0.05,
                delay: 0.5,
                stagger: { each: 0.004, from: "random" },
            });
    }, []); // stable — reads state via ref, not closure

    const closeMenu = useCallback(() => {
        if (overlayVisibleRef.current) handleMenuToggle();
    }, [handleMenuToggle]);

    // ── Cursor elements ────────────────────────────────────────────────────
    const h = useCursorElement({
        state: "text",
        text: overlayVisible ? "Close" : "Open",
    });

    const h_link = useCursorElement({
        state: "icon",
        icon: <MousePointerClickIcon className="size-10 inline text-white" />,
    });

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <div>
            {/* Menu toggle pill */}
            <motion.div
                onClick={handleMenuToggle}
                onKeyDown={(e) => e.key === "Enter" && handleMenuToggle()}
                role="button"
                tabIndex={0}
                aria-label={overlayVisible ? "Close menu" : "Open menu"}
                aria-expanded={overlayVisible}
                animate={{ scale: overlayVisible ? 0.92 : 1 }}
                whileTap={{ scale: 0.85 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="
                    fixed top-3 left-1/2 -translate-x-1/2
                    flex items-center justify-center
                    px-3 py-2
                    sm:px-3.5 sm:py-2
                    md:px-4 md:py-2.5
                    lg:px-[1.2vw] lg:py-[0.6vw]
                    xl:px-[1.4vw] xl:py-[0.7vw]
                    2xl:px-[1.5vw] 2xl:py-[0.8vw]
                    bg-white/70 dark:bg-black/80 border
                    rounded-full lg:rounded-[2vw]
                    backdrop-blur-[20px]
                    shadow-[0_0_50px_-10px_rgba(0,0,0,0.65)]
                    z-9999 cursor-pointer
                    min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-auto
                "
            >
                {isTouchDevice ? (
                    <MenuToggleContent overlayVisible={overlayVisible} h={h} />
                ) : (
                    <Magnetic>
                        <MenuToggleContent overlayVisible={overlayVisible} h={h} />
                    </Magnetic>
                )}
            </motion.div>

            {/* Logo bar */}
            <nav
                aria-label="Site logo"
                className="fixed top-0 w-full flex justify-between mix-blend-difference z-1000 mt-2 lg:mt-[0.9vw] pointer-events-none"
            >
                {[0, 1].map((i) => (
                    <div key={i} className={isTouchDevice ? " " : "pointer-events-auto"}>
                        <Magnetic>
                            <div className="flex items-center">
                                <p className="navText">RAVEN</p>
                                <RavenLogo />
                                <p className="navText">UNLEASHED</p>
                            </div>
                        </Magnetic>
                    </div>
                ))}
            </nav>

            {/* Animated square overlay */}
            <div
                ref={squareContainerRef}
                aria-hidden="true"
                className="fixed top-0 left-0 flex flex-wrap pointer-events-none z-40"
            />

            {/* Full-screen menu */}
            <div ref={menuRef} className="menuOverlay opacity-0" role="dialog" aria-modal="true" aria-label="Navigation menu">
                <div className="menuOverlayInner">
                    <h1 className="menuOverlayHeading">
                        w<span className="font-gridular">or</span>k wi
                        <span className="font-gridular">t</span>h
                        <span className="font-gridular"> R</span>AV
                        <span className="font-gridular">E</span>N
                    </h1>
                    <nav aria-label="Main navigation">
                        <div className="flex flex-col gap-4 lg:gap-[1vw]">
                            {LINKS.map((link, i) => (
                                <div key={link.href} className="flex gap-4 lg:gap-[1.8vw]">
                                    <span className="menuIndex">
                                        ({String(i + 1).padStart(2, "0")})
                                    </span>
                                    <Link
                                        href={link.href}
                                        className="menuLink active:scale-95 transition-transform sm:active:scale-100"
                                        onClick={closeMenu}
                                        {...(isTouchDevice ? {} : h_link)}
                                        role="menuitem"
                                        tabIndex={overlayVisible ? 0 : -1}
                                    >
                                        <StaggerText text={link.name} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Navbar;