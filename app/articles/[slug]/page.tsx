import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ArticlePage } from "@/components/podcast/article-page"
import { getAllArticles, getArticleBySlug, isSubscriberArticle } from "@/lib/articles"
import { hasSubscriberAccess } from "@/lib/subscriber-access"

type ArticlePageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return {
      title: "Article not found | Budera",
    }
  }

  return {
    title: `${article.title} | Budera`,
    description: article.excerpt,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: `/articles/${article.slug}`,
      publishedTime: article.publishedAt,
      authors: [article.author],
      section: article.series,
    },
  }
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const locked = isSubscriberArticle(article) && !(await hasSubscriberAccess())
  return <ArticlePage article={article} locked={locked} />
}
