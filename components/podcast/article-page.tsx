import Link from "next/link"
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft"

import type { Article } from "@/lib/articles"

import { ArticleRichText } from "./article-rich-text"
import { NewsletterSection } from "./newsletter"
import { PodcastSiteFooter } from "./site-footer"
import { PodcastSiteHeader } from "./site-header"

export function ArticlePage({ article }: { article: Article }) {
  return (
    <div className="podcast-site relative flex min-h-full flex-col bg-background">
      <PodcastSiteHeader category={article.category} />

      <section className="site-container editorial-article-header ink-panel">
        <div>
          <Link
            href={`/${article.category}`}
            className="type-meta inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" weight="bold" aria-hidden="true" />
            Back to {article.series}
          </Link>

          <div className="mt-8 max-w-4xl">
            <p className="type-meta text-muted-foreground">{article.section}</p>
            <h1 className="editorial-display mt-4 text-foreground">{article.title}</h1>
            <p className="type-body mt-5 max-w-3xl text-muted-foreground">
              {article.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-muted-foreground">
              <span className="type-meta">{article.series}</span>
              <span className="type-meta">By {article.author}</span>
              <span className="type-meta">{article.publishedAt}</span>
              <span className="type-meta">{article.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container editorial-article-body">
        <div>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,46rem)_minmax(0,18rem)] lg:gap-20">
            <article className="min-w-0">
              <ArticleRichText markdown={article.markdown.replace(/^# .+\r?\n\s*/, "")} />
              {article.tags.length ? (
                <div className="mt-12 border-t border-border pt-6">
                  <h2 className="type-meta text-muted-foreground/70">Tags</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <li key={tag} className="type-meta text-muted-foreground">
                        #{tag.replace(/^#+/, "")}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </article>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="space-y-6 border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
                <div>
                  <p className="type-meta text-muted-foreground/70">Category</p>
                  <Link href={`/${article.category}`} className="type-title mt-2 block text-foreground hover:underline">{article.series}</Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <NewsletterSection />
      <PodcastSiteFooter />
    </div>
  )
}
