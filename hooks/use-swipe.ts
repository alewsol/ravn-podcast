"use client"

import { useRef, type TouchEvent } from "react"

export function useSwipe(onPrev: () => void, onNext: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null)

  return {
    onTouchStart: (event: TouchEvent) => {
      const touch = event.changedTouches[0]
      start.current = { x: touch.clientX, y: touch.clientY }
    },
    onTouchEnd: (event: TouchEvent) => {
      if (!start.current) {
        return
      }
      const touch = event.changedTouches[0]
      const dx = touch.clientX - start.current.x
      const dy = touch.clientY - start.current.y
      start.current = null
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) {
        return
      }
      if (dx < 0) {
        onNext()
      } else {
        onPrev()
      }
    },
  }
}
