"use client"
import { cn } from "@/lib/utils";
import {motion}  from "framer-motion";
import { AnimationStart, AnimationVariant, useThemeToggle } from "@/components/ui/skiper-ui/skiper26";
import { Button } from "@/components/ui/button";



export const ThemeToggler = ({
    className = "",
    variant = "circle",
    start = "center",
    blur = false,
    gifUrl = "",
}: {
    className?: string;
    variant?: AnimationVariant;
    start?: AnimationStart;
    blur?: boolean;
    gifUrl?: string;
}) => {
    const { isDark, toggleTheme } = useThemeToggle({
        variant,
        start,
        blur,
        gifUrl,
    });

    const sunPath =
        "M70 49.5C70 60.8218 60.8218 70 49.5 70C38.1782 70 29 60.8218 29 49.5C29 38.1782 38.1782 29 49.5 29C60 29 69.5 38 70 49.5Z";
    const moonPath =
        "M70 49.5C70 60.8218 60.8218 70 49.5 70C38.1782 70 29 60.8218 29 49.5C29 38.1782 38.1782 29 49.5 29C39 45 49.5 59.5 70 49.5Z";
    const raysVariants = {
        hidden: {
            strokeOpacity: 0,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
            },
        },
        visible: {
            strokeOpacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };
    return (
        <Button
            size={"icon"}
            type="button"
            variant={"outline"}
            className={cn(
                "cursor-pointer rounded-full border p-0 transition-all duration-300 active:scale-95",
                className,
            )}
            onClick={toggleTheme}
            aria-label="Toggle theme"
        >
            <span className="sr-only">Toggle theme</span>
            <motion.svg
                strokeWidth="4"
                strokeLinecap="round"
                width={50}
                height={50}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative"
            >
                <motion.path
                    variants={{
                        hidden: {
                            opacity: 0,
                            scale: 2,
                            strokeDasharray: "20, 1000",
                            strokeDashoffset: 0,
                            filter: "blur(0.5px)",
                        },
                        visible: {
                            opacity: [0, 1, 0],
                            strokeDashoffset: [0, -50, -100],
                            filter: ["blur(0.5px)", "blur(0.5px)", "blur(0px)"],

                            transition: {
                                duration: 0.75,
                                ease: [0.25, 0.25, 0.75, 0.75], // cubic-bezier for linear
                            },
                        },
                    }}
                    d={moonPath}
                    className={"absolute top-0 left-0 stroke-blue-100  "}
                    initial="hidden"
                    animate={!isDark ? "visible" : "hidden"}
                />

                <motion.g
                    variants={raysVariants}
                    initial="hidden"
                    animate={isDark ? "visible" : "hidden"}
                    className="stroke-6 stroke-yellow-400 brightness-125 "
                    style={{ strokeLinecap: "round" }}
                >
                    <motion.path
                        className="origin-center"
                        variants={{
                            hidden: {
                                pathLength: 0,
                                opacity: 0,
                                // Start from center of the circle
                                scale: 0,
                            },
                            visible: {
                                pathLength: 1,
                                opacity: 1,
                                scale: 1,
                                transition: {
                                    duration: 0.5,
                                    ease: "easeOut",
                                    // Customize timing for each property
                                    pathLength: { duration: 0.3 },
                                    opacity: { duration: 0.2 },
                                    scale: { duration: 0.3 },
                                },
                            },
                        }}
                        d="M50 2V11"
                    />
                    <motion.path variants={{
                        hidden: {
                            pathLength: 0,
                            opacity: 0,
                            // Start from center of the circle
                            scale: 0,
                        },
                        visible: {
                            pathLength: 1,
                            opacity: 1,
                            scale: 1,
                            transition: {
                                duration: 0.5,
                                ease: "easeOut",
                                // Customize timing for each property
                                pathLength: { duration: 0.3 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.3 },
                            },
                        },
                    }} d="M85 15L78 22" />
                    <motion.path variants={{
                        hidden: {
                            pathLength: 0,
                            opacity: 0,
                            // Start from center of the circle
                            scale: 0,
                        },
                        visible: {
                            pathLength: 1,
                            opacity: 1,
                            scale: 1,
                            transition: {
                                duration: 0.5,
                                ease: "easeOut",
                                // Customize timing for each property
                                pathLength: { duration: 0.3 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.3 },
                            },
                        },
                    }} d="M98 50H89" />
                    <motion.path variants={{
                        hidden: {
                            pathLength: 0,
                            opacity: 0,
                            // Start from center of the circle
                            scale: 0,
                        },
                        visible: {
                            pathLength: 1,
                            opacity: 1,
                            scale: 1,
                            transition: {
                                duration: 0.5,
                                ease: "easeOut",
                                // Customize timing for each property
                                pathLength: { duration: 0.3 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.3 },
                            },
                        },
                    }} d="M85 85L78 78" />
                    <motion.path variants={{
                        hidden: {
                            pathLength: 0,
                            opacity: 0,
                            // Start from center of the circle
                            scale: 0,
                        },
                        visible: {
                            pathLength: 1,
                            opacity: 1,
                            scale: 1,
                            transition: {
                                duration: 0.5,
                                ease: "easeOut",
                                // Customize timing for each property
                                pathLength: { duration: 0.3 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.3 },
                            },
                        },
                    }} d="M50 98V89" />
                    <motion.path variants={{
                        hidden: {
                            pathLength: 0,
                            opacity: 0,
                            // Start from center of the circle
                            scale: 0,
                        },
                        visible: {
                            pathLength: 1,
                            opacity: 1,
                            scale: 1,
                            transition: {
                                duration: 0.5,
                                ease: "easeOut",
                                // Customize timing for each property
                                pathLength: { duration: 0.3 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.3 },
                            },
                        },
                    }} d="M23 78L16 84" />
                    <motion.path variants={{
                        hidden: {
                            pathLength: 0,
                            opacity: 0,
                            // Start from center of the circle
                            scale: 0,
                        },
                        visible: {
                            pathLength: 1,
                            opacity: 1,
                            scale: 1,
                            transition: {
                                duration: 0.5,
                                ease: "easeOut",
                                // Customize timing for each property
                                pathLength: { duration: 0.3 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.3 },
                            },
                        },
                    }} d="M11 50H2" />
                    <motion.path variants={{
                        hidden: {
                            pathLength: 0,
                            opacity: 0,
                            // Start from center of the circle
                            scale: 0,
                        },
                        visible: {
                            pathLength: 1,
                            opacity: 1,
                            scale: 1,
                            transition: {
                                duration: 0.5,
                                ease: "easeOut",
                                // Customize timing for each property
                                pathLength: { duration: 0.3 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.3 },
                            },
                        },
                    }} d="M23 23L16 16" />
                </motion.g>

                <motion.path
                    d={sunPath}
                    fill="transparent"
                    transition={{ duration: 1, type: "spring" }}
                    initial={{ fillOpacity: 0, strokeOpacity: 0 }}
                    animate={
                        !isDark
                            ? {
                                d: moonPath,
                                rotate: -360,
                                scale: 2,
                                stroke: "var(--color-blue-400)",
                                fill: "var(--color-blue-400)",
                                fillOpacity: 0.35,
                                strokeOpacity: 1,
                                transition: { delay: 0.1 },
                            }
                            : {
                                d: sunPath,
                                rotate: 0,
                                stroke: "#fff900",
                                fill: "#fff900",
                                fillOpacity: 0.35,
                                strokeOpacity: 1,
                            }
                    }
                />
            </motion.svg>
        </Button>
    );
};