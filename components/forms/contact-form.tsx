/* eslint-disable @typescript-eslint/no-explicit-any */
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

const labelClass = 'font-mono text-[10px] tracking-[0.14em] uppercase text-[#0a0a0a]/50'
const fieldClass = 'p-5 border border-[#0a0a0a]/25 transition-all duration-200 focus-within:border-[#0a0a0a]/35 focus-within:bg-[#0a0a0a]/[0.04]'
const inputBaseClass = `
bg-transparent 
border-none 
outline-none 
shadow-none 
rounded-none 
p-0 h-auto 
font-mono text-sm text-[#0a0a0a] 
placeholder:text-[#0a0a0a]/35 
focus-visible:ring-0 
focus-visible:ring-offset-0
`

type FocusableFieldProps = {
    children: (ref: React.RefObject<any>) => React.ReactNode
    className?: string
    invalid?: boolean
}

// ── 2. Sub-Component ────────────────────────────────────────────────
function FocusableField({ children, className, invalid }: FocusableFieldProps) {
    const inputRef = React.useRef<any>(null)

    return (
        <Field
            data-invalid={invalid}
            className={className}
            onClick={(e) => {
                const tag = (e.target as HTMLElement).tagName
                if (tag !== "BUTTON") {
                    inputRef.current?.focus()
                }
            }}
        >
            {children(inputRef)}
        </Field>
    )
}

// ── 2. Component ────────────────────────────────────────────────
export function ContactForm() {
    const h_build = useCursorElement({
        state: 'icon',
        icon: <MousePointerClickIcon className="size-7 inline text-[#0a0a0a]" />,
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
            <div className="border border-[#0a0a0a]/25 px-8 py-16 text-center animate-[fadeIn_0.5s_ease]">
                <div className="text-3xl mb-4 tracking-[0.3em] text-[#0a0a0a]/40">✦</div>
                <p className="font-serif text-[clamp(28px,4vw,38px)] italic font-normal text-[#0a0a0a] mb-3">
                    Message sent.
                </p>
                <p className="font-mono text-[13px] text-[#0a0a0a]/45 tracking-wide mb-6">
                    I&apos;ll be in touch shortly — talk soon.
                </p>
                <Button
                    {...h_build}
                    variant="outline"
                    onClick={() => reset()}
                    className="font-mono text-[11px] tracking-[0.14em] uppercase 
border border-[#0a0a0a]/30 text-[#0a0a0a]/60 bg-transparent
hover:text-lime-accent hover:border-[#0a0a0a]/50 hover:bg-[#0a0a0a]/30"
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
                            <FocusableField className={fieldClass} invalid={fieldState.invalid}>
                                {(inputRef) => (
                                    <>
                                        <FieldLabel htmlFor={field.name} className={labelClass}>
                                            Name *
                                        </FieldLabel>

                                        <Input
                                            {...field}
                                            ref={(el) => {
                                                field.ref(el)
                                                inputRef.current = el
                                            }}
                                            id={field.name}
                                            placeholder="Your name"
                                            className={inputBaseClass}
                                        />

                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                                className="font-mono text-[10px] text-red-400 mt-1"
                                            />
                                        )}
                                    </>
                                )}
                            </FocusableField>
                        )}
                    />

                    {/* Email */}
                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FocusableField
                                className={`${fieldClass} lg:border-l-0`}
                                invalid={fieldState.invalid}
                            >
                                {(inputRef) => (
                                    <>
                                        <FieldLabel htmlFor={field.name} className={labelClass}>
                                            Email *
                                        </FieldLabel>

                                        <Input
                                            {...field}
                                            ref={(el) => {
                                                field.ref(el)
                                                inputRef.current = el
                                            }}
                                            id={field.name}
                                            type="email"
                                            placeholder="your@email.com"
                                            className={inputBaseClass}
                                        />

                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                                className="font-mono text-[10px] text-red-400 mt-1"
                                            />
                                        )}
                                    </>
                                )}
                            </FocusableField>
                        )}
                    />
                </div>

                {/* Project */}
                <Controller
                    name="project"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FocusableField
                            className={`${fieldClass} border-t-0`}
                            invalid={fieldState.invalid}
                        >
                            {(inputRef) => (
                                <>
                                    <FieldLabel htmlFor={field.name} className={labelClass}>
                                        What are you working on?
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        ref={(el) => {
                                            field.ref(el)
                                            inputRef.current = el
                                        }}
                                        id={field.name}
                                        placeholder="Site, app, campaign…"
                                        className={inputBaseClass}
                                    />
                                </>
                            )}
                        </FocusableField>
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
                                                : 'border-[#0a0a0a]/25 bg-transparent text-[#0a0a0a]/55 hover:border-[#0a0a0a]/40 hover:text-[#0a0a0a]/80'
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
                        <FocusableField
                            className={`${fieldClass} border-t-0`}
                            invalid={fieldState.invalid}
                        >
                            {(inputRef) => (
                                <>
                                    <FieldLabel htmlFor={field.name} className={labelClass}>
                                        Message *
                                    </FieldLabel>

                                    <Textarea
                                        {...field}
                                        ref={(el) => {
                                            field.ref(el)
                                            inputRef.current = el
                                        }}
                                        id={field.name}
                                        placeholder="Tell me about the project…"
                                        className={`${inputBaseClass} min-h-27.5 resize-none`}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                            className="font-mono text-[10px] text-red-400 mt-1"
                                        />
                                    )}
                                </>
                            )}
                        </FocusableField>
                    )}
                />

            </FieldGroup>

            {/* Footer */}
            <div className="flex items-center justify-between border border-[#0a0a0a]/25 border-t-0 px-5 py-4">
                <span className="font-mono text-[11px] text-[#0a0a0a]/50 tracking-wide">
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