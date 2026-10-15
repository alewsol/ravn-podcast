"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ListIcon } from "@phosphor-icons/react/dist/ssr/List"
import { XIcon } from "@phosphor-icons/react/dist/ssr/X"

import { useActiveSection } from "@/hooks/use-active-section"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "#platform", id: "platform", label: "Platform" },
  { href: "#pipeline", id: "pipeline", label: "Pipeline" },
  { href: "#workers", id: "workers", label: "Workers" },
  { href: "#ai-companies", id: "ai-companies", label: "For AI companies" },
] as const

const sectionIds = [
  "platform",
  "pipeline",
  "workers",
  "ai-companies",
  "talk",
] as const

function IslandScoop({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-0 size-6",
        side === "left"
          ? "right-full bg-[radial-gradient(circle_at_0_100%,transparent_24px,var(--primary)_24.5px)]"
          : "left-full bg-[radial-gradient(circle_at_100%_100%,transparent_24px,var(--primary)_24.5px)]"
      )}
    />
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const active = useActiveSection(sectionIds)

  useEffect(() => {
    if (!open) {
      return
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }
    const onPointer = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Node && !headerRef.current?.contains(target)) {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", onPointer)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointerdown", onPointer)
    }
  }, [open])

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-1/2 z-50 w-[min(52rem,calc(100%-4rem))] -translate-x-1/2"
    >
      <div className="relative">
        <div className="relative rounded-b-[1.5rem] bg-primary pt-[env(safe-area-inset-top)] text-primary-foreground">
          <IslandScoop side="left" />
          <IslandScoop side="right" />
          <div className="relative flex h-11 items-center gap-1 px-1.5 sm:h-12 sm:px-2">
          <Link
            href="/"
            className="relative z-10 flex shrink-0 items-center gap-1.5 rounded-full py-0.5 pr-2 pl-0.5 transition-opacity duration-300 hover:opacity-80"
            aria-label="RAVN home"
          >
            <Image
              src="/logo.svg"
              alt=""
              width={24}
              height={24}
              className="size-6 brightness-0 invert"
              preload
            />
            <span className="type-title tracking-tight text-primary-foreground">
              RAVN
            </span>
          </Link>
          <nav
            aria-label="Primary"
            className="relative z-10 hidden min-w-0 flex-1 items-center justify-center lg:flex"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "type-meta shrink-0 rounded-full px-2 py-1 transition-colors duration-300",
                  active === item.id
                    ? "text-primary-foreground"
                    : "text-primary-foreground/55 hover:text-primary-foreground"
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="relative z-10 ml-auto flex shrink-0 items-center gap-0.5 lg:ml-0">
            <a
              href="https://cal.com/ravnlabs/15min"
              className="type-meta inline-flex h-8 shrink-0 items-center rounded-full bg-primary-foreground px-2.5 font-medium text-primary transition-transform duration-300 hover:scale-[1.02] sm:px-3"
            >
              Talk to us
            </a>
            <button
              type="button"
              className="grid size-8 place-items-center rounded-full text-primary-foreground transition-colors hover:bg-primary-foreground/10 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? (
                <XIcon className="size-5" weight="bold" />
              ) : (
                <ListIcon className="size-5" weight="bold" />
              )}
            </button>
          </div>
          </div>
        </div>
        {open ? (
          <div
            id="mobile-nav"
            className="absolute top-full right-0 left-0 mt-2 rounded-2xl bg-primary p-2 text-primary-foreground lg:hidden"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "type-title flex rounded-xl px-3 py-3 transition-colors",
                  active === item.id
                    ? "bg-primary-foreground/10 text-primary-foreground"
                    : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                )}
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://cal.com/ravnlabs/15min"
              onClick={() => setOpen(false)}
              className="type-title mt-1 flex rounded-xl bg-primary-foreground px-3 py-3 text-primary"
            >
              Talk to us
            </a>
          </div>
        ) : null}
      </div>
    </header>
  )
}
