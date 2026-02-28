"use client";
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { Menu, MousePointerClickIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Magnetic } from '../buttons';
import RavenLogo from '../pages-and-sections/home-page/hero/raven-logo';
import { useCursorElement } from '../test/claude-cursor';
import StaggerText from '../ui/stagger-text';
type MenuLink = {
    name: string;
    href: string;
};
const Navbar = () => {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const squareContainerRef = useRef<HTMLDivElement | null>(null);
    const [overlayVisible, setOverlayVisible] = useState(false);

    const links: MenuLink[] = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Works", href: "/works" },
        { name: "Case Studies", href: "/case-studies" },
        { name: "Blogs", href: "/blog" },
        { name: "Contact", href: "/contact" },
    ];
    const squareSizeRef = useRef(100);

    useEffect(() => {

        const updateSquareSize = () => {
            squareSizeRef.current = window.innerWidth < 640 ? 80 : 100;
        };

        updateSquareSize();

        window.addEventListener("resize", updateSquareSize);

        return () => window.removeEventListener("resize", updateSquareSize);

    }, []);

    const squareSize = squareSizeRef.current;

    // 1. Memory Leak Fix: Squares ko sirf ek baar initialize karein
    useEffect(() => {
        const container = squareContainerRef.current;
        if (!container) return;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const numCols = Math.ceil(screenWidth / squareSize);
        const numRows = Math.ceil(screenHeight / squareSize);
        const total = numCols * numRows;

        container.style.width = `${numCols * squareSize}px`;
        container.style.height = `${numRows * squareSize}px`;

        // Purana content clear karein (sirf ek baar mount par)
        container.innerHTML = "";

        for (let i = 0; i < total; i++) {
            const square = document.createElement("div");
            square.className = "w-[100px] h-[100px] bg-[#1cf3a1] opacity-0 pointer-events-none";
            container.appendChild(square);
        }

        // Cleanup function
        return () => {
            container.innerHTML = "";
        };
    }, []);

    // 2. GSAP vs Framer Mix Fix: Sab kuch ek synchronized timeline mein
    const handleMenuToggle = useCallback(() => {
        const squares = squareContainerRef.current?.children;
        const menu = menuRef.current;
        if (!squares || !menu) return;

        const tl = gsap.timeline();

        if (!overlayVisible) {
            // Opening Animation
            tl.to(squares, {
                opacity: 1,
                duration: 0.05,
                stagger: { each: 0.004, from: "random" }
            })
                .set(menu, { visibility: "visible", opacity: 1, zIndex: 50 }, "-=0.2") // Squares khatam hone se pehle menu show karein
                .to(squares, {
                    opacity: 0,
                    duration: 0.05,
                    delay: 0.5,
                    stagger: { each: 0.004, from: "random" }
                });
        } else {
            // Closing Animation
            tl.to(squares, {
                opacity: 1,
                duration: 0.05,
                stagger: { each: 0.004, from: "random" }
            })
                .set(menu, { visibility: "hidden", opacity: 0, zIndex: -1 }, "-=0.2")
                .to(squares, {
                    opacity: 0,
                    duration: 0.05,
                    delay: 0.5,
                    stagger: { each: 0.004, from: "random" }
                });
        }

        setOverlayVisible(!overlayVisible);
    }, [overlayVisible]);

    // 3. Link Click Behavior: Menu band karna click par
    const closeMenu = () => {
        if (overlayVisible) handleMenuToggle();
    };


    const h = useCursorElement({
        state: 'text', 
        text:   overlayVisible ? "Close" : "Open"
    })

    const h_link = useCursorElement({
        state: 'icon', 
        icon: <MousePointerClickIcon className='size-10 inline text-white '/>
    })
    return (
        <div>
            <motion.div
                onClick={handleMenuToggle}
                initial={false}
                animate={{
                    scale: overlayVisible ? 0.92 : 1,
                }}
                whileTap={{
                    scale: 0.85,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                }}
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
      "
            >
                <Magnetic><div className="relative flex items-center justify-center pointer-events-auto" {...h}>
                    <AnimatePresence mode="wait">
                        {overlayVisible ? (
                            <motion.div
                                key="close"
                                initial={{
                                    rotate: -90,
                                    opacity: 0,
                                    scale: 0.5,
                                }}
                                animate={{
                                    rotate: 0,
                                    opacity: 1,
                                    scale: 1,
                                }}
                                exit={{
                                    rotate: 90,
                                    opacity: 0,
                                    scale: 0.5,
                                }}
                                transition={{
                                    duration: 0.25,
                                    ease: "easeInOut",
                                }}
                            >
                                <X className="menuIconSize" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{
                                    rotate: 90,
                                    opacity: 0,
                                    scale: 0.5,
                                }}
                                animate={{
                                    rotate: 0,
                                    opacity: 1,
                                    scale: 1,
                                }}
                                exit={{
                                    rotate: -90,
                                    opacity: 0,
                                    scale: 0.5,
                                }}
                                transition={{
                                    duration: 0.25,
                                    ease: "easeInOut",
                                }}
                            >
                                <Menu className="menuIconSize" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div></Magnetic>
            </motion.div>
            <nav className="fixed top-0 w-full flex justify-between mix-blend-difference z-1000 mt-2 lg:mt-[0.9vw]">
                {[1, 2].map((_, i) => (
                    <Magnetic key={i}>
                        <div className="flex items-center">
                            <p className="navText">RAVEN</p>
                            <RavenLogo />
                            <p className="navText">UNLEASHED</p>
                        </div>
                    </Magnetic>
                ))}
            </nav>
            <div
                ref={squareContainerRef}
                className="fixed top-0 left-0 flex flex-wrap pointer-events-none z-40"
            />
            <div ref={menuRef} className="menuOverlay opacity-0">
                <div className="menuOverlayInner">
                    <h1 className="menuOverlayHeading">
                        w<span className="font-gridular">or</span>k wi
                        <span className="font-gridular">t</span>h
                        <span className="font-gridular"> R</span>AV
                        <span className="font-gridular">E</span>N
                    </h1>
                    <div className="flex flex-col gap-4 lg:gap-[1vw]">
                        {links.map((link, i) => (
                            <div key={link.href} className="flex gap-4 lg:gap-[1.8vw]">
                                <span className="menuIndex">
                                    ({String(i + 1).padStart(2, "0")})
                                </span>
                                <Link href={link.href} className="menuLink" onClick={closeMenu} {...h_link}>
                                    <StaggerText text={link.name} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar