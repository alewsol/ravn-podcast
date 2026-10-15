import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight"
import { CircuitryIcon } from "@phosphor-icons/react/dist/ssr/Circuitry"
import { CraneIcon } from "@phosphor-icons/react/dist/ssr/Crane"
import { NutIcon } from "@phosphor-icons/react/dist/ssr/Nut"
import { ScanIcon } from "@phosphor-icons/react/dist/ssr/Scan"
import { TruckIcon } from "@phosphor-icons/react/dist/ssr/Truck"

import { GridIntersections, gridRuleClassName } from "@/components/landing/grid-rails"
import { cn } from "@/lib/utils"

const workers = [
  {
    icon: CircuitryIcon,
    title: "Robot technicians",
    body: "Diagnose, repair, and maintain robots and industrial machinery.",
    tasks: ["Fault diagnosis", "Component replacement", "Calibration"],
  },
  {
    icon: NutIcon,
    title: "Maintenance workers",
    body: "Handle recurring equipment maintenance and repair.",
    tasks: ["Scheduled servicing", "Wear monitoring", "Parts replacement"],
  },
  {
    icon: TruckIcon,
    title: "Field service workers",
    body: "Service and repair jobs across physical locations.",
    tasks: ["Multi-site dispatch", "On-site repair", "Job reporting"],
  },
  {
    icon: ScanIcon,
    title: "Inspection workers",
    body: "Inspect assets and catch problems before they become failures.",
    tasks: ["Asset walkthroughs", "Defect detection", "Condition logging"],
  },
  {
    icon: CraneIcon,
    title: "Production workers",
    body: "Specialized physical tasks across manufacturing operations.",
    tasks: ["Line operation", "Material handling", "Quality checks"],
  },
] as const

// Cells carry only their bottom and right rule; the wrapper supplies the top
// and left, so shared edges are a single dashed line rather than a double one.
const cellClassName =
  "flex flex-col border-r border-b border-dashed border-border p-6 sm:p-8"

export function WorkerTypes() {
  return (
    <section
      id="workers"
      className={`relative reveal scroll-mt-24 border-b-0 sm:border-b ${gridRuleClassName}`}
    >
      <GridIntersections />
      <div className="mx-auto w-full max-w-[76rem] px-5 py-24 sm:px-6 lg:py-[7rem]">
        <div className="max-w-3xl">
          <p className="type-meta inline-flex h-8 items-center rounded-full border border-border bg-background px-3 font-medium text-foreground">
            Worker types
          </p>
          <h2 className="type-section mt-5 text-foreground">
            Built for the roles nobody can fill.
          </h2>
          <p className="type-body mt-4 max-w-xl text-muted-foreground">
            RAVN turns that job into a worker, instead of you trying to hire for
            a role nobody wants.
          </p>
        </div>

        <div className="mt-12 grid border-t border-l border-dashed border-border sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {workers.map((worker, index) => (
            <article
              key={worker.title}
              className={cn(cellClassName, "transition-colors duration-300 hover:bg-card")}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-10 shrink-0 place-items-center bg-primary text-primary-foreground">
                  <worker.icon className="size-5" weight="bold" aria-hidden="true" />
                </span>
                <span className="type-meta tabular-nums text-muted-foreground/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="type-title mt-6 text-foreground">{worker.title}</h3>
              <p className="type-body mt-2 text-muted-foreground">{worker.body}</p>
              <ul className="mt-6 flex flex-col gap-2 border-t border-dashed border-border pt-5">
                {worker.tasks.map((task) => (
                  <li
                    key={task}
                    className="type-meta flex items-center gap-2 text-muted-foreground"
                  >
                    <span
                      aria-hidden="true"
                      className="size-1 shrink-0 rotate-45 bg-primary"
                    />
                    {task}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <article className={cn(cellClassName, "justify-between bg-primary")}>
            <div>
              <h3 className="type-title text-primary-foreground">
                A role that isn&apos;t listed?
              </h3>
              <p className="type-body mt-2 text-primary-foreground/70">
                If a job can be described, it can be built. Tell us the role and
                we&apos;ll scope the worker for it.
              </p>
            </div>
            <a
              href="https://cal.com/ravnlabs/15min"
              className="type-meta mt-8 inline-flex h-10 w-fit items-center gap-2 rounded-full bg-primary-foreground px-4 font-medium text-primary transition-transform duration-300 hover:scale-[1.02]"
            >
              Talk to us
              <ArrowRightIcon className="size-4" weight="bold" aria-hidden="true" />
            </a>
          </article>
        </div>

        <p className="type-section mx-auto mt-16 max-w-2xl text-center font-[450] text-foreground">
          A machine breaks down. A repair needs a technician who isn&apos;t
          available. RAVN builds the worker trained on your operation instead.
        </p>
      </div>
    </section>
  )
}
