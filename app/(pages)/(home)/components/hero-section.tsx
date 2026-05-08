"use client";

import Appear from "@/components/text-animations/appear";
import SplitText from "@/components/text-animations/split-text";


export function HeroSection() {
    return (
        <section className="relative blueprint-bg w-full h-dvh flex flex-col items-center justify-center bg-white dark:bg-black px-2 sm:px-4">
            <Appear delay={0.1}>
            <span className="relative overflow-hidden
    uppercase font-rmNeue font-light
    text-xs sm:text-sm md:text-base
    lg:text-[0.95vw] xl:text-[1vw] 2xl:text-[1.25vw]
    py-0.5 sm:py-1 md:py-1.5
    lg:py-[0.4vw] xl:py-[0.5vw]
    px-1.5 sm:px-2.5 md:px-3.5
    lg:px-[0.8vw] xl:px-[1vw] 2xl:px-[1.2vw]
    rounded-full line-clamp-1
    bg-white border">
  {/* Shimmer layer — sits inside but overflows clipping is handled by the outer span */}
  <span
    className="
      absolute inset-0 rounded-full overflow-hidden pointer-events-none
      before:content-['']
      before:absolute
      before:top-[-50%]
      before:left-0
      before:h-[200%]
      before:w-[20%]
      before:rotate-[25deg]
      before:bg-gradient-to-r
      before:from-transparent
      before:via-lime-accent/70
      before:to-transparent
      before:blur-md
    before:animate-[shimmer_4s_cubic-bezier(0.4,0,0.2,1)_infinite]
    "
  />
  <span
    className="
      relative z-10
      uppercase font-rmNeue font-light
      text-xs sm:text-sm md:text-base
      lg:text-[0.95vw] xl:text-[1vw] 2xl:text-[1.25vw]
      py-0.5 sm:py-1 md:py-1.5
      lg:py-[0.4vw] xl:py-[0.5vw]
      px-1.5 sm:px-2.5 md:px-3.5
      lg:px-[0.8vw] xl:px-[1vw] 2xl:px-[1.2vw]
      block line-clamp-1
    "
  >
    Ashutosh Sharan
  </span>
</span>
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
            <span className="relative overflow-hidden
    uppercase font-rmNeue font-light
    text-xs sm:text-sm md:text-base
    lg:text-[0.95vw] xl:text-[1vw] 2xl:text-[1.25vw]
    py-0.5 sm:py-1 md:py-1.5
    lg:py-[0.4vw] xl:py-[0.5vw]
    px-1.5 sm:px-2.5 md:px-3.5
    lg:px-[0.8vw] xl:px-[1vw] 2xl:px-[1.2vw]
    rounded-full line-clamp-1
    bg-white border">
  {/* Shimmer layer — sits inside but overflows clipping is handled by the outer span */}
  <span
    className="
      absolute inset-0 rounded-full overflow-hidden pointer-events-none
      before:content-['']
      before:absolute
      before:top-[-50%]
      before:left-0
      before:h-[200%]
      before:w-[20%]
      before:rotate-[25deg]
      before:bg-gradient-to-r
      before:from-transparent
      before:via-lime-accent/70
      before:to-transparent
      before:blur-md
    before:animate-[shimmer_4s_cubic-bezier(0.4,0,0.2,1)_infinite]
    "
  />
  <span
    className="
      relative z-10
      uppercase font-rmNeue font-light
      text-xs sm:text-sm md:text-base
      lg:text-[0.95vw] xl:text-[1vw] 2xl:text-[1.25vw]
      py-0.5 sm:py-1 md:py-1.5
      lg:py-[0.4vw] xl:py-[0.5vw]
      px-1.5 sm:px-2.5 md:px-3.5
      lg:px-[0.8vw] xl:px-[1vw] 2xl:px-[1.2vw]
      block line-clamp-1
    "
  >
    Ashutosh Sharan
  </span>
</span>
            </Appear>
        </section>
    );
}