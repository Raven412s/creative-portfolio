"use client"

import RavenLogo from '@/components/svgs/raven-logo'
import React, { useEffect, useRef } from 'react'
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ReactModel } from '@/components/3D/react'
import { TypeScriptModel } from '@/components/3D/typescript'

gsap.registerPlugin(ScrollTrigger)

export function InteractiveSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".interactive-item", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)", // pop feel
        stagger: 0.2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className='h-screen w-full flex flex-col bg-[#202021] z-40'>
      <div ref={containerRef} className="relative w-full h-full">
        
        <div className="interactive-item absolute  w-62.5 h-62.5 rounded-full top-[10%] left-[19%]" ><ReactModel scale={1.5}/></div>

        <div className="interactive-item absolute w-62.5 h-62.5 rounded-xl rotate-3  bottom-[40%] left-[72%]" ><TypeScriptModel/></div>

        <div className="interactive-item absolute bg-amber-600 w-62.5 h-62.5 rounded-[38px] rotate-85 bottom-[20%] left-[12%]" ></div>

        <RavenLogo className='absolute scale-[800%] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-zinc-100 ' /> 

      </div>
    </section>
  )
}