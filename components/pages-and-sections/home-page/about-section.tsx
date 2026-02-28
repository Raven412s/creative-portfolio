"use client";

import React, { useEffect, useRef } from "react";
import ClipText from "@/components/text-animations/scroll-based-reveal";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "@/components/text-animations/split-text";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

CustomEase.create("smooth", "0.76,0,0.24,1");

const AboutSection = () => {

  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const ctx = gsap.context(() => {

      const mm = gsap.matchMedia();

      /* ================= DESKTOP ================= */

      mm.add("(min-width: 768px)", () => {

        gsap.set(imageRef.current, {
          scale: 0.6,
          clipPath: "inset(100% 0% 0% 0%)",
          borderRadius: "3rem",
        });

        gsap.set(aboutRef.current, {
          y: "100vh",
          color: "#030303"
        });

        gsap.set(introRef.current, {
          opacity: 1,
          y: 0
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=200%",
            scrub: 1,
            pin: pinRef.current,
            anticipatePin: 1,
          }
        });

        tl.to(imageRef.current, {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 1,
          ease: "smooth",
        }, 0.2);

        tl.to(introRef.current, {
          opacity: 0,
          y: -80,
          duration: 0.8,
          ease: "smooth",
        }, 0.2);

        tl.to(imageRef.current, {
          width: "50vw",
          height: "100vh",
          x: "0vw",
          y: "0vh",
          borderRadius: "0rem",
          duration: 1.2,
          ease: "smooth",
        }, 1);

        tl.to(aboutRef.current, {
          y: 0,
          duration: 1,
          ease: "smooth",
        }, 1.5);

        tl.to(pinRef.current, {
          backgroundColor: "#27272a",
          duration: 1,
          ease: "smooth",
        }, 2.2);

        tl.to(aboutRef.current, {
          color: "#f4f4f5",
          duration: 1,
          ease: "smooth",
        }, 2.2);

      });


      /* ================= MOBILE ================= */

      mm.add("(max-width: 767px)", () => {

        gsap.set(imageRef.current, {
          scale: 0.8,
          clipPath: "inset(100% 0% 0% 0%)",
          borderRadius: "2rem",
        });

        gsap.set(aboutRef.current, {
          y: "100vh",
          color: "#030303"
        });

        gsap.set(introRef.current, {
          opacity: 1,
          y: 0
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=180%",
            scrub: 1,
            pin: pinRef.current,
            anticipatePin: 1,
          }
        });

        tl.to(imageRef.current, {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 1,
          ease: "smooth",
        }, 0.2);

        tl.to(introRef.current, {
          opacity: 0,
          y: -40,
          duration: 0.8,
          ease: "smooth",
        }, 0.2);

        tl.to(imageRef.current, {
          width: "100vw",
          height: "60vh",
          top: "0%",
        //   left: "0%",
          x: "0%",
          y: "0%",
          borderRadius: "0rem",
          duration: 1.2,
          ease: "smooth",
        }, 1);

        tl.to(aboutRef.current, {
          y: "60vh",
          duration: 1,
          ease: "smooth",
        }, 1.4);

        tl.to(pinRef.current, {
          backgroundColor: "#27272a",
          duration: 1,
          ease: "smooth",
        }, 2);

        tl.to(aboutRef.current, {
          color: "#f4f4f5",
          duration: 1,
          ease: "smooth",
        }, 2);

      });

    }, containerRef);

    return () => ctx.revert();

  }, []);



  return (

    <section
      ref={containerRef}
      className="relative h-[280vh] sm:h-[300vh] md:h-[300vh]"
    >

      <div
        ref={pinRef}
        className="h-screen w-full relative overflow-hidden"
      >

        {/* INTRO */}
        <div
          ref={introRef}
          className="
          absolute inset-0
          flex justify-center
          items-start md:items-center
          pt-24 md:pt-0
          z-10
          "
        >

          <ClipText
            as="h1"
            stroke
            strokeWidth={0.1}
            className="
            font-rmNeue font-light uppercase text-center
            text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] 2xl:text-[8rem]
            leading-none tracking-tight
            "
          >

            <span className="hidden md:block">
              <SplitText text="H{i} I {a}m A{sh}ut{o}sh {S}h{a}ra{n}" />
            </span>

            <span className="block md:hidden">
              <SplitText text="H{i} I {a}m" />
              <br />
              <SplitText text="A{sh}ut{o}sh {S}h{a}ra{n}" />
            </span>

          </ClipText>

        </div>


        {/* IMAGE */}
        <div
          ref={imageRef}
          className="
          absolute
          top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          w-[60vw] h-[75vw]
          sm:w-[45vw] sm:h-[55vw]
          md:w-[30vw] md:h-[38vw]
          lg:w-[26vw] lg:h-[32vw]
          "
        >

          <Image
            src="/assets/images/Ashutosh_Sharan.png"
            alt="Ashutosh"
            fill
            className="object-cover"
            priority
          />

        </div>


        {/* ABOUT TEXT */}
        <div
          ref={aboutRef}
          className="
          absolute inset-0
          flex items-start
          pt-[12vh] sm:pt-[10vh] md:pt-[9vh] lg:pt-[8vh]
          px-5 sm:px-8 md:px-[8%] lg:px-[10%]
          "
        >

          <ClipText
            stroke
            strokeWidth={0.5}
            className="
            text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl
            uppercase font-bold font-rmNeue max-w-6xl
            "
          >

            <SplitText
              text="I a{m} a cr{ea}ti{v}e d{e}vel{op}er f{oc}us{e}d on bu{ild}ing {imm}ers{ive}, per{fo}rm{ant}, and vis{ual}ly str{ik}ing dig{it}al ex{pe}ri{en}ces th{at} bl{end} mo{ti}on, in{ter}ac{tion}, and de{sign} in{to} a se{am}less wh{ole}."
            />

          </ClipText>

        </div>


      </div>

    </section>

  );

};

export default AboutSection;