"use client"

import { useEffect, useRef, useState } from "react"

type Variant = {
  font: string
  color?: string
}

type AnimatedFontTextProps = {
  text: string
  variants: Variant[]
  holdTime?: number
  iterations?: number
  cycleDelay?: number
  className?: string
}

export default function AnimatedFontText({
  text,
  variants,
  holdTime = 150,
  iterations = 8,
  cycleDelay = 1000,
  className,
}: AnimatedFontTextProps) {

  const [index, setIndex] = useState(0)
  const [lockedWidth, setLockedWidth] = useState<number | null>(null)

  const textRef = useRef<HTMLSpanElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 🔥 Measure widest font once
  useEffect(() => {
    if (!textRef.current) return

    const el = textRef.current
    let maxWidth = 0

    variants.forEach((variant) => {
      el.style.fontFamily = `var(${variant.font})`
      const width = el.getBoundingClientRect().width
      if (width > maxWidth) maxWidth = width
    })

    setLockedWidth(maxWidth)
  }, [variants])

  // 🔥 Random cycling
  useEffect(() => {
    let step = 0

    const runCycle = () => {
      step = 0

      const runStep = () => {
        const randomIndex = Math.floor(Math.random() * variants.length)
        setIndex(randomIndex)
        step++

        if (step < iterations) {
          timeoutRef.current = setTimeout(runStep, holdTime)
        } else {
          timeoutRef.current = setTimeout(runCycle, cycleDelay)
        }
      }

      runStep()
    }

    runCycle()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [variants, holdTime, iterations, cycleDelay])

  return (
    <span
      style={{
        width: lockedWidth ?? "auto",
        display: "inline-block",
      }}
    >
      <strong
        ref={textRef}
        style={{
          fontFamily: `var(${variants[index].font})`,
          color: variants[index].color,
          whiteSpace: "nowrap",
        }}
        className={className}
      >
        {text}
      </strong>
    </span>
  )
}