'use client'

import type { LenisRef } from 'lenis/react'
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {

  const lenisRef = useRef<LenisRef>(null)

  // ✅ lazy initial state (NO useEffect needed)
  const [isTouch] = useState(() => {
    if (typeof window === "undefined") return false

    return (
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0
    )
  })

  useEffect(() => {
    if (isTouch) return

    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)
    return () => gsap.ticker.remove(update)

  }, [isTouch])

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: isTouch,
        duration: isTouch ? 0.9 : 1.5,

        easing: (t) =>
          Math.min(1, 1.001 - Math.pow(2, -10 * t)),

        syncTouch: true,
        touchMultiplier: 1.2,

        infinite: false,
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}