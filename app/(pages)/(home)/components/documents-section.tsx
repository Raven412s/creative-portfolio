"use client"

import { FloatingCardGrid, FloatingCardItem } from "@/components/self-made/particle-system/floating-card-grid"
import { cn } from "@/lib/utils"
import { BookOpen, Briefcase, Code, FileText, Github, Linkedin } from "lucide-react"


function DocumentCard({
    icon,
    title,
    description,
    href,
    color,
    iconColor,
}: {
    icon: React.ReactNode
    title: string
    description: string
    href: string
    color: string
    iconColor: string
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "relative w-full h-full border-2 rounded-2xl p-3 md:p-6 flex flex-col items-center justify-center",
                "shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden",
                color
            )}
        >
            {/* Corner decorations */}
            <div className="absolute top-2 right-2 md:top-3 md:right-3 w-2 h-2 md:w-3 md:h-3 border-t-2 border-r-2 border-current opacity-30 rounded-tr-sm pointer-events-none" />
            <div className="absolute top-2 left-2 md:top-3 md:left-3 w-2 h-2 md:w-3 md:h-3 border-t-2 border-l-2 border-current opacity-30 rounded-tl-sm pointer-events-none" />
            <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-2 h-2 md:w-3 md:h-3 border-b-2 border-r-2 border-current opacity-30 rounded-br-sm pointer-events-none" />
            <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 w-2 h-2 md:w-3 md:h-3 border-b-2 border-l-2 border-current opacity-30 rounded-bl-sm pointer-events-none" />
            <div className="absolute top-4 right-4 md:top-6 md:right-6 w-1 h-1 md:w-1.5 md:h-1.5 bg-current rounded-full opacity-20 pointer-events-none" />
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 w-1 h-1 md:w-1.5 md:h-1.5 bg-current rounded-full opacity-20 pointer-events-none" />

            <div className="relative z-10 text-center">
                <div className={cn(
                    "mb-2 md:mb-4 transition-transform duration-300 group-hover:scale-110",
                    "[&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-8 md:[&>svg]:h-8",
                    iconColor
                )}>
                    {icon}
                </div>

                <h3 className="text-sm md:text-2xl font-bold text-gray-800 mb-1 md:mb-2 leading-tight">
                    {title}
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                    {description}
                </p>

                <div className="inline-flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    <span>Explore</span>
                    <svg
                        className="w-3 h-3 md:w-4 md:h-4 transform transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </a>
    )
}

const CARDS: FloatingCardItem[] = [
    {
        id: "resume",
        rotation: "-rotate-3",
        position: "top-8 left-[10%]",
        size: "w-64 h-72",
        glowColor: "rgba(255, 100, 100, 0.6)",
        glowColorEdge: "255, 100, 100",
        content: (
            <DocumentCard
                icon={<FileText />}
                title="Resume"
                description="My professional journey"
                href="#"
                color="bg-rose-50 border-rose-200 hover:bg-rose-100"
                iconColor="text-rose-500"
            />
        ),
    },
    {
        id: "linkedin",
        rotation: "rotate-2",
        position: "top-16 right-[15%]",
        size: "w-72 h-64",
        glowColor: "rgba(59, 130, 246, 0.6)",
        glowColorEdge: "59, 130, 246",
        content: (
            <DocumentCard
                icon={<Linkedin />}
                title="LinkedIn"
                description="Let's connect professionally"
                href="https://www.linkedin.com/in/ashutosh-sharan-1a9523319/"
                color="bg-blue-50 border-blue-200 hover:bg-blue-100"
                iconColor="text-blue-600"
            />
        ),
    },
    {
        id: "github",
        rotation: "-rotate-1",
        position: "bottom-20 left-[20%]",
        size: "w-56 h-68",
        glowColor: "rgba(180, 180, 180, 0.6)",
        glowColorEdge: "200, 200, 200",
        content: (
            <DocumentCard
                icon={<Github />}
                title="GitHub"
                description="Where I push code"
                href="https://github.com/Raven412s?tab=overview&from=2026-05-01&to=2026-05-01"
                color="bg-gray-50 border-gray-300 hover:bg-gray-100"
                iconColor="text-gray-800"
            />
        ),
    },
    {
        id: "blog",
        rotation: "rotate-6",
        position: "top-24 right-[35%]",
        size: "w-60 h-64",
        glowColor: "rgba(245, 158, 11, 0.6)",
        glowColorEdge: "245, 158, 11",
        content: (
            <DocumentCard
                icon={<BookOpen />}
                title="Blog"
                description="My thoughts & tutorials"
                href="/blogs"
                color="bg-amber-50 border-amber-200 hover:bg-amber-100"
                iconColor="text-amber-600"
            />
        ),
    },
    {
        id: "projects",
        rotation: "-rotate-2",
        position: "bottom-32 right-[25%]",
        size: "w-68 h-60",
        glowColor: "rgba(147, 51, 234, 0.6)",
        glowColorEdge: "147, 51, 234",
        content: (
            <DocumentCard
                icon={<Code />}
                title="Projects"
                description="What I've built"
                href="/projects"
                color="bg-purple-50 border-purple-200 hover:bg-purple-100"
                iconColor="text-purple-600"
            />
        ),
    },
    {
        id: "portfolio",
        rotation: "rotate-3",
        position: "top-40 left-[30%]",
        size: "w-64 h-64",
        glowColor: "rgba(16, 185, 129, 0.6)",
        glowColorEdge: "16, 185, 129",
        content: (
            <DocumentCard
                icon={<Briefcase />}
                title="Portfolio"
                description="Complete work showcase"
                href="/"
                color="bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                iconColor="text-emerald-600"
            />
        ),
    },
]

export function DocumentsSection() {
    return (
        <FloatingCardGrid
            items={CARDS}
            breakpoint="lg"
            desktopContainerClassName="max-w-7xl h-150"
            mobileGridClassName="grid-cols-2 gap-4"
            mobileCardHeight="h-40"
            enableParticles
        >
            {/* Heading */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-3 relative">
                    <span className="bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                        Where I Build & Share
                    </span>
                    <span className="absolute inset-0 blur-2xl opacity-30 bg-white/20 rounded-full" />
                </h2>
                <p className="text-sm md:text-base text-white/60 tracking-[0.3em] uppercase">
                    Code. Content. Connections.
                </p>
            </div>
        </FloatingCardGrid>
    )
}