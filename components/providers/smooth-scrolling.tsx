"use client"

import ReactLenis, { useLenis } from "lenis/react"
import { useEffect } from "react"



export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05,
        syncTouchLerp: 0.05,
        duration: 1.2,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
        autoResize: true,
        syncTouch: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}