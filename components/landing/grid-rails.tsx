import { cn } from "@/lib/utils"

const gridLineColor = "border-primary/20"

export const gridRailClassName = `border-x border-dashed ${gridLineColor}`

export const gridRuleClassName = `border-dashed ${gridLineColor}`

type GridRailsProps = {
  className?: string
}

export function GridRails({ className }: GridRailsProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 hidden justify-center sm:flex",
        className
      )}
    >
      <div className={cn("h-full w-full max-w-[76rem]", gridRailClassName)} />
    </div>
  )
}

// An 11px box whose centre lands exactly on the 1px rule/rail crossing:
// the box sits flush to the section's padding box, so the offsets below
// (half the box, minus half the 1px border) are whole pixels either way.
function GridIntersectionMark({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute bottom-0 block size-[11px] translate-y-[6px]",
        side === "left" ? "left-0 -translate-x-[5px]" : "right-0 translate-x-[5px]"
      )}
    >
      <span className="absolute top-1/2 left-0 h-px w-[11px] -translate-y-1/2 bg-primary/60" />
      <span className="absolute top-0 left-1/2 h-[11px] w-px -translate-x-1/2 bg-primary/60" />
    </span>
  )
}

export function GridIntersections() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] hidden justify-center sm:flex"
    >
      <div className="relative h-0 w-full max-w-[76rem]">
        <GridIntersectionMark side="left" />
        <GridIntersectionMark side="right" />
      </div>
    </div>
  )
}
