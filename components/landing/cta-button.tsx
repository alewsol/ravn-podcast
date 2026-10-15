import type { ReactNode } from "react"
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CtaButton({
  href,
  children,
  hint,
  variant = "default",
  className,
}: {
  href: string
  children: ReactNode
  hint?: string
  variant?: "default" | "outline"
  className?: string
}) {
  return (
    <Button
      asChild
      variant={variant}
      size="lg"
      className={cn(
        "type-title h-12 min-w-0 gap-3 px-5 font-medium",
        className
      )}
    >
      <a href={href}>
        <span>{children}</span>
        <span
          className={cn(
            "inline-flex items-center gap-1",
            variant === "default"
              ? "text-primary-foreground/45"
              : "text-muted-foreground"
          )}
        >
          {hint ? <span>{hint}</span> : null}
          <ArrowRightIcon weight="bold" className="size-3.5" aria-hidden="true" />
        </span>
      </a>
    </Button>
  )
}
