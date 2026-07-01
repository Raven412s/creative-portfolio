"use client"

import React, { useRef, ElementType, ReactNode } from "react"
import {
    useScroll,
    motion,
    useTransform,
    useMotionTemplate,
    MotionValue
} from "framer-motion"


/* ================= TYPE EXTRACTION ================= */

// extract exact offset type from useScroll
type UseScrollOptions = Parameters<typeof useScroll>[0]
type OffsetType = NonNullable<UseScrollOptions>["offset"]

type RevealDirection = "left" | "right"


/* ================= PROPS ================= */

interface ClipTextProps {
    children: ReactNode
    offset?: OffsetType
    speed?: number
    direction?: RevealDirection
    stroke?: boolean
    strokeWidth?: number
    strokeColor?: string
    as?: ElementType
    className?: string
    started?: boolean
    externalProgress?: MotionValue<number>
}

/* ================= COMPONENT ================= */

export default function ClipText({

    children,
    offset,
    speed = 1,
    direction = "right",
    stroke = false,
    strokeWidth = 1,
    strokeColor = "currentColor",
    as: Tag = "p",
    className = "",
    started = true,
    externalProgress,
}: ClipTextProps) {

    const container = useRef<HTMLDivElement | null>(null)

    const startOffset = 0.9
    const endOffset = 0.9 - 0.4 / speed

    const computedOffset: OffsetType = offset ?? [
        `start ${startOffset}`,
        `center ${endOffset}`
    ]

    const { scrollYProgress } = useScroll({
        target: container,
        offset: computedOffset
    })

    const internalProgress = useTransform(scrollYProgress, [0, 1], [100, 0])

    // ✅ external mile toh woh use karo, warna internal
    const baseProgress = externalProgress ?? internalProgress

    const clampedProgress = useTransform(baseProgress, (v) =>
        started ? v : 100
    )

    const clipLeft  = useMotionTemplate`inset(0 0 0 ${clampedProgress}%)`
    const clipRight = useMotionTemplate`inset(0 ${clampedProgress}% 0 0)`
    const clip = direction === "left" ? clipLeft : clipRight


    const MotionTag = motion.create(Tag)


    /* stroke style */

    const strokeStyle: React.CSSProperties = {

        WebkitTextStrokeWidth: `${strokeWidth}px`,
        WebkitTextStrokeColor: strokeColor,
        color: "transparent"

    }


    /* ================= RENDER ================= */

    return (

        <div
            ref={container}
            className="relative cursor-default"
        >

            <div className="inline-block relative">


                {/* stroke layer */}

                {stroke && (

                    <MotionTag
                        style={{
                            clipPath: clip,
                            ...strokeStyle
                        }}
                        className={`
                            absolute top-0
                            pointer-events-none
                            z-4
                            ${className}
                        `}
                    >
                        {children}
                    </MotionTag>

                )}


                {/* fill layer */}

                <MotionTag
                    style={{ clipPath: clip }}
                    className={`
                        inline-block relative
                        z-3
                        ${className}
                    `}
                >
                    {children}
                </MotionTag>


                {/* base layer */}

                <MotionTag
                    className={`
                        absolute top-0
                        text-gray-400/40
                        z-2
                        ${className}
                    `}
                >
                    {children}
                </MotionTag>


            </div>

        </div>

    )
}
