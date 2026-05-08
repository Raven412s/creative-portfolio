"use client";

import Appear from "@/components/text-animations/appear";
import SplitText from "@/components/text-animations/split-text";
interface GlassPillProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassPill({ children, className = "" }: GlassPillProps) {
  return (
    <span
      className={`
        relative inline-flex items-center justify-center
        rounded-full isolate overflow-hidden
        line-clamp-1
        ${className}
      `}
      style={{
        background: "rgba(255,255,255,0.28)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        boxShadow: `
          0 -1px 0 0.5px rgba(255,255,255,1),
          0  1px 0 0.5px rgba(0,0,0,0.13),
          -1px 0 0 0.5px rgba(255,255,255,0.9),
           1px 0 0 0.5px rgba(0,0,0,0.06),
          inset 0 3px 8px  rgba(0,0,0,0.10),
          inset 0 6px 18px rgba(0,0,0,0.07),
          inset 0 1px 3px  rgba(0,0,0,0.12),
          inset 0 2px 4px  rgba(0,0,0,0.09),
          inset 0 -1px 2px rgba(255,255,255,0.8),
          0 0 0 1px rgba(0,0,0,0.055),
          0 2px 12px rgba(0,0,0,0.06)
        `,
      }}
    >
      {/* Top specular arc */}
      <span aria-hidden className="absolute pointer-events-none z-[1] inset-x-[14%] top-px h-[38%]"
        style={{
          borderRadius: "0 0 55% 55% / 0 0 100% 100%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.75) 0%, transparent 100%)",
        }}
      />

      {/* Bottom inner bounce */}
      <span aria-hidden className="absolute pointer-events-none z-[1] inset-x-[20%] bottom-0.5 h-[28%]"
        style={{
          borderRadius: "55% 55% 0 0 / 100% 100% 0 0",
          background: "linear-gradient(0deg, rgba(255,255,255,0.6) 0%, transparent 100%)",
        }}
      />

      {/* Left rim light */}
      <span aria-hidden className="absolute pointer-events-none z-[1] left-px inset-y-[15%] w-[6%]"
        style={{
          borderRadius: "100% 0 0 100% / 50% 0 0 50%",
          background: "linear-gradient(90deg, rgba(255,255,255,0.55) 0%, transparent 100%)",
        }}
      />

      {/* Right rim light */}
      <span aria-hidden className="absolute pointer-events-none z-[1] right-px inset-y-[15%] w-[6%]"
        style={{
          borderRadius: "0 100% 100% 0 / 0 50% 50% 0",
          background: "linear-gradient(270deg, rgba(255,255,255,0.35) 0%, transparent 100%)",
        }}
      />

      {/* Content */}
      <span className="relative z-10 block line-clamp-1">
        {children}
      </span>
    </span>
  );
}
export function HeroSection() {
  return (
    <section className="relative blueprint-bg w-full h-dvh flex flex-col items-center justify-center bg-white dark:bg-black px-2 sm:px-4">
      <Appear delay={0.1}>
        <GlassPill className="relative overflow-hidden
    uppercase font-rmNeue font-light
    text-xs sm:text-sm md:text-base
    lg:text-[0.95vw] xl:text-[1vw] 2xl:text-[1.25vw]
    py-0.5 sm:py-1 md:py-1.5
    lg:py-[0.4vw] xl:py-[0.5vw]
    px-1.5 sm:px-2.5 md:px-3.5
    lg:px-[0.8vw] xl:px-[1vw] 2xl:px-[1.2vw]
    rounded-full line-clamp-1 m-1.5">
          <span className="
    before:content-[''] before:absolute before:top-[-50%] before:left-0
    before:h-[200%] before:w-[28%] before:rotate-[25deg]
    before:bg-gradient-to-r before:from-transparent before:via-lime-accent/55 before:to-transparent
    before:blur-lg before:animate-[shimmer_4s_cubic-bezier(0.6,1.2,0.8,1)_infinite]
    text-black/75 dark:text-white/80
  ">
            Ashutosh Sharan
          </span>
        </GlassPill>
      </Appear>

      <div className="my-10">
        {[
          "r{es}tor{ing}",
          "{me}a{n}in{g}",
          "{to} t{hin}g{s}",
          "{i}{ bu}il{d}"
        ].map((line, i) => (
          <Appear
            key={i}
            delay={0.15 + i * 0.12}
          >
            <h1 className="font-rmNeue font-medium leading-[1.1] sm:leading-[0.9] md:leading-[0.85] lg:leading-[85%] text-center uppercase text-[9vw] sm:text-[12vw] md:text-[12vw] lg:text-[10vw] xl:text-[9vw] 2xl:text-[8vw]">
              <SplitText text={line} highlightClassName="font-gridular" />
            </h1>
          </Appear>
        ))}
      </div>

      <Appear delay={0.75}>
        <GlassPill className="relative overflow-hidden
    uppercase font-rmNeue font-light
    text-xs sm:text-sm md:text-base
    lg:text-[0.95vw] xl:text-[1vw] 2xl:text-[1.25vw]
    py-0.5 sm:py-1 md:py-1.5
    lg:py-[0.4vw] xl:py-[0.5vw]
    px-1.5 sm:px-2.5 md:px-3.5
    lg:px-[0.8vw] xl:px-[1vw] 2xl:px-[1.2vw]
    rounded-full line-clamp-1 m-1.5">
          <span className="
    before:content-[''] before:absolute before:top-[-50%] before:left-0
    before:h-[200%] before:w-[28%] before:rotate-[25deg]
    before:bg-gradient-to-r before:from-transparent before:via-lime-accent/55 before:to-transparent
    before:blur-lg before:animate-[shimmer_4s_cubic-bezier(0.6,1.2,0.8,1)_infinite]
    text-black/75 dark:text-white/80
    m-1.5
  ">
            Ashutosh Sharan
          </span>
        </GlassPill>
      </Appear>
    </section>
  );
}