import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export const hairline =
  "ring-1 ring-border/70 shadow-[0_1px_0_color-mix(in_oklch,var(--foreground)_3%,transparent)]"

export function SectionFrame({
  id,
  children,
  className,
}: {
  id?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        "reveal mx-auto w-full max-w-[76rem] scroll-mt-24 px-5 py-14 sm:px-6 lg:py-24",
        className
      )}
    >
      {children}
    </section>
  )
}

export function SectionRule() {
  return (
    <div
      className="mx-auto flex w-full max-w-[76rem] items-center px-6"
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-border" />
      <span className="mx-3 size-1.5 rotate-45 bg-border" />
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "type-meta inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3.5 py-1.5 text-muted-foreground shadow-[0_1px_0_color-mix(in_oklch,var(--foreground)_3%,transparent)]",
        className
      )}
    >
      {children}
    </span>
  )
}

export function SectionIntro({
  badge,
  headline,
  lead,
  align = "center",
}: {
  badge?: ReactNode
  headline: string
  lead: string
  align?: "center" | "left"
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto flex flex-col items-center text-center"
      )}
    >
      {badge ? <div className="mb-5">{badge}</div> : null}
      <h2 className="type-section text-foreground">{headline}</h2>
      <p className="type-body mt-3 max-w-xl text-muted-foreground">{lead}</p>
    </div>
  )
}

export function WindowFrame({
  label,
  children,
  className,
}: {
  label?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.5rem] bg-card ring-1 ring-border/70 shadow-[0_30px_80px_-48px_color-mix(in_oklch,var(--foreground)_40%,transparent)]",
        className
      )}
    >
      <div className="relative flex items-center gap-2 border-b border-border/70 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="size-2 rounded-full bg-foreground/15" />
        </span>
        {label ? (
          <span className="type-meta pointer-events-none absolute inset-x-16 truncate text-center text-muted-foreground">
            {label}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  )
}
