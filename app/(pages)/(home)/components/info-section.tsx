// info-section.tsx
"use client"
import { AsciiMorph } from '@/components/ascii-morph'
import { useCursorElement } from '@/components/cursor/claude-cursor'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useEffect } from 'react'

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
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
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
          <div className="flex -space-x-2 shrink-0">
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

  // Auto-scroll skills marquee on hover
  useEffect(() => {
    const el = skillsRef.current
    if (!el) return
    
    let scrollAmount = 0
    let animationId: number
    
    const scroll = () => {
      if (!el) return
      scrollAmount += 0.5
      if (scrollAmount >= el.scrollWidth - el.clientWidth) {
        scrollAmount = 0
      }
      el.scrollTo({ left: scrollAmount, behavior: 'smooth' })
      animationId = requestAnimationFrame(scroll)
    }
    
    const handleMouseEnter = () => {
      animationId = requestAnimationFrame(scroll)
    }
    
    const handleMouseLeave = () => {
      cancelAnimationFrame(animationId)
    }
    
    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter)
      el.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [])

  const skills = [
    "React", "Next.js", "TypeScript", "Node.js", "Express", "MongoDB", "PostgreSQL",
    "Tailwind", "GSAP", "Framer Motion", "WebRTC", "Socket.io", "Cloudinary", "AWS S3",
    "Stripe", "Razorpay", "Clerk", "JWT", "Zod", "Lenis", "next-intl"
  ]

  return (
    <section className='relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden'>
      {/* Ambient background linear */}
      {/* <div className="absolute inset-0 bg-linear-to-br from-white/2 via-transparent to-black/20 pointer-events-none" /> */}
      
      <div className="sticky top-24 px-8 md:px-16 lg:px-24">
        <Separator className='bg-white/10 mb-12' />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* LEFT COLUMN - ASCII + Skills */}
          <div className="space-y-12">
            {/* ASCII Art Container with hover tilt */}
            <div className="relative group">
              {/* <div className="absolute -inset-4 bg-linear-to-r from-white/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}
              <div className="relative transform transition-transform duration-300 group-hover:scale-[1.02] flex items-center justify-center">
                <AsciiMorph
                  files={['/ascii/apple.txt', '/ascii/pineapple.txt', '/ascii/sunflower.txt','/ascii/ashutosh.txt', ]}
                  pause={5000}
                />
              </div>
            </div>

            {/* Minimal Skills Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono">
                  Toolkit
                </span>
                <div className="flex-1 h-px bg-linear-to-r from-white/10 to-transparent" />
              </div>
              
              <div 
                ref={skillsRef}
                className="overflow-x-auto scrollbar-hide cursor-pointer"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex gap-3 whitespace-nowrap pb-2">
                  {skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="text-xs text-white/40 font-mono tracking-tight hover:text-white/80 
                                 transition-all duration-200 hover:tracking-normal"
                    >
                      {skill}
                      {idx < skills.length - 1 && (
                        <span className="mx-2 text-white/10">/</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-white/20 font-mono tracking-wide">
                Hover to scroll through stack
              </p>
            </div>

            {/* Subtle accent element */}
            <div className="hidden lg:block pt-8">
              <div className="w-12 h-px bg-linear-to-r from-white/20 to-transparent" />
            </div>
          </div>

          {/* RIGHT COLUMN - Projects */}
          <div className="space-y-8">
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

            {/* Footer tinge */}
            <div className="pt-8 flex items-center gap-4 text-[10px] font-mono text-white/20">
              <span>✦ continuously shipping</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>✦ production ready</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}