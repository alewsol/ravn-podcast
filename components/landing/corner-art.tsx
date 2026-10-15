/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils"

export const CORNER_WIDTH = "clamp(6rem, 12vw, 13rem)"
export const ROBOT_HEAD_WIDTH = "clamp(8.5rem, 17vw, 16rem)"

export type Corner = {
  src: string
  position: string
  width: string
}

export const topCorners = [
  { src: "/top-left.svg", position: "left-0 top-0", width: CORNER_WIDTH },
  { src: "/top-right.svg", position: "right-0 top-0", width: CORNER_WIDTH },
] as const satisfies readonly Corner[]

const bottomLeft = {
  src: "/bottom-left.svg",
  position: "bottom-0 left-0",
  width: CORNER_WIDTH,
} as const

export const manifestoCorners = [
  ...topCorners,
  bottomLeft,
  {
    src: "/robot-head.svg",
    position: "right-0 bottom-0",
    width: ROBOT_HEAD_WIDTH,
  },
] as const satisfies readonly Corner[]

export const ctaCorners = [
  ...topCorners,
  bottomLeft,
  { src: "/bottom-right.svg", position: "right-0 bottom-0", width: CORNER_WIDTH },
] as const satisfies readonly Corner[]

// Sits in the same max-w-[76rem] box as GridRails, so each piece lands in a
// real grid corner rather than against the viewport edge.
export function CornerArt({
  corners,
  className,
}: {
  corners: readonly Corner[]
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 flex justify-center",
        className
      )}
    >
      <div className="relative h-full w-full max-w-[76rem] overflow-hidden">
        {corners.map((corner) => (
          <img
            key={corner.src}
            src={corner.src}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ width: corner.width }}
            className={`absolute ${corner.position}`}
          />
        ))}
      </div>
    </div>
  )
}
