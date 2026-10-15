"use client"

import { useEffect, useState } from "react"

export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0] ?? "")

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        const id = visible?.target.id
        if (id) {
          setActive(id)
        }
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0, 0.25, 0.5] }
    )

    for (const el of elements) {
      observer.observe(el)
    }

    return () => observer.disconnect()
  }, [ids])

  return active
}
