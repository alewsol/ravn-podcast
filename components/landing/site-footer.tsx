import Image from "next/image"
import Link from "next/link"

import { GridIntersections, gridRuleClassName } from "@/components/landing/grid-rails"

// footer.svg is a 2560x1440 canvas whose wordmark only occupies y 273..1094,
// so the empty margins are cropped rather than rendered as dead space.
const MARK_WIDTH = "clamp(17rem, 62vw, 46rem)"
const MARK_RATIO = 1440 / 2560
const MARK_TOP = 273 / 1440
const MARK_BAND = (1094 - 273) / 1440

const columns = [
  {
    title: "Platform",
    links: [
      { href: "#platform", label: "What we are" },
      { href: "#pipeline", label: "How it works" },
    ],
  },
  {
    title: "Workers",
    links: [{ href: "#workers", label: "Worker types" }],
  },
  {
    title: "Company",
    links: [
      { href: "#ai-companies", label: "For AI companies" },
      { href: "https://cal.com/ravnlabs/15min", label: "Talk to us" }
    ],
  },
] as const

export function SiteFooter() {
  return (
    <footer
      className={`relative border-b-0 sm:border-b ${gridRuleClassName}`}
    >
      <GridIntersections />
      <div className="mx-auto w-full max-w-[76rem] px-5 pt-12 sm:px-6 lg:pt-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-2"
              aria-label="RAVN home"
            >
              <Image
                src="/logo.svg"
                alt=""
                width={24}
                height={24}
                className="size-6"
              />
              <span className="type-title tracking-tight text-foreground">
                RAVN
              </span>
            </Link>
            <p className="type-body mt-4 text-muted-foreground">
              Infrastructure for companies building specialized robot workers.
            </p>
          </div>

          <nav aria-label="Footer">
            <div className="grid gap-10 sm:grid-cols-3 sm:gap-16">
              {columns.map((column) => (
                <div key={column.title}>
                  <p className="type-title text-foreground">{column.title}</p>
                  <ul className="mt-4 space-y-2.5">
                    {column.links.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className="type-meta text-muted-foreground transition-colors duration-300 hover:text-foreground"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-meta text-muted-foreground">
            © {new Date().getFullYear()} RAVN. All rights reserved.
          </p>
          <p className="type-meta text-muted-foreground">
            Built for enterprises and AI companies.
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none mt-8 w-full overflow-hidden"
        style={{ height: `calc(${MARK_WIDTH} * ${MARK_RATIO * MARK_BAND})` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/footer.svg"
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            width: MARK_WIDTH,
            opacity: 0.28,
            marginTop: `calc(${MARK_WIDTH} * -${MARK_RATIO * MARK_TOP})`,
          }}
          className="mx-auto block max-w-none select-none"
        />
      </div>
    </footer>
  )
}
