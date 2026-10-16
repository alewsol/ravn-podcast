import { getArticleCards } from "@/lib/articles"

import { ArticleGrid } from "./article-grid"
import { editorial } from "./data"

export function EpisodesSection() {
  const articles = getArticleCards("founder-files")
  return (
    <ArticleGrid
      id="editorial"
      eyebrow={editorial.eyebrow}
      title={editorial.title}
      description={editorial.description}
      articles={articles.slice(0, 3)}
      archiveHref="/founder-files"
      totalCount={articles.length}
      columns="three"
    />
  )
}
