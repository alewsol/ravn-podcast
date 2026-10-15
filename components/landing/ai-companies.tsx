import { GridIntersections, gridRuleClassName } from "@/components/landing/grid-rails"

const apiLines = [
  {
    call: "instruct(task)",
    note: "Send a natural-language instruction. RAVN turns it into motion, sensing, and manipulation — your agent never touches the low-level controls.",
  },
  {
    call: "autonomous_instruct(goal)",
    note: "Give a goal instead of a single task. The worker keeps going on the same pipeline until the job is done or it needs a check-in.",
  },
  {
    call: "check(task_id)",
    note: "See how the job is going. Status comes back without exposing internals.",
  },
] as const

const snippet = [
  { tone: "comment", text: "# hand a task to a worker" },
  { tone: "code", text: "job = ravn.instruct(" },
  { tone: "code", text: '    worker="line-3-technician",' },
  { tone: "code", text: '    task="swap the bearing on conveyor 3",' },
  { tone: "code", text: ")" },
  { tone: "blank", text: "" },
  { tone: "comment", text: "# or give it a goal and let it run" },
  { tone: "code", text: "job = ravn.autonomous_instruct(" },
  { tone: "code", text: '    goal="bring conveyor 3 back to spec",' },
  { tone: "code", text: ")" },
  { tone: "blank", text: "" },
  { tone: "comment", text: "# check in whenever you need to" },
  { tone: "code", text: "ravn.check(job.id)" },
  { tone: "result", text: "→ running · step 2 of 4 · no check-in needed" },
] as const

const tones = {
  comment: "text-primary-foreground/45",
  code: "text-primary-foreground/90",
  result: "text-primary-foreground/60",
  blank: "",
} as const

const cellClassName = "border-r border-b border-dashed border-border p-6 sm:p-8"

export function AiCompanies() {
  return (
    <section
      id="ai-companies"
      className={`relative reveal scroll-mt-24 border-b-0 sm:border-b ${gridRuleClassName}`}
    >
      <GridIntersections />
      <div className="mx-auto w-full max-w-[76rem] px-5 py-24 sm:px-6 lg:py-[7rem]">
        <div className="max-w-3xl">
          <p className="type-meta inline-flex h-8 items-center rounded-full border border-border bg-background px-3 font-medium text-foreground">
            For AI companies
          </p>
          <h2 className="type-section mt-5 text-foreground">
            Give your agent a body.
          </h2>
          <p className="type-body mt-4 max-w-xl text-muted-foreground">
            Same infrastructure, different buyer. If your AI agent needs to act
            in the physical world, RAVN builds the physical worker behind it —
            on the same build, train, deploy, evaluate, improve pipeline.
          </p>
        </div>

        <div className="mt-12 grid border-t border-l border-dashed border-border lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
          <div className={`${cellClassName} min-w-0 bg-code`}>
            <div className="flex items-center justify-between gap-4 border-b border-dashed border-primary-foreground/20 pb-4">
              <span className="type-meta font-mono text-primary-foreground/60">
                agent.py
              </span>
              <span className="type-meta text-primary-foreground/40">
                Public API
              </span>
            </div>
            <pre className="mt-6 w-full overflow-x-auto">
              <code className="type-meta block font-mono leading-[1.95]">
                {snippet.map((line, index) => (
                  <span key={index} className={`block ${tones[line.tone]}`}>
                    {line.text || "\u00A0"}
                  </span>
                ))}
              </code>
            </pre>
          </div>

          <dl className="flex min-w-0 flex-col">
            {apiLines.map((item, index) => (
              <div
                key={item.call}
                className={`${cellClassName} flex flex-1 flex-col justify-center`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="type-meta tabular-nums text-muted-foreground/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <dt className="type-title font-mono text-foreground">
                    {item.call}
                  </dt>
                </div>
                <dd className="type-body mt-2 text-muted-foreground">
                  {item.note}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-body max-w-xl text-muted-foreground">
            RAVN also ships skills, so your AI, or your team, understands how the
            system works without digging into the internals.
          </p>
          <a
            href="https://cal.com/ravnlabs/15min"
            className="type-meta inline-flex h-10 w-fit shrink-0 items-center rounded-full bg-primary px-4 font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.02]"
          >
            Read more
          </a>
        </div>
      </div>
    </section>
  )
}
