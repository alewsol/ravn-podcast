import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft"

import { articleSections } from "@/lib/article-sections"
import { getArticleCards, type ArticleCategory } from "@/lib/articles"
import { hasSubscriberAccess } from "@/lib/subscriber-access"
import { ArticleGrid } from "./article-grid"
import { NewsletterSection } from "./newsletter"
import { PodcastSiteFooter } from "./site-footer"
import { PodcastSiteHeader } from "./site-header"

export function getSectionMetadata(category: ArticleCategory): Metadata {
  const section = articleSections[category]
  const title = `${section.title} | Budera`
  const description = section.description.join(" ")

  return {
    title,
    description,
    alternates: { canonical: `/${category}` },
    openGraph: { title, description, url: `/${category}`, type: "website" },
  }
}

export async function SectionPage({ category }: { category: ArticleCategory }) {
  const section = articleSections[category]
  const articles = getArticleCards(category)
  const hasAccess = await hasSubscriberAccess()

  return (
    <div className="podcast-site relative flex min-h-full flex-col bg-background">
      <PodcastSiteHeader />
      <main>
        <div className="site-container mt-8">
          <Link href="/" className="type-meta inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeftIcon className="size-4" aria-hidden="true" />
            Back to Budera
          </Link>
        </div>
        <ArticleGrid
          {...section}
          articles={articles}
          headingLevel="h1"
          totalCount={articles.length}
          hasAccess={hasAccess}
        />
        <NewsletterSection />
      </main>
      <PodcastSiteFooter />
    </div>
  )
}
