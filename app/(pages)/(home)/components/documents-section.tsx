"use client"
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { BookOpen, Briefcase, Code, FileText, Github, Linkedin } from 'lucide-react';
import { useEffect, useRef, useState } from "react";

interface Particle {
    x: number
    y: number
    originX: number
    originY: number
    size: number
    baseSize: number
    opacity: number
    baseOpacity: number
    speed: number
    phase: number
    attracted: boolean
    glowing: boolean
    glowReady?: boolean
    cardIndex?: number
}

interface RelativeRect {
    left: number
    top: number
    right: number
    bottom: number
    width: number
    height: number
}

const documents = [
    {
        id: 1,
        title: "Resume",
        icon: <FileText className="w-8 h-8" />,
        description: "My professional journey",
        link: "#",
        color: "bg-rose-50 border-rose-200 hover:bg-rose-100",
        iconColor: "text-rose-500",
        rotation: "-rotate-3",
        position: "top-8 left-[10%]",
        size: "w-64 h-72",
        glowColor: "rgba(255, 100, 100, 0.6)",
        glowColorEdge: "255, 100, 100",
    },
    {
        id: 2,
        title: "LinkedIn",
        icon: <Linkedin className="w-8 h-8" />,
        description: "Let's connect professionally",
        link: "#",
        color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
        iconColor: "text-blue-600",
        rotation: "rotate-2",
        position: "top-16 right-[15%]",
        size: "w-72 h-64",
        glowColor: "rgba(59, 130, 246, 0.6)",
        glowColorEdge: "59, 130, 246",
    },
    {
        id: 3,
        title: "GitHub",
        icon: <Github className="w-8 h-8" />,
        description: "Where I push code",
        link: "#",
        color: "bg-gray-50 border-gray-300 hover:bg-gray-100",
        iconColor: "text-gray-800",
        rotation: "-rotate-1",
        position: "bottom-20 left-[20%]",
        size: "w-56 h-68",
        glowColor: "rgba(180, 180, 180, 0.6)",
        glowColorEdge: "200, 200, 200",
    },
    {
        id: 4,
        title: "Blog",
        icon: <BookOpen className="w-8 h-8" />,
        description: "My thoughts & tutorials",
        link: "#",
        color: "bg-amber-50 border-amber-200 hover:bg-amber-100",
        iconColor: "text-amber-600",
        rotation: "rotate-6",
        position: "top-24 right-[35%]",
        size: "w-60 h-64",
        glowColor: "rgba(245, 158, 11, 0.6)",
        glowColorEdge: "245, 158, 11",
    },
    {
        id: 5,
        title: "Projects",
        icon: <Code className="w-8 h-8" />,
        description: "What I've built",
        link: "#",
        color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
        iconColor: "text-purple-600",
        rotation: "-rotate-2",
        position: "bottom-32 right-[25%]",
        size: "w-68 h-60",
        glowColor: "rgba(147, 51, 234, 0.6)",
        glowColorEdge: "147, 51, 234",
    },
    {
        id: 6,
        title: "Portfolio",
        icon: <Briefcase className="w-8 h-8" />,
        description: "Complete work showcase",
        link: "#",
        color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
        iconColor: "text-emerald-600",
        rotation: "rotate-3",
        position: "top-40 left-[30%]",
        size: "w-64 h-64",
        glowColor: "rgba(16, 185, 129, 0.6)",
        glowColorEdge: "16, 185, 129",
    }
];

// ─── Config ──────────────────────────────────────────────────
// Reduced particle count for better performance
const PARTICLE_COUNT = 500
const ATTRACTION_RADIUS = 40
const ATTRACTION_DISTANCE = 10
const CARD_COUNT = documents.length
const FLOAT_AMPLITUDE = 5
const FLOAT_FREQUENCY = 0.02

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

function borderPoint(r: RelativeRect): { x: number; y: number } {
    const perimeter = 2 * (r.width + r.height)
    const t = Math.random() * perimeter
    if (t < r.width) return { x: r.left + t, y: r.top }
    if (t < r.width + r.height) return { x: r.right, y: r.top + (t - r.width) }
    if (t < 2 * r.width + r.height)
        return { x: r.right - (t - r.width - r.height), y: r.bottom }
    return { x: r.left, y: r.bottom - (t - 2 * r.width - r.height) }
}

function isVisible(p: Particle, width: number, height: number, margin = 50): boolean {
    return p.x > -margin && p.x < width + margin && p.y > -margin && p.y < height + margin
}

export function DocumentsSection() {
    // Single boolean array — only triggers re-render when a card's glow state actually toggles
    const glowState = useRef<boolean[]>(Array(CARD_COUNT).fill(false))
    const [glowFlags, setGlowFlags] = useState<boolean[]>(Array(CARD_COUNT).fill(false))

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const cardRefs = useRef<(HTMLDivElement | null)[]>(Array(CARD_COUNT).fill(null))
    const mouseRef = useRef({ x: -9999, y: -9999 })
    const frameRef = useRef(0)
    const activeGlowColors = useRef<{ [key: number]: string }>({})
    const activeGlowEdgeColors = useRef<{ [key: number]: string }>({})

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true })
        if (!ctx) return

        let cardRects: (RelativeRect | null)[] = []
        let width = canvas.width
        let height = canvas.height

        const updateCardRects = () => {
            const canvasRect = canvas.getBoundingClientRect()
            cardRects = cardRefs.current.map((card) => {
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

        const particles = generateParticles(PARTICLE_COUNT, width, height)

        let animationId: number
        let t = 0

        let mouseX = -9999
        let mouseY = -9999
        let needsMouseUpdate = false

        const processMouseUpdate = () => {
            if (!needsMouseUpdate) return
            mouseRef.current.x = mouseX
            mouseRef.current.y = mouseY
            const mx = mouseRef.current.x
            const my = mouseRef.current.y

            // Throttle to every 2 frames
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
            mouseRef.current.x = -9999
            mouseRef.current.y = -9999
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

        const enterHandlers: (() => void)[] = []
        const leaveHandlers: (() => void)[] = []

        // Track how many particles per card have settled (glowReady)
        const cardReadyCount = new Array(CARD_COUNT).fill(0)

        cardRefs.current.forEach((card, idx) => {
            if (!card) return
            let isHovered = false

            const onEnter = () => {
                if (isHovered) return
                isHovered = true
                updateCardRects()
                const r = cardRects[idx]
                if (!r) return

                activeGlowColors.current[idx] = documents[idx].glowColor
                activeGlowEdgeColors.current[idx] = documents[idx].glowColorEdge
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
                            // Only trigger state update once when enough particles settle
                            if (!glowState.current[idx] && cardReadyCount[idx] >= 10) {
                                glowState.current[idx] = true
                                setGlowFlags(prev => {
                                    const next = [...prev]
                                    next[idx] = true
                                    return next
                                })
                            }
                        }
                    })
                }
            }

            const onLeave = () => {
                if (!isHovered) return
                isHovered = false
                delete activeGlowColors.current[idx]
                delete activeGlowEdgeColors.current[idx]
                cardReadyCount[idx] = 0

                // Batch the glow state update — single setState call
                if (glowState.current[idx]) {
                    glowState.current[idx] = false
                    setGlowFlags(prev => {
                        const next = [...prev]
                        next[idx] = false
                        return next
                    })
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

        // ─── Offscreen buffer for particle rendering (reduces main canvas redraws) ───
        const offscreen = document.createElement("canvas")
        const offCtx = offscreen.getContext("2d")!

        const syncOffscreen = () => {
            offscreen.width = canvas.width
            offscreen.height = canvas.height
        }
        syncOffscreen()
        window.addEventListener("resize", syncOffscreen)

        const draw = () => {
            frameRef.current++
            processMouseUpdate()

            if (document.hidden) {
                animationId = requestAnimationFrame(draw)
                return
            }

            ctx.clearRect(0, 0, width, height)

            // ─── Clip out card areas ───
            ctx.save()
            ctx.beginPath()
            ctx.rect(0, 0, width, height)
            for (let i = 0; i < cardRects.length; i++) {
                const r = cardRects[i]
                if (r) ctx.rect(r.left, r.top, r.width, r.height)
            }
            ctx.clip("evenodd")

            // ─── Draw particles ───
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i]
                if (!isVisible(p, width, height)) continue
                if (p.glowReady) continue

                const twinkle = p.glowing ? 0 : Math.sin(t * p.speed * 60 + p.phase) * 0.07
                const alpha = Math.max(0, Math.min(1, p.opacity + twinkle))
                if (alpha < 0.02) continue

                let offsetY = 0
                if (!p.attracted && !p.glowing) {
                    offsetY = Math.sin(t * FLOAT_FREQUENCY + p.phase) * FLOAT_AMPLITUDE
                }

                const drawX = p.x
                const drawY = p.y + offsetY

                if (p.glowing) {
                    // Simple bright dot — no expensive radial gradient per particle
                    const edgeColor = p.cardIndex !== undefined
                        ? activeGlowEdgeColors.current[p.cardIndex] || "255,255,255"
                        : "255,255,255"
                    ctx.beginPath()
                    ctx.arc(drawX, drawY, p.size * 1.5, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(${edgeColor}, ${alpha})`
                    ctx.fill()
                } else {
                    ctx.beginPath()
                    ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
                    ctx.fill()
                }
            }

            ctx.restore()

            // ─── Card edge glow pass ───
            // Draw a tight glowing border stroke around each active card rect
            // This runs directly on the main canvas OUTSIDE the clip region
            for (let idx = 0; idx < CARD_COUNT; idx++) {
                if (!glowState.current[idx]) continue
                const r = cardRects[idx]
                if (!r) continue

                const edgeColor = activeGlowEdgeColors.current[idx]
                if (!edgeColor) continue

                // Outer soft halo (wide, low opacity)
                ctx.save()
                ctx.shadowBlur = 28
                ctx.shadowColor = `rgba(${edgeColor}, 0.5)`
                ctx.strokeStyle = `rgba(${edgeColor}, 0.15)`
                ctx.lineWidth = 14
                ctx.beginPath()
                ctx.roundRect(r.left, r.top, r.width, r.height, 16)
                ctx.stroke()
                ctx.restore()

                // Inner crisp edge glow (tight, high opacity)
                ctx.save()
                ctx.shadowBlur = 10
                ctx.shadowColor = `rgba(${edgeColor}, 0.9)`
                ctx.strokeStyle = `rgba(${edgeColor}, 0.7)`
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

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener("resize", resize)
            window.removeEventListener("resize", syncOffscreen)
            canvas.removeEventListener("mousemove", handleMouseMove)
            canvas.removeEventListener("mouseleave", handleMouseLeave)
            cardRefs.current.forEach((card, i) => {
                if (!card) return
                card.removeEventListener("mouseenter", enterHandlers[i])
                card.removeEventListener("mouseleave", leaveHandlers[i])
            })
            gsap.killTweensOf(particles)
        }
    }, [])

    return (
        <section className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden flex items-center justify-center ">
            {/* Canvas sits behind everything */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

            {/* Desktop Layout (UNCHANGED) */}
            <div className="hidden md:block card-grid relative w-full max-w-7xl mx-auto h-[600px]">
                {documents.map((doc, i) => (
                    <div
                        key={doc.id}
                        ref={(el) => { cardRefs.current[i] = el }}
                        className={cn(
                            "card-item",
                            `absolute ${doc.position} ${doc.size} ${doc.rotation}`,
                            "z-10 hover:z-20",
                            "transform transition-all duration-300 ease-in-out",
                            "hover:scale-105 hover:rotate-0 cursor-pointer group",
                        )}
                    >
                        {/*
                         * CSS box-shadow glow — tied to the card element itself so it
                         * ALWAYS moves with the card. z-index is inherited from parent.
                         * glowFlags[i] drives the CSS class, not glowState.current.
                         */}
                        <div
                            className={cn(
                                "absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500",
                                // z-[19] keeps glow above resting cards (z-10) but below hovered card (z-20)
                                "z-[19]",
                                glowFlags[i] ? "opacity-100" : "opacity-0"
                            )}
                            style={{
                                boxShadow: `
                                    0 0 0 1.5px rgba(${doc.glowColorEdge}, 0.7),
                                    0 0 16px 6px  rgba(${doc.glowColorEdge}, 0.45),
                                    0 0 32px 12px rgba(${doc.glowColorEdge}, 0.25),
                                    0 0 56px 20px rgba(${doc.glowColorEdge}, 0.1)
                                `,
                            }}
                        />

                        <a
                            href={doc.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "relative w-full h-full border-2 rounded-2xl p-6 flex flex-col items-center justify-center",
                                "shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden",
                                doc.color
                            )}
                        >
                            {/* Corner decorations — these live inside the <a> so they
                                always move with the card. No separate float animation. */}
                            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-current opacity-30 rounded-tr-sm pointer-events-none" />
                            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-current opacity-30 rounded-tl-sm pointer-events-none" />
                            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-current opacity-30 rounded-br-sm pointer-events-none" />
                            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-current opacity-30 rounded-bl-sm pointer-events-none" />
                            <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-current rounded-full opacity-20 pointer-events-none" />
                            <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-current rounded-full opacity-20 pointer-events-none" />

                            {/* Card content */}
                            <div className="relative z-10 text-center">
                                <div className={cn("mb-4 transition-transform duration-300 group-hover:scale-110", doc.iconColor)}>
                                    {doc.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">{doc.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{doc.description}</p>
                                <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                    <span>Explore</span>
                                    <svg
                                        className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    </div>
                ))}
            </div>

            {/* Mobile Layout (GRID) */}
            <div className="lg:hidden relative z-10 w-full px-4 py-10">
                <div className="grid grid-cols-2 gap-4">
                    {documents.map((doc, i) => (
                        <div
                            key={doc.id}
                            // ref={(el) => { cardRefs.current[i] = el }}
                            className={cn(
                                "relative h-40 group cursor-pointer",
                                "transition-transform duration-300 active:scale-95"
                            )}
                        >
                            {/* SAME CARD CONTENT */}
                            <a
                                href={doc.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "relative w-full h-full border-2 rounded-2xl p-6 flex flex-col items-center justify-center",
                                    "shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden",
                                    doc.color
                                )}
                            >
                                {/* Corner decorations — these live inside the <a> so they
                                always move with the card. No separate float animation. */}
                                <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-current opacity-30 rounded-tr-sm pointer-events-none" />
                                <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-current opacity-30 rounded-tl-sm pointer-events-none" />
                                <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-current opacity-30 rounded-br-sm pointer-events-none" />
                                <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-current opacity-30 rounded-bl-sm pointer-events-none" />
                                <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-current rounded-full opacity-20 pointer-events-none" />
                                <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-current rounded-full opacity-20 pointer-events-none" />

                                {/* Card content */}
                                <div className="relative z-10 text-center">
                                    <div className={cn("mb-4 transition-transform duration-300 group-hover:scale-110", doc.iconColor)}>
                                        {doc.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{doc.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{doc.description}</p>
                                    <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                        <span>Explore</span>
                                        <svg
                                            className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                /*
                 * Uses the 'float' keyframe defined in globals.css.
                 * Targets only direct .card-item children of .card-grid so
                 * nested absolute elements (corner decorations etc.) are unaffected.
                 */
                .card-grid > .card-item {
                    animation: float 6s ease-in-out infinite;
                }
                .card-grid > .card-item:nth-child(1) { animation-delay: 0s;  animation-duration: 6s; }
                .card-grid > .card-item:nth-child(2) { animation-delay: -2s; animation-duration: 7s; }
                .card-grid > .card-item:nth-child(3) { animation-delay: -4s; animation-duration: 5s; }
                .card-grid > .card-item:nth-child(4) { animation-delay: -1s; animation-duration: 8s; }
                .card-grid > .card-item:nth-child(5) { animation-delay: -3s; animation-duration: 6s; }
                .card-grid > .card-item:nth-child(6) { animation-delay: -5s; animation-duration: 7s; }
 
                /* Pause float on hover so it doesn't fight the scale/rotate transition */
                .card-grid > .card-item:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    )
}