import { BrainIcon } from "@phosphor-icons/react/dist/ssr/Brain"
import { BuildingsIcon } from "@phosphor-icons/react/dist/ssr/Buildings"
import { ClipboardTextIcon } from "@phosphor-icons/react/dist/ssr/ClipboardText"
import { ClockCounterClockwiseIcon } from "@phosphor-icons/react/dist/ssr/ClockCounterClockwise"
import { GearSixIcon } from "@phosphor-icons/react/dist/ssr/GearSix"
import { WrenchIcon } from "@phosphor-icons/react/dist/ssr/Wrench"

import { GridIntersections, gridRuleClassName } from "@/components/landing/grid-rails"

const systems = [
  { name: "SOPs", icon: ClipboardTextIcon },
  { name: "Machinery specs", icon: GearSixIcon },
  { name: "Equipment", icon: WrenchIcon },
  { name: "Work history", icon: ClockCounterClockwiseIcon },
  { name: "Expert knowledge", icon: BrainIcon },
  { name: "Sites & fleets", icon: BuildingsIcon },
] as const

function Track() {
  return (
    <ul className="flex items-center gap-8 pr-8 sm:gap-10 sm:pr-10">
      {systems.map((item) => (
        <li
          key={item.name}
          className="flex shrink-0 items-center gap-1.5 text-muted-foreground"
        >
          <item.icon
            className="size-3.5 shrink-0"
            weight="bold"
            aria-hidden="true"
          />
          <span className="type-meta whitespace-nowrap">{item.name}</span>
        </li>
      ))}
    </ul>
  )
}

export function LogoCloud() {
  return (
    <div className={`relative border-b-0 sm:border-b ${gridRuleClassName}`}>
      <GridIntersections />
      <div className="mx-auto w-full max-w-[76rem] px-5 py-8 sm:px-6">
        <p className="type-meta text-center text-muted-foreground">
          Trained on how you already operate.
        </p>
        <div
          aria-label="Systems RAVN trains on"
          className="relative mx-auto mt-4 max-w-3xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        >
          <div className="logo-marquee flex w-max">
            <Track />
            <div aria-hidden="true">
              <Track />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
