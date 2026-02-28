"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CustomEase } from "gsap/CustomEase";
import Appear from "@/components/text-animations/appear";
import SplitText from "@/components/text-animations/split-text";
import ClipText from "@/components/text-animations/scroll-based-reveal";

gsap.registerPlugin(ScrollTrigger, CustomEase);

// ultra smooth ease (Apple-like)
CustomEase.create("premium", "0.76,0,0.24,1");

const InfoSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // animate in on scroll
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          scale: 1.15,
        },
        {
          opacity: 0.7,
          scale: 1,
          duration: 1.4,
          ease: "premium",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "top top",
            scrub: 2,
          },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
    h-screen w-full bg-zinc-800 text-zinc-100 relative overflow-hidden
    pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-36
    px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20
  "
    >
      {/* background pattern */}
      <div
        ref={containerRef}
        className="absolute inset-0 info-pattern"
      />

      {/* TOP LEFT HEADING */}
      <div
        className="
      absolute
      top-20 sm:top-24 md:top-28 lg:top-32 xl:top-36
      left-5 sm:left-8 md:left-12 lg:left-16 xl:left-20
      right-5 sm:right-auto
    "
      >
        <Appear delay={1}>
          <h1
            className="
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
          uppercase font-bold font-rmNeue
          max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl
          text-left
        "
          >
            <SplitText text="w{an}t t{o} {k}no{w} m{e} {m}o{r}e." />
          </h1>
        </Appear>
      </div>


      {/* BOTTOM RIGHT PARAGRAPH */}
      <div
        className="
      absolute
      bottom-8 sm:bottom-10 md:bottom-12 lg:bottom-14 xl:bottom-16
      right-5 sm:right-8 md:right-12 lg:right-16 xl:right-20
      left-5 sm:left-auto
      flex justify-end
      max-w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[75%] xl:max-w-[65%]
      text-zinc-100
    "
      >
        <ClipText
          as="p"
          offset={["start end", "end end"]}
          className="
        text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl
        uppercase font-bold font-rmNeue text-right
      "
        >
          Behind every line of code I write is a strong focus on clarity,
          performance, and meaningful user experiences. I enjoy building modern,
          scalable, and visually engaging digital products that not only work
          flawlessly but also feel intuitive. My journey reflects continuous
          learning, experimentation, and a deep passion for turning ideas into
          real-world solutions. Feel free to explore my resume to learn more about
          my skills, experience, and the value I bring.
        </ClipText>
      </div>
    </section>
  );
};

export default InfoSection;