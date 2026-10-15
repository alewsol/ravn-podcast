import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ArticlePage } from "@/components/podcast/article-page"
import { getAllArticles, getArticleBySlug } from "@/lib/articles"

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
  }
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return <ArticlePage article={article} />
}
