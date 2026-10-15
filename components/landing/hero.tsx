import { CornerArt, topCorners } from "@/components/landing/corner-art"
import { GridIntersections, GridRails, gridRuleClassName } from "@/components/landing/grid-rails"

export function Hero() {
  return (
    <section
      className={`relative min-h-[45rem] w-full bg-background border-b-0 sm:min-h-[50rem] sm:border-b lg:min-h-[58rem] ${gridRuleClassName}`}
    >
      <div className="pointer-events-none absolute inset-0 z-0 flex justify-center">
        <div className="relative h-full w-full max-w-[76rem] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/bg.svg"
            alt=""
            aria-hidden="true"
            style={{ opacity: 0.55 }}
            className="absolute inset-x-0 bottom-5 top-auto block w-full max-w-none origin-bottom translate-y-0 scale-x-110 sm:bottom-auto sm:top-60 sm:translate-y-24 lg:top-80 lg:translate-y-28"
          />
          <div className="hero-dot-grid absolute inset-0 opacity-50" aria-hidden="true" />
        </div>
      </div>
      <CornerArt corners={topCorners} className="hidden sm:flex" />
      <GridRails className="z-[5]" />
      <GridIntersections />
      <div className="relative z-10 mx-auto flex w-full max-w-[76rem] flex-col items-center px-5 pb-[calc(56.25vw+3rem)] pt-[9rem] text-center sm:px-6 sm:pb-72 lg:pb-[28rem] lg:pt-52">
        <p className="type-meta inline-flex h-8 items-center rounded-full border border-border bg-background px-3 font-medium text-foreground">
          4,000+ builders already running on RAVN
        </p>
        <h1 className="type-hero mt-5 max-w-3xl text-foreground">
          Specialized robotic workers, built for you.
        </h1>
        <p className="type-body mt-3 max-w-[19rem] text-muted-foreground sm:max-w-xl">
          RAVN gives enterprises the infrastructure to build, train, deploy, and
          evaluate robot workers on their SOPs, equipment, machinery, and
          operational knowledge.
        </p>
        <div className="mt-6 flex w-full max-w-[16rem] flex-col gap-2 sm:max-w-none sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <a
            href="https://cal.com/ravnlabs/15min"
            className="type-meta inline-flex h-10 w-full items-center justify-center rounded-full bg-primary px-4 font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.02] sm:w-auto"
          >
            Build a worker
          </a>
          <a
            href="https://cal.com/ravnlabs/15min"
            className="type-meta inline-flex h-10 w-full items-center justify-center rounded-full border border-border bg-background px-3 font-medium text-foreground transition-transform duration-300 hover:scale-[1.02] sm:w-auto"
          >
            Talk to us
          </a>
        </div>
      </div>
    </section>
  )
}
