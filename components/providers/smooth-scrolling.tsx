"use client"

import ReactLenis, { useLenis } from "lenis/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect } from "react"

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    // ── Critical: tell ScrollTrigger to use Lenis's scroll position ──
    // Without this, ST reads native scrollY (always 0 with Lenis) and
    // all pinned sections fire at the wrong time, causing the jump.
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true })
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
    })

    // ── Sync: on every Lenis scroll tick, tell ST the position changed ──
    const onScroll = () => ScrollTrigger.update()
    lenis.on("scroll", onScroll)

    // ── Refresh after fonts load so pin spacer heights are correct ──
    document.fonts.ready.then(() => ScrollTrigger.refresh())

    return () => {
      lenis.off("scroll", onScroll)
      ScrollTrigger.clearScrollMemory()
    }
  }, [lenis])

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