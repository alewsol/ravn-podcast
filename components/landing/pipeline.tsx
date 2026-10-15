"use client"

import { useEffect, useRef, useState } from "react"

import { PipelineGraphic } from "@/components/landing/pipeline-graphic"
import { GridIntersections, gridRuleClassName } from "@/components/landing/grid-rails"
import { cn } from "@/lib/utils"

const STEP_MS = 4200

const stages = [
  {
    index: "01",
    title: "Build",
    body: "Define the worker: what it's responsible for, what tools it uses, what it's capable of.",
  },
  {
    index: "02",
    title: "Train",
    body: "Teach it your procedures using SOPs, machinery specs, work history, and the knowledge your people carry around.",
  },
  {
    index: "03",
    title: "Deploy",
    body: "Put it into real operations. Manage workers across sites and fleets from one place.",
  },
  {
    index: "04",
    title: "Evaluate",
    body: "Test how reliably it performs the job it was actually built for.",
  },
  {
    index: "05",
    title: "Improve",
    body: "Feed real-world results and feedback back in. The worker gets better over time.",
  },
] as const

export function Pipeline() {
  const [active, setActive] = useState(0)
  const [cycle, setCycle] = useState(0)
  const [paused, setPaused] = useState(false)
  const remainingRef = useRef(STEP_MS)
  const startedRef = useRef(0)

  useEffect(() => {
    remainingRef.current = STEP_MS
  }, [active, cycle])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }
    if (paused) {
      return
    }
    startedRef.current = Date.now()
    const id = window.setTimeout(() => {
      remainingRef.current = STEP_MS
      setActive((value) => (value + 1) % stages.length)
      setCycle((value) => value + 1)
    }, remainingRef.current)
    return () => {
      window.clearTimeout(id)
      remainingRef.current = Math.max(
        50,
        remainingRef.current - (Date.now() - startedRef.current)
      )
    }
  }, [active, cycle, paused])

  const select = (index: number) => {
    remainingRef.current = STEP_MS
    setActive(index)
    setCycle((value) => value + 1)
  }

  return (
    <section
      id="pipeline"
      className={`relative reveal scroll-mt-24 border-b-0 sm:border-b ${gridRuleClassName}`}
    >
      <GridIntersections />
      <div className="mx-auto w-full max-w-[76rem] px-5 py-24 sm:px-6 lg:py-[7rem]">
        <div className="max-w-3xl">
          <p className="type-meta inline-flex h-8 items-center rounded-full border border-border bg-background px-3 font-medium text-foreground">
            The pipeline
          </p>
          <h2 className="type-section mt-5 text-foreground">
            One pipeline. Every worker runs through it.
          </h2>
          <p className="type-body mt-4 max-w-xl text-muted-foreground">
            Five stages, one loop. Every worker on RAVN is built, trained,
            deployed, evaluated, and improved the same way.
          </p>
        </div>

        <div className="mt-14 grid items-stretch gap-10 lg:mt-16 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col">
            <div
              className={cn("flex-1", paused && "pipeline-paused")}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="flex flex-col gap-1" role="tablist" aria-label="Pipeline stages">
                {stages.map((item, index) => {
                  const selected = index === active
                  return (
                    <button
                      key={item.title}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => select(index)}
                      className={cn(
                        "flex w-full gap-4 rounded-2xl px-4 py-4 text-left transition-colors duration-300",
                        selected
                          ? "bg-card ring-1 ring-border/70"
                          : "hover:bg-card/70"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className="relative w-[3px] min-h-5 shrink-0 self-stretch overflow-hidden rounded-full bg-border"
                      >
                        <span
                          key={selected ? `fill-${cycle}` : item.title}
                          className={cn(
                            "absolute inset-x-0 top-0 h-full origin-top bg-primary",
                            selected && "pipeline-fill",
                            index < active && "scale-y-100",
                            index > active && "scale-y-0"
                          )}
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline gap-2.5">
                          <span
                            className={cn(
                              "type-meta tabular-nums transition-colors duration-300",
                              selected
                                ? "text-foreground"
                                : "text-muted-foreground/70"
                            )}
                          >
                            {item.index}
                          </span>
                          <span
                            className={cn(
                              "type-title transition-colors duration-300",
                              selected
                                ? "text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {item.title}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "type-body grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            selected
                              ? "mt-2 grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          )}
                        >
                          <span className="overflow-hidden text-muted-foreground">
                            {item.body}
                          </span>
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
            <a
              href="https://cal.com/ravnlabs/15min"
              className="type-meta mt-10 inline-flex h-10 w-fit items-center rounded-full bg-primary px-4 font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.02]"
            >
              Build a worker
            </a>
          </div>

          <PipelineGraphic active={active} />
        </div>
      </div>
    </section>
  )
}
