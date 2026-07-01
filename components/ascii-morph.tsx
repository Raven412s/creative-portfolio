"use client"

import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

const GLITCH = '!<>-_\\/[]{}=+*^?#@$~|'
const MORPH_DURATION = 500
const MIN_SCALE = 0.42

async function loadAsciiFile(src: string): Promise<string[]> {
    const res = await fetch(src)
    const text = await res.text()
    return text.replace(/\r/g, '').replace(/\n$/, '').split('\n')
}

interface AsciiMorphProps {
    files: string[]
    pause?: number
    className?: string
    fontColor?: string
    morph?: boolean
}

export function AsciiMorph({
    files,
    pause = 5000,
    className = '',
    fontColor = "text-white/50",
    morph = true,
}: AsciiMorphProps) {
    const [lines, setLines] = useState<string[]>([])
    const [scale, setScale] = useState(1)
    const [rotateX, setRotateX] = useState(0)
    const [rotateY, setRotateY] = useState(0)

    const containerRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)
    const artRef = useRef<HTMLPreElement>(null)
    const framesRef = useRef<string[][]>([])
    const currentRef = useRef(0)
    const rafRef = useRef<number | null>(null)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const fileKey = files.join('|')

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect()
            const x = (e.clientX - rect.left) / rect.width - 0.5
            const y = (e.clientY - rect.top) / rect.height - 0.5
            setRotateY(x * 2)
            setRotateX(y * -2)
        }

        const handleMouseLeave = () => {
            setRotateX(0)
            setRotateY(0)
        }

        container.addEventListener('mousemove', handleMouseMove)
        container.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            container.removeEventListener('mousemove', handleMouseMove)
            container.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    useEffect(() => {
        let cancelled = false
        const sources = fileKey.split('|').filter(Boolean)

        if (timerRef.current) clearTimeout(timerRef.current)
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        timerRef.current = null
        rafRef.current = null
        currentRef.current = 0

        Promise.all(sources.map(loadAsciiFile)).then((frames) => {
            if (cancelled || frames.length === 0) return

            const maxRows = Math.max(...frames.map(f => f.length))
            const maxCols = Math.max(...frames.flatMap(f => f.map(l => l.length)))

            const normalized = frames.map(f => {
                const padded = f.map(line => line.padEnd(maxCols, ' '))
                while (padded.length < maxRows) padded.push(' '.repeat(maxCols))
                return padded
            })

            framesRef.current = normalized
            setLines(normalized[0])

            if (!morph || normalized.length < 2) return

            const morphTo = (fromLines: string[], toIdx: number, onDone: () => void) => {
                const toLines = framesRef.current[toIdx]
                const fromFlat = fromLines.join('\n')
                const toFlat = toLines.join('\n')
                const len = toFlat.length
                let start: number | null = null

                const tick = (ts: number) => {
                    if (cancelled) return
                    if (!start) start = ts

                    const t = Math.min((ts - start) / MORPH_DURATION, 1)
                    const result = toFlat.split('').map((tChar, i) => {
                        if (tChar === '\n') return '\n'

                        const fChar = fromFlat[i] ?? ' '
                        const charT = Math.max(0, Math.min(1, t * 1.8 - (i / len) * 0.8))

                        if (charT <= 0) return fChar
                        if (charT >= 1) return tChar
                        if (Math.random() < 0.5) return GLITCH[Math.floor(Math.random() * GLITCH.length)]
                        return fChar
                    }).join('')

                    setLines(result.split('\n'))

                    if (t < 1) {
                        rafRef.current = requestAnimationFrame(tick)
                    } else {
                        setLines(toLines)
                        onDone()
                    }
                }

                rafRef.current = requestAnimationFrame(tick)
            }

            const cycle = () => {
                const fromLines = framesRef.current[currentRef.current]
                currentRef.current = (currentRef.current + 1) % framesRef.current.length
                morphTo(fromLines, currentRef.current, () => {
                    timerRef.current = setTimeout(cycle, pause)
                })
            }

            timerRef.current = setTimeout(cycle, pause)
        })

        return () => {
            cancelled = true
            if (timerRef.current) clearTimeout(timerRef.current)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [fileKey, pause, morph])

    useEffect(() => {
        const stage = stageRef.current
        const art = artRef.current
        if (!stage || !art || lines.length === 0) return

        const updateScale = () => {
            const availableWidth = stage.clientWidth
            const availableHeight = stage.clientHeight > 0 ? stage.clientHeight : Number.POSITIVE_INFINITY
            const artWidth = art.scrollWidth
            const artHeight = art.scrollHeight

            if (!availableWidth || !artWidth || !artHeight) return

            const nextScale = Math.max(
                MIN_SCALE,
                Math.min(1, availableWidth / artWidth, availableHeight / artHeight)
            )

            setScale(prev => Math.abs(prev - nextScale) > 0.01 ? nextScale : prev)
        }

        updateScale()

        const resizeObserver = new ResizeObserver(updateScale)
        resizeObserver.observe(stage)
        resizeObserver.observe(art)
        window.addEventListener('resize', updateScale)

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener('resize', updateScale)
        }
    }, [lines])

    return (
        <div
            ref={containerRef}
            className={cn(
                "w-full max-w-full min-w-0 flex items-center justify-center overflow-hidden perspective-[1000px] text-center",
                className
            )}
            style={{ transformStyle: 'preserve-3d' }}
        >
            <div
                ref={stageRef}
                className="w-full max-w-full min-w-0 flex items-center justify-center overflow-hidden p-2 sm:p-3 lg:p-2"
            >
                <div
                    style={{
                        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
                        transformOrigin: 'center',
                        transition: 'transform 0.1s ease-out',
                    }}
                >
                    <pre
                        ref={artRef}
                        className={cn("select-none mx-auto", fontColor)}
                        style={{
                            fontFamily: 'var(--font-rm-mono), "Courier New", Courier, monospace',
                            fontSize: 'clamp(3px, 0.65vw, 10px)',
                            letterSpacing: '0',
                            lineHeight: '1.08',
                            whiteSpace: 'pre',
                            display: 'inline-block',
                            textAlign: 'left',
                        }}
                    >
                        {lines.join('\n')}
                    </pre>
                </div>
            </div>
        </div>
    )
}
