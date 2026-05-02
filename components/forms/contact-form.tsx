'use client'

import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { MousePointerClickIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'
import { useCursorElement } from '../cursor/claude-cursor'

// ── 1. Zod schema ──────────────────────────────────────────────
const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.string().email('Please enter a valid email address.'),
    project: z.string().optional(),
    budget: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters.'),
})

type FormValues = z.infer<typeof formSchema>

const BUDGET_OPTIONS = [
  'under ₹10k',
  '₹10k–₹25k',
  '₹25k–₹60k',
  '₹60k+',
  "let's talk"
]

const labelClass = 'font-mono text-[10px] tracking-[0.14em] uppercase text-white/40'
const fieldClass = 'p-5 border border-white/10 transition-all duration-200 focus-within:border-white/35 focus-within:bg-white/[0.04]'

// ── 2. Component ────────────────────────────────────────────────
export function ContactForm() {
    const h_build = useCursorElement({
        state: 'icon',
        icon: <MousePointerClickIcon className="size-7 inline text-white" />,
    })

    // ── 3. useForm with zodResolver ──────────────────────────────
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: 'onBlur', // validate on blur, show errors as user leaves each field
        defaultValues: {
            name: '',
            email: '',
            project: '',
            budget: '',
            message: '',
        },
    })

    const { handleSubmit, control, formState: { isSubmitSuccessful }, reset } = form

    // ── 4. onSubmit ──────────────────────────────────────────────
    function onSubmit(data: FormValues) {
        console.log('Form submitted:', data)
        // wire up your API call here e.g. fetch('/api/contact', ...)
    }

    // ── 5. Success state ─────────────────────────────────────────
    if (isSubmitSuccessful) {
        return (
            <div className="border border-white/10 px-8 py-16 text-center animate-[fadeIn_0.5s_ease]">
                <div className="text-3xl mb-4 tracking-[0.3em] text-white/40">✦</div>
                <p className="font-serif text-[clamp(28px,4vw,38px)] italic font-normal text-white mb-3">
                    Message sent.
                </p>
                <p className="font-mono text-[13px] text-white/45 tracking-wide mb-6">
                    I&apos;ll be in touch shortly — talk soon.
                </p>
                <Button
                    {...h_build}
                    variant="outline"
                    onClick={() => reset()}
                    className="font-mono text-[11px] tracking-[0.14em] uppercase 
border border-white/30 text-white/60 bg-transparent
hover:text-lime-accent hover:border-white/50 hover:bg-white/30"
                >
                    Send another
                </Button>
            </div>
        )
    }

    // ── 6. Form ──────────────────────────────────────────────────
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup className="gap-0">

                {/* Name + Email — side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Name */}
                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className={fieldClass}
                            >
                                <FieldLabel
                                    htmlFor={field.name}
                                    className={labelClass}
                                >
                                    Name *
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Your name"
                                    aria-invalid={fieldState.invalid}
                                    className="bg-transparent border-none outline-none p-0 h-auto font-mono text-sm text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                        className="font-mono text-[10px] text-red-400 mt-1"
                                    />
                                )}
                            </Field>
                        )}
                    />

                    {/* Email */}
                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className={`${fieldClass} lg:border-l-0`}
                            >
                                <FieldLabel
                                    htmlFor={field.name}
                                    className={labelClass}
                                >
                                    Email *
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="email"
                                    placeholder="your@email.com"
                                    aria-invalid={fieldState.invalid}
                                    className="bg-transparent border-none outline-none p-0 h-auto font-mono text-sm text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                        className="font-mono text-[10px] text-red-400 mt-1"
                                    />
                                )}
                            </Field>
                        )}
                    />
                </div>

                {/* Project */}
                <Controller
                    name="project"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field
                            data-invalid={fieldState.invalid}
                            className={`${fieldClass} border-t-0`}
                        >
                            <FieldLabel htmlFor={field.name} className={labelClass}>
                                What are you working on?
                            </FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Site, app, campaign, experiment…"
                                aria-invalid={fieldState.invalid}
                                className="bg-transparent border-none outline-none p-0 h-auto font-mono text-sm text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </Field>
                    )}
                />

                {/* Budget — chip toggle, stored as a string in RHF */}
                <Controller
                    name="budget"
                    control={control}
                    render={({ field }) => (
                        <Field className={`${fieldClass} border-t-0`}>
                            <FieldLabel className={labelClass}>
                                Budget range
                            </FieldLabel>
                            <FieldDescription className="sr-only">
                                Select your approximate budget
                            </FieldDescription>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {BUDGET_OPTIONS.map(opt => (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() =>
                                            field.onChange(opt === field.value ? '' : opt)
                                        }
                                        className={`font-mono text-[11px] tracking-wide px-3 py-1 rounded-sm border transition-all duration-150 cursor-pointer
                                            ${field.value === opt
                                                ? 'border-lime-accent bg-lime-accent text-[#0a0a0a] font-medium'
                                                : 'border-white/20 bg-transparent text-white/55 hover:border-white/40 hover:text-white/80'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </Field>
                    )}
                />

                {/* Message */}
                <Controller
                    name="message"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field
                            data-invalid={fieldState.invalid}
                            className={`${fieldClass} border-t-0`}
                        >
                            <FieldLabel htmlFor={field.name} className={labelClass}>
                                Message *
                            </FieldLabel>
                            <Textarea
                                {...field}
                                id={field.name}
                                placeholder="Tell me about the project, timeline, or anything else…"
                                aria-invalid={fieldState.invalid}
                                className="bg-transparent border-none outline-none p-0 min-h-27.5 resize-none font-mono text-sm text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            {fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                    className="font-mono text-[10px] text-red-400 mt-1"
                                />
                            )}
                        </Field>
                    )}
                />

            </FieldGroup>

            {/* Footer */}
            <div className="flex items-center justify-between border border-white/10 border-t-0 px-5 py-4">
                <span className="font-mono text-[11px] text-white/30 tracking-wide">
                    typically reply within 24h
                </span>
          <Button
  {...h_build}
  type="submit"
  className="font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-2.5 border rounded-sm transition-all duration-150 cursor-pointer h-auto
             border-lime-accent text-lime-accent bg-transparent
             hover:bg-lime-accent hover:text-[#0a0a0a]"
>
  Send it →
</Button>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </form>
    )
}