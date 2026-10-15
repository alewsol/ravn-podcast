import { CornerArt, ctaCorners } from "@/components/landing/corner-art"
import { GridIntersections, gridRuleClassName } from "@/components/landing/grid-rails"

export function ClosingCta() {
  return (
    <section
      id="talk"
      className={`relative reveal scroll-mt-24 border-b-0 sm:border-b ${gridRuleClassName}`}
    >
      <GridIntersections />
      <CornerArt corners={ctaCorners} />
      <div className="relative z-10 mx-auto w-full max-w-[76rem] px-5 py-24 sm:px-6 lg:py-[9rem]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="type-hero text-foreground">
            Turn a job into a robot worker.
          </h2>
          <p className="type-body mt-4 text-muted-foreground">
            Give us the job. We turn it into a worker that can do it.
          </p>
          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center">
            <a
              href="https://cal.com/ravnlabs/15min"
              className="type-meta inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.02]"
            >
              Build a worker
            </a>
            <a
              href="https://cal.com/ravnlabs/15min"
              className="type-meta inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-4 font-medium text-foreground transition-transform duration-300 hover:scale-[1.02]"
            >
              See the platform
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
