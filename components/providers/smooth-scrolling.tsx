"use client"

import ReactLenis, { useLenis } from "lenis/react"
import { useEffect } from "react"

function LenisLogger() {
  const lenis = useLenis(() => {})
  
  useEffect(() => {
    if (lenis) {
      console.log("Lenis Options:", lenis.options)
      console.log("Lenis Instance:", lenis)
    }
  }, [lenis])

  return null
}

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05,
        syncTouchLerp: 0.05,
        duration: 1.2,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        infinite: false,
        autoResize: true,
        syncTouch: true,
      }}
    >
      <LenisLogger />  {/* ← yeh saare available options log karega */}
      {children}
    </ReactLenis>
  )
}