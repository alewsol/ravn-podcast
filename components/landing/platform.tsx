"use client"

import type { CSSProperties } from "react"
import { useEffect, useRef } from "react"

import { CornerArt, manifestoCorners } from "@/components/landing/corner-art"
import { GridIntersections, gridRuleClassName } from "@/components/landing/grid-rails"

const statement =
  "A platform, not a product. RAVN is the infrastructure layer for building, training, deploying, and evaluating specialized robot workers — one for maintenance, another for inspection, another for field service, each trained differently, all running on RAVN. Give us the job. We turn it into a worker that can do it."

const words = statement.split(" ")

export function Platform() {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1")
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const travel = rect.height * 0.8
      const progress = (window.innerHeight * 0.8 - rect.top) / travel
      el.style.setProperty("--p", String(Math.min(1, Math.max(0, progress))))
    }
    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <section
      id="platform"
      className={`relative reveal scroll-mt-24 border-b-0 sm:border-b ${gridRuleClassName}`}
    >
      <GridIntersections />
      <CornerArt corners={manifestoCorners} />
      <div className="relative z-10 mx-auto w-full max-w-[76rem] px-5 py-24 sm:px-6 lg:py-[9rem]">
        <div className="mx-auto max-w-4xl">
          <h2 className="sr-only">A platform, not a product.</h2>
          <p
            ref={ref}
            className="statement-reveal type-statement"
            style={{ "--n": words.length } as CSSProperties}
          >
            {words.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="statement-word"
                style={{ "--i": index } as CSSProperties}
              >
                {word}{" "}
              </span>
            ))}
          </p>
          <a
            href="https://cal.com/ravnlabs/15min"
            className="type-meta mt-12 inline-flex h-10 items-center rounded-full bg-primary px-4 font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.02]"
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  )
}
