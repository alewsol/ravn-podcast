"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export function FloatingCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => {
      const talk = document.getElementById("talk")
      const talkTop =
        talk?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY
      setVisible(window.scrollY > 480 && talkTop > window.innerHeight - 80)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-5 z-[1200] flex justify-center px-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:bottom-6",
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      )}
    >
      <a
        href="https://cal.com/ravnlabs/15min"
        className={cn(
          "type-title inline-flex h-12 items-center rounded-full bg-primary px-5 font-medium text-primary-foreground shadow-[0_16px_40px_-16px_color-mix(in_oklch,var(--foreground)_55%,transparent)] transition-transform duration-300 hover:scale-[1.02]",
          visible ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        Talk to us
      </a>
    </div>
  )
}
