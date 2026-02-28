"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface AppearProps {
  children: ReactNode;
  delay?: number;
}

export default function Appear({ children, delay = 0 }: AppearProps) {
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitText(textRef.current, {
      type: "lines",
      mask: "lines",
    });

    gsap.set(split.lines, {
      yPercent: 110,
    });

    const animation = gsap.to(split.lines, {
      yPercent: 0,
      duration: 0.9,
      stagger: 0.06,
      ease: "power4.out",
      delay,
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 85%",   // animation start when element reaches 85% of viewport
        end: "bottom 60%",
        toggleActions: "play none none none",
        once: true,         // animate only once
      },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
      split.revert();
    };
  }, [children, delay]);

  return <div ref={textRef}>{children}</div>;
}