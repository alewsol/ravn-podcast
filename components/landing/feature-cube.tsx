import type { Icon } from "@phosphor-icons/react/dist/lib/types"

import { cn } from "@/lib/utils"

export type CubeMotion = "orbit" | "scan" | "path" | "glow"

export function FeatureCube({
  id,
  index,
  icon: Glyph,
  faces,
  motion,
  className,
}: {
  id: string
  index: string
  icon: Icon
  faces: {
    left: readonly [string, string]
    right: readonly [string, string]
    top: readonly [string, string]
  }
  motion: CubeMotion
  className?: string
}) {
  const top = `${id}-top`
  const left = `${id}-left`
  const right = `${id}-right`
  const grid = `${id}-grid`

  return (
    <div
      className={cn(
        "relative aspect-[5/4] overflow-hidden rounded-[1.25rem] bg-muted/80 ring-1 ring-border/50 transition-colors duration-300 group-hover:bg-muted",
        className
      )}
    >
      <p className="type-meta absolute top-3 left-3 z-10 text-muted-foreground">
        {index}
      </p>
      <div className="cube-float absolute inset-0">
        <svg
          viewBox="0 0 320 256"
          className="absolute inset-0 size-full text-foreground/12"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id={grid}
              width="24"
              height="14"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="12" cy="0" r="0.7" fill="currentColor" />
              <circle cx="0" cy="7" r="0.7" fill="currentColor" />
              <circle cx="24" cy="7" r="0.7" fill="currentColor" />
              <circle cx="12" cy="14" r="0.7" fill="currentColor" />
            </pattern>
            <linearGradient id={top} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={faces.top[0]} />
              <stop offset="100%" stopColor={faces.top[1]} />
            </linearGradient>
            <linearGradient id={left} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={faces.left[0]} />
              <stop offset="100%" stopColor={faces.left[1]} />
            </linearGradient>
            <linearGradient id={right} x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={faces.right[0]} />
              <stop offset="100%" stopColor={faces.right[1]} />
            </linearGradient>
            <filter
              id={`${id}-shadow`}
              x="-20%"
              y="-10%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="10"
                stdDeviation="8"
                floodColor="oklch(0.32 0.012 75)"
                floodOpacity="0.12"
              />
            </filter>
          </defs>
          <rect width="320" height="256" fill={`url(#${grid})`} />
          <g filter={`url(#${id}-shadow)`} transform="translate(80 48)">
            <path d="M80 10 L148 48 L80 86 L12 48 Z" fill={`url(#${top})`} />
            <path d="M12 48 L80 86 L80 154 L12 116 Z" fill={`url(#${left})`} />
            <path
              d="M80 86 L148 48 L148 116 L80 154 Z"
              fill={`url(#${right})`}
            />
          </g>
        </svg>
        <Glyph
          weight="fill"
          className="absolute top-[40%] left-1/2 size-6 -translate-x-1/2 -translate-y-1/2 text-foreground/50"
          aria-hidden="true"
        />
      </div>
      {motion === "orbit" ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid place-items-center"
        >
          <span className="orbit-ring size-36 rounded-full border border-dashed border-foreground/15" />
        </span>
      ) : null}
      {motion === "scan" ? (
        <span
          aria-hidden="true"
          className="scan-line pointer-events-none absolute inset-x-6 h-px bg-foreground/30"
        />
      ) : null}
      {motion === "path" ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 bottom-8 flex items-center"
        >
          <span className="pulse-dot size-1.5 rounded-full bg-foreground/50" />
          <span className="h-px flex-1 bg-foreground/15" />
          <span
            className="pulse-dot size-1.5 rounded-full bg-foreground/50"
            style={{ animationDelay: "0.4s" }}
          />
          <span className="h-px flex-1 bg-foreground/15" />
          <span
            className="pulse-dot size-1.5 rounded-full bg-foreground/50"
            style={{ animationDelay: "0.8s" }}
          />
        </span>
      ) : null}
      {motion === "glow" ? (
        <span
          aria-hidden="true"
          className="glow-ring pointer-events-none absolute top-1/2 left-1/2 size-28 rounded-full border border-foreground/20"
        />
      ) : null}
    </div>
  )
}
