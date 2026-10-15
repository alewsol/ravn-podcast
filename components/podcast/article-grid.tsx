"use client"

import Link from "next/link"
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight"
import { BookmarkSimpleIcon } from "@phosphor-icons/react/dist/ssr/BookmarkSimple"
import { ImageDithering } from "@paper-design/shaders-react"

import type { Article } from "@/lib/articles"
import { cn } from "@/lib/utils"

type ArticleGridProps = {
  id: string
  eyebrow: string
  title: string
  description: string | readonly string[]
  articles: Article[]
  columns?: "two" | "three"
}

const cardImages = [
  "/var1.jpg",
  "/var2.jpg",
  "/var3.jpg",
  "/var4.jpg",
] as const

function initials(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?"
}

export function ArticleGrid({
  id,
  eyebrow,
  title,
  description,
  articles,
  columns = "three",
}: ArticleGridProps) {
  return (
    <section
      id={id}
      className="site-container editorial-section article-section"
      aria-labelledby={`${id}-title`}
    >
      <div>
        <div className="editorial-section-heading">
          <div>
            <p className="editorial-eyebrow">{eyebrow}</p>
            <h2 id={`${id}-title`} className="editorial-heading">{title}</h2>
          </div>
          <div className="editorial-section-description">
            {(Array.isArray(description) ? description : [description]).map((paragraph) => (
              <p key={paragraph} className="editorial-body">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "mt-12 grid gap-4 lg:mt-14 lg:gap-5",
            columns === "three" ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"
          )}
        >
          {articles.map((article, index) => {
            const image = cardImages[index % cardImages.length]

            return (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group relative flex min-h-[21rem] flex-col justify-between overflow-hidden rounded-lg p-6 text-white transition-transform duration-300 hover:-translate-y-1 sm:p-7"
              >
                <ImageDithering
                  className="absolute inset-0 -z-10 size-full"
                  image={image}
                  width="100%"
                  height="100%"
                  colorBack="#000c38"
                  colorFront="#94ffaf"
                  colorHighlight="#eaff94"
                  originalColors={false}
                  inverted={false}
                  type="8x8"
                  size={2}
                  colorSteps={2}
                  scale={1}
                  fit="cover"
                />
                <div className="absolute inset-0 -z-10 bg-black/20" aria-hidden="true" />

                <div className="flex items-start justify-between gap-4">
                  <span className="type-meta text-white/70">{article.readTime}</span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-white/80 transition-colors duration-300 group-hover:bg-white/25">
                    <BookmarkSimpleIcon className="size-4" weight="bold" aria-hidden="true" />
                  </span>
                </div>

                <div className="mt-6 flex items-start justify-between gap-3">
                  <h3 className="text-[1.5rem] leading-[1.15] font-semibold tracking-tight text-white">
                    {article.title}
                  </h3>
                  <ArrowRightIcon
                    className="mt-1.5 size-5 shrink-0 -rotate-45 text-white/90 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                    weight="bold"
                    aria-hidden="true"
                  />
                </div>

                <div className="mt-8 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-sm font-semibold text-white">
                      {initials(article.author)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-white">
                        {article.author}
                      </span>
                      <span className="block truncate text-xs text-white/65">
                        {article.series}
                      </span>
                    </span>
                  </div>
                  <span className="type-meta shrink-0 rounded-full bg-white/15 px-4 py-1.5 font-medium text-white transition-colors duration-300 group-hover:bg-white/25">
                    Read
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
