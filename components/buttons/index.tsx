"use client"
import React, { useEffect, useRef, ReactNode } from 'react'
import gsap from 'gsap';
import clsx from "clsx"

type ButtonProps = {
    children: React.ReactNode
    variant?: "magnetic" | "custom-cursor" | "pseudo"
    className?: string
}

export function Button({
    children,
    variant = "pseudo",
    className
}: ButtonProps) {

    if (variant === "pseudo") {
        return (
            <div
                className={clsx(
                    "relative overflow-hidden inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-zinc-800 dark:border-zinc-200 group cursor-pointer",
                    className
                )}
            >
                {/* Sliding Circle */}
                <span
                    className="
            absolute 
            left-1/2 
            top-full 
            -translate-x-1/2 
            w-[200%] 
            aspect-square 
            bg-black dark:bg-white
            rounded-full 
            transition-all 
            duration-500 
            ease-[cubic-bezier(0.33,1,0.68,1)]
            group-hover:top-1/2
            group-hover:-translate-y-1/2
          "
                />

                {/* Text */}
                <span
                    className="
            relative z-10 
            mix-blend-difference 
            text-white 
            text-sm 
            font-medium 
            tracking-wide
          "
                >
                    {children}
                </span>
            </div>
        )
    }

    return null
}

interface MagneticProps {
    children: ReactNode; // ReactElement ki jagah ReactNode use karein
    className?: string;
}

export function Magnetic({ children, className }: MagneticProps) {
    // Wrapper div ke liye ref
    const magneticRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = magneticRef.current;
        if (!element) return;

        const xTo = gsap.quickTo(element, "x", {
            duration: 1,
            ease: "elastic.out(1, 0.3)",
        });

        const yTo = gsap.quickTo(element, "y", {
            duration: 1,
            ease: "elastic.out(1, 0.3)",
        });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const rect = element.getBoundingClientRect();
            // Offset calculation
            const x = clientX - (rect.left + rect.width / 2);
            const y = clientY - (rect.top + rect.height / 2);

            xTo(x * 0.4); // Multiplier se smoothness adjust karein
            yTo(y * 0.4);
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            element.removeEventListener("mousemove", handleMouseMove);
            element.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <div 
            ref={magneticRef} 
            className={clsx("inline-block", className)}
            style={{ 
                cursor: "pointer",
                // Children ke pointer events block karna taki interaction smooth rahe
                touchAction: "none" 
            }}
        >
            <div className="pointer-events-none">
                {children}
            </div>
        </div>
    );
}