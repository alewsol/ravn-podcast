"use client"

import { useEffect, useRef, type RefObject } from "react"

export function useScrollActive(
  containerRef: RefObject<HTMLElement | null>,
  activeKey: string | number
) {
  const ready = useRef(false)

  useEffect(() => {
    if (!ready.current) {
      ready.current = true
      return
    }

    const active = containerRef.current?.querySelector<HTMLElement>(
      '[aria-pressed="true"]'
    )
    active?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      inline: "center",
      block: "nearest",
    })
  }, [activeKey, containerRef])
}
