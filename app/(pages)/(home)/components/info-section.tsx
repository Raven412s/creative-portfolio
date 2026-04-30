// info-section.tsx
"use client"
import { AsciiMorph } from '@/components/ascii-morph'
import { useCursorElement } from '@/components/cursor/claude-cursor'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useEffect } from 'react'
import { LeetCodeCard } from './leetcode-card'
import ClipText from '@/components/text-animations/scroll-based-reveal'
import SplitText from '@/components/text-animations/split-text'

function ProjectLink({ project }: { project: typeof projects[number] }) {
  const h = useCursorElement({
    state: project.images?.[0] ? "media" : "text",
    mediaSrc: project.images?.[0] ?? undefined,
    mediaShape: "window",
    text: project.images?.[0] ? undefined : "view",
    textColor: "#ffffff",
    backgroundColor: "#efefef60",
  })

  return (
    <Link
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      {...h}
      className="group relative block border-b border-white/5 pb-5 mb-5 last:border-0 last:mb-0 transition-all duration-300 hover:border-white/20"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-mono">
              {project.title}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[9px] text-white/20 font-mono">{project.tech.split('·')[0]}</span>
          </div>
          <h5 className="text-lg font-medium tracking-tight group-hover:pl-1 transition-all duration-200 leading-tight">
            {project.name}
          </h5>
          <p className="text-xs text-white/40 mt-1.5 leading-relaxed max-w-md">{project.desc}</p>
        </div>

        {project.images && project.images.length > 0 && (
          <div className="hidden sm:flex -space-x-2 shrink-0">
            {project.images.slice(0, 3).map((img, j) => (
              <div
                key={j}
                className="w-9 h-9 rounded-lg border border-white/10 overflow-hidden bg-white/5 
                           group-hover:-translate-y-1 group-hover:shadow-lg transition-all duration-300
                           opacity-80 group-hover:opacity-100"
                style={{ transitionDelay: `${j * 40}ms` }}
              >
                <Image
                  width={100}
                  height={100}
                  src={img}
                  alt={`${project.name} screenshot ${j + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {project.images.length > 3 && (
              <div className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 
                            flex items-center justify-center text-[9px] text-white/40 font-mono
                            backdrop-blur-sm">
                +{project.images.length - 3}
              </div>
            )}
          </div>
        )}

        <span className="text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 
                       transition-all duration-200 text-xl shrink-0">
          ↗
        </span>
      </div>
    </Link>
  )
}

const projects = [
  {
    title: "Business Website",
    name: "Staarllet Solutions",
    desc: "Developed a high-performance, SEO-optimized platform for a client with custom CMS integration.",
    tech: "Next.js · MongoDB · Tailwind · Cloudinary",
    link: "https://staarllet.com",
    images: [
      "/assets/images/staarllet/1.png",
      "/assets/images/staarllet/2.png",
      "/assets/images/staarllet/3.png",
      "/assets/images/staarllet/4.png",
      "/assets/images/staarllet/5.png",
      "/assets/images/staarllet/6.png",
    ]
  },
  {
    title: "Restaurant Website",
    name: "Aroma Indian & Arabic Restaurant",
    desc: "A full-stack restaurant platform featuring multilingual support, dynamic menu listings, online table reservations, and a CMS-backed admin panel.",
    tech: "Next.js · Node.js · Cloudinary · MongoDB · Internationalization",
    link: "https://www.aromageorgia.com/en",
    images: [
      "/assets/images/aroma/1.png",
      "/assets/images/aroma/2.png",
      "/assets/images/aroma/3.png",
      "/assets/images/aroma/4.png",
      "/assets/images/aroma/5.png",
      "/assets/images/aroma/6.png",
      "/assets/images/aroma/7.png",
      "/assets/images/aroma/8.png",
      "/assets/images/aroma/9.png",
    ]
  },
  {
    title: "Client Project",
    name: "Gorakhpuriya Bhojpuria",
    desc: "An organization's website that is motivated to bring back the legacy of Bhojpuri Dialect in youths and citizens of India.",
    tech: "Next.js · YouTube API · MongoDB · Cloudinary · TailwindCSS · Razorpay",
    link: "https://gorakhpuriya-bhojpuria.vercel.app/",
    images: [
      "/assets/images/gorakhpuriya-bhojpuria/1.png",
      "/assets/images/gorakhpuriya-bhojpuria/2.png",
      "/assets/images/gorakhpuriya-bhojpuria/3.png",
      "/assets/images/gorakhpuriya-bhojpuria/4.png",
      "/assets/images/gorakhpuriya-bhojpuria/5.png",
      "/assets/images/gorakhpuriya-bhojpuria/6.png",
    ]
  },
  {
    title: "Video Calling App",
    name: "Volt-Meet",
    desc: "Real-time communication platform with video streaming and live chat features.",
    tech: "WebRTC · Socket.io · Node.js · Clerk · Stream.io · Typescript",
    link: "https://volt-meet.vercel.app/"
  },
  {
    title: "Hospital Website",
    name: "Synergy Superspeciality Hospital & Cancer Institute",
    desc: "A full-stack hospital platform featuring multilingual support, doctor profiles, department listings, appointment flow, and a CMS-backed admin panel.",
    tech: "NextJS · Node.js · Cloudinary · MongoDB · Internationalization",
    link: "https://synergy-super-specialty-hospital-an.vercel.app/",
    images: [
      "/assets/images/synergy/1.png",
      "/assets/images/synergy/2.png",
      "/assets/images/synergy/3.png",
      "/assets/images/synergy/4.png",
      "/assets/images/synergy/5.png",
      "/assets/images/synergy/6.png",
      "/assets/images/synergy/7.png",
      "/assets/images/synergy/8.png",
      "/assets/images/synergy/9.png",
    ]
  },
]

export function InfoSection() {
  const skillsRef = useRef<HTMLDivElement>(null)

  const skills = [
    "React", "Next.js", "TypeScript", "Node.js", "Express", "MongoDB", "PostgreSQL",
    "Tailwind", "GSAP", "Framer Motion", "WebRTC", "Socket.io", "Cloudinary", "AWS S3",
    "Stripe", "Razorpay", "Clerk", "JWT", "Zod", "Lenis", "next-intl"
  ]

  const marqueeSkills = [...skills, ...skills]

  return (
    <section className='relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden'>

      {/* ─── MOBILE LAYOUT (hidden on lg+) ─────────────────────────────────── */}
      <div className="lg:hidden px-5 sm:px-8 pt-8 pb-12 space-y-10">

        <Separator className='bg-white/10' />

        {/* Quote */}
        <p className='text-right text-xl text-slate-300/40 italic font-thin'>
          &quot;Purpose-driven builds that combine design clarity with technical excellence.&quot;
        </p>

        {/* Selected Works */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono">
              Selected Works
            </span>
            <h2 className="text-2xl font-light tracking-tight text-white/90">
              Real-world
              <span className="block text-white/40 text-sm font-mono mt-1">end-to-end development</span>
            </h2>
          </div>

          <div className="space-y-1">
            {projects.map((project, i) => (
              <ProjectLink key={i} project={project} />
            ))}
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono text-white/20 flex-wrap">
            <span>✦ continuously shipping</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>✦ production ready</span>
          </div>
        </div>

        <Separator className='bg-white/10' />

        {/* Big tagline */}
        <ClipText
          stroke
          strokeWidth={1}
          direction='right'
          className="text-2xl sm:text-3xl text-right uppercase font-medium font-rmNeue"
        >
          <SplitText text="{D}es{i}gn{e}d, {d}ev{e}lo{pe}d, an{d} {d}ep{loy}ed w{it}h p{ur}po{s}e." />
        </ClipText>

        <Separator className='bg-white/10' />

        {/* ASCII + LeetCode stacked */}
        <div className="flex flex-col gap-8">
          <div className="flex justify-center">
            <div className="transform scale-[1.3] origin-center">
              <AsciiMorph
                files={[
                  '/ascii/apple.txt',
                  '/ascii/flower.txt',
                  '/ascii/pineapple.txt',
                  '/ascii/sunflower.txt',
                  '/ascii/ashutosh.txt'
                ]}
                pause={5000}
              />
            </div>
          </div>

          <div className="w-full">
            <LeetCodeCard />
          </div>
        </div>

        {/* Skills marquee */}
        <div className="space-y-4 overflow-hidden group">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono">
              Toolkit
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          <div className="overflow-hidden cursor-pointer">
            <div className="flex gap-3 whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
              {marqueeSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs text-white/40 font-mono tracking-tight hover:text-white/80 transition-all duration-200"
                >
                  {skill}
                  <span className="mx-2 text-white/10">/</span>
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ─── DESKTOP LAYOUT (hidden below lg) — ORIGINAL, UNTOUCHED ────────── */}
      <div className="hidden lg:block">
        <div className="sticky top-24 px-8 md:px-16 lg:px-24">
          <Separator className='bg-white/10 mb-12' />

          <div className="flex justify-between items-end gap-16 h-[90vh]">

            {/* LEFT — Projects */}
            <div className="space-y-8 w-[calc(33.333%-13.333px)] max-h-[calc(100vh+5px)]">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono">
                  Selected Works
                </span>
                <h2 className="text-3xl font-light tracking-tight text-white/90">
                  Real-world
                  <span className="block text-white/40 text-sm font-mono mt-1">end-to-end development</span>
                </h2>
              </div>

              <div className="mt-8 space-y-1">
                {projects.map((project, i) => (
                  <ProjectLink key={i} project={project} />
                ))}
              </div>

              <div className="pt-8 flex items-center gap-4 text-[10px] font-mono text-white/20">
                <span>✦ continuously shipping</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>✦ production ready</span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col justify-between items-end h-full py-12">
              <p className='max-w-lg text-right text-3xl text-slate-300/40 italic font-thin'>
                &quot;Purpose-driven builds that combine design clarity with technical excellence.&quot;
              </p>
              <ClipText
                stroke
                strokeWidth={1}
                direction='right'
                className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl text-right uppercase font-medium font-rmNeue max-w-6xl ml-0 sm:ml-0 md:-ml-20"
              >
                <SplitText text="{D}es{i}gn{e}d, {d}ev{e}lo{pe}d, an{d} {d}ep{loy}ed w{it}h p{ur}po{s}e." />
              </ClipText>
            </div>
          </div>

          <Separator className='bg-white/10 mb-12 mt-10' />

          <div className="flex flex-col gap-10 mt-10">

            {/* TOP ROW */}
            <div className="flex gap-10 items-start">

              {/* ASCII Morph */}
              <div className="relative group max-h-[40vh] flex flex-2 items-center justify-center w-[120px] shrink-0">
                <div className="relative transform transition-transform scale-[0.7] duration-300 group-hover:scale-[.72] flex items-center justify-center">
                  <AsciiMorph
                    files={[
                      '/ascii/apple.txt',
                      '/ascii/flower.txt',
                      '/ascii/pineapple.txt',
                      '/ascii/sunflower.txt',
                      '/ascii/ashutosh.txt'
                    ]}
                    pause={5000}
                  />
                </div>
              </div>

              {/* LeetCode */}
              <div className="flex-4 ">
                <LeetCodeCard />
              </div>

            </div>

            {/* BOTTOM ROW — Skills */}
            <div className="px-10 max-h-[20vh] space-y-4 pb-8 overflow-hidden flex justify-end flex-col group">

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono">
                  Toolkit
                </span>
                <div className="flex-1 h-px bg-linear-to-r from-white/10 to-transparent" />
              </div>

              <div className="overflow-hidden cursor-pointer">
                <div className="flex gap-3 whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
                  {marqueeSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs text-white/40 font-mono tracking-tight hover:text-white/80 transition-all duration-200"
                    >
                      {skill}
                      <span className="mx-2 text-white/10">/</span>
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

    </section>
  )
}