/* eslint-disable @next/next/no-img-element */

const scenes = [
  "/build.svg",
  "/train.svg",
  "/deploy.svg",
  "/evaluate.svg",
  "/improve.svg",
] as const

export function PipelineGraphic({ active }: { active: number }) {
  return (
    <div
      aria-hidden="true"
      className="relative h-full min-h-[22rem] overflow-hidden rounded-[1.5rem] bg-background ring-4 ring-primary-foreground/30 sm:min-h-[28rem] lg:min-h-[34rem]"
    >
      {scenes.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain p-7 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-10"
          style={{ opacity: index === active ? 1 : 0 }}
        />
      ))}
    </div>
  )
}
