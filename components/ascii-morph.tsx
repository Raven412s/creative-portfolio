// ascii-morph.tsx (enhanced with tilt effect)
"use client"
import { useEffect, useRef, useState } from 'react'

const GLITCH = '!<>-_\\/[]{}=+*^?#@$░▒▓~|'
const MORPH_DURATION = 500

async function loadAsciiFile(src: string): Promise<string[]> {
    const res = await fetch(src)
    const text = await res.text()
    return text.split('\n')
}

interface AsciiMorphProps {
    files: string[]
    pause?: number
}

export function AsciiMorph({ files, pause = 5000 }: AsciiMorphProps) {
    const [lines, setLines] = useState<string[]>([])
    const [rotateX, setRotateX] = useState(0)
    const [rotateY, setRotateY] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const framesRef = useRef<string[][]>([])
    const currentRef = useRef(0)
    const rafRef = useRef<number>(undefined)
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

    // Mouse tilt effect
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
        Promise.all(files.map(loadAsciiFile)).then((frames) => {
            const maxRows = Math.max(...frames.map(f => f.length))
            const maxCols = Math.max(...frames.flatMap(f => f.map(l => l.length)))

            const normalized = frames.map(f => {
                const padded = f.map(line => line.padEnd(maxCols, ' '))
                while (padded.length < maxRows) padded.push(' '.repeat(maxCols))
                return padded
            })

            framesRef.current = normalized
            setLines(normalized[0])
            
            const morphTo = (fromLines: string[], toIdx: number, onDone: () => void) => {
                const toLines = framesRef.current[toIdx]
                const fromFlat = fromLines.join('\n')
                const toFlat = toLines.join('\n')
                const len = toFlat.length
                let start: number | null = null

                const tick = (ts: number) => {
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
            clearTimeout(timerRef.current)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [files, pause])

    return (
        <div 
            ref={containerRef}
            className="w-full flex items-center justify-center overflow-hidden perspective-[1000px]"
            style={{ transformStyle: 'preserve-3d' }}
        >
            <div
                style={{
                    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                    transition: 'transform 0.1s ease-out'
                }}
            >
                <pre
                    className="font-mono text-white/40 select-none"
                    style={{
                        fontSize: 'clamp(4px, 0.7vw, 10px)',
                        letterSpacing: '0.03em',
                        lineHeight: '1.2',
                        overflow: 'hidden',
                        whiteSpace: 'pre',
                        maxWidth: '100%',
                    }}
                >
                    {lines.join('\n')}
                </pre>
            </div>
        </div>
    )
}