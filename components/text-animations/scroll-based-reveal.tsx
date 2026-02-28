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
    className = ""

}: ClipTextProps) {

    const container = useRef<HTMLDivElement | null>(null)


    /* speed-based offset adjustment (optional) */

    const startOffset = 0.9
    const endOffset = 0.9 - 0.4 / speed

    const computedOffset: OffsetType =
        offset ??
        [
            `start ${startOffset}`,
            `center ${endOffset}`
        ]


    /* scroll progress */

    const { scrollYProgress } = useScroll({
        target: container,
        offset: computedOffset
    })


    /* reveal progress */

    const progress: MotionValue<number> = useTransform(
        scrollYProgress,
        [0, 1],
        [100, 0]
    )


    /* clip direction */

    const clipLeft =
        useMotionTemplate`inset(0 0 0 ${progress}%)`

    const clipRight =
        useMotionTemplate`inset(0 ${progress}% 0 0)`

    const clip =
        direction === "left"
            ? clipLeft
            : clipRight


    const MotionTag = motion(Tag)


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