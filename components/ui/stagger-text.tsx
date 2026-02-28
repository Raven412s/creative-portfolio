"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface StaggerTextProps {
  text: string;
  className?: string;
  hoverColor?: string;
}

export default function StaggerText({
  text,
  className = "",
  hoverColor = "#1cf3a1",
}: StaggerTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const letters = Array.from(text);

  // ← Yeh add karo
  useEffect(() => {
    if (!containerRef.current) return;
    const bottomLetters =
      containerRef.current.querySelectorAll<HTMLSpanElement>(".letter-bottom");
    gsap.set(bottomLetters, { yPercent: 100 });
  }, []);

  const handleEnter = () => {
    if (!containerRef.current) return;

    const topLetters =
      containerRef.current.querySelectorAll<HTMLSpanElement>(".letter-top");
    const bottomLetters =
      containerRef.current.querySelectorAll<HTMLSpanElement>(".letter-bottom");


    gsap.killTweensOf([topLetters, bottomLetters]); 
    
    // Top layer flies out upward
    gsap.to(topLetters, {
      yPercent: -100,
      duration: 0.5,
      ease: "power4.inOut",
      stagger: { each: 0.025 },
    });

    // Bottom layer flies in from below
    gsap.to(bottomLetters, {
      yPercent: 0,
      duration: 0.5,
      ease: "power4.inOut",
      stagger: { each: 0.025 },
    });
  };

  const handleLeave = () => {
    if (!containerRef.current) return;

    const topLetters =
      containerRef.current.querySelectorAll<HTMLSpanElement>(".letter-top");
    const bottomLetters =
      containerRef.current.querySelectorAll<HTMLSpanElement>(".letter-bottom");


    gsap.killTweensOf([topLetters, bottomLetters]); 
    
    // Top layer returns to rest
    gsap.to(topLetters, {
      yPercent: 0,
      duration: 0.5,
      ease: "power4.inOut",
      stagger: { each: 0.025 },
    });

    // Bottom layer retreats downward
    gsap.to(bottomLetters, {
      yPercent: 100,
      duration: 0.5,
      ease: "power4.inOut",
      stagger: { each: 0.025 },
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`relative cursor-pointer inline-flex ${className}`}
      style={{ lineHeight: 1 }}
    >
      {/* Yeh wrapper clip karega */}
      <div className="overflow-hidden">
        <div aria-hidden="true" className="flex">
          {letters.map((letter, i) => (
            <span
              key={`top-${i}`}
              className="letter-top inline-block"
              style={{ willChange: "transform" }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom layer — absolute, apna overflow-hidden wrapper hai */}
      <div className="overflow-hidden absolute inset-0">
        <div className="flex h-full" style={{ color: hoverColor }}>
          {letters.map((letter, i) => (
            <span
              key={`bottom-${i}`}
              className="letter-bottom inline-block"
              style={{ willChange: "transform" }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </div>
      </div>

      <span className="sr-only">{text}</span>
    </div>
  );
}