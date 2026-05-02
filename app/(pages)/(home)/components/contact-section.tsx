import React from 'react'
import { ContactForm } from '@/components/forms/contact-form'

export function ContactSection() {
    return (
        <section className="min-h-screen bg-[#0a0a0a] flex items-center px-[clamp(1.5rem,6vw,6rem)] py-[clamp(4rem,8vw,8rem)]">
            <div className="w-full max-w-275 mx-auto">
                <div className="grid grid-cols-[1fr_1.4fr] gap-[clamp(3rem,6vw,7rem)] items-start">

                    {/* Left — typography column */}
                    <div className="pt-2">
                        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30 mb-6">
                            — Contact
                        </p>

                        <h2 className="font-serif text-[clamp(42px,5.5vw,72px)] font-normal italic leading-[1.05] text-white mb-7">
                            Let&apos;s make something{' '}
                            <span className="text-white/25">interesting</span>
                        </h2>

                        <p className="font-mono text-[13px] leading-[1.8] text-white/45 mb-12 max-w-[320px]">
                            Whether it&apos;s a product launch, an interactive experience, or
                            something that doesn&apos;t have a name yet — I&apos;m interested.
                        </p>

                        {/* Contact details */}
                        <div className="flex flex-col gap-5">
                            {[
                                { label: 'Email', value: 'being.ashutosh16.20@gmail.com' },
                                { label: 'Based in', value: 'UTC+5:30 · India' },
                                { label: 'Availability', value: 'Open to projects', highlight: true },
                            ].map(({ label, value, highlight }) => (
                                <div key={label}>
                                    <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-white/25 mb-1">
                                        {label}
                                    </p>
                                    <p className={`font-mono text-[13px] tracking-wide ${
                                        highlight ? 'text-[#1cf3a1] font-medium' : 'text-white/65'
                                    }`}>
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Decorative rule */}
                        <div className="mt-14 w-12 h-px bg-white/15" />
                    </div>

                    {/* Right — form column */}
                    <div>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </section>
    )
}