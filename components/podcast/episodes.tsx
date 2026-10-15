import { getArticlesByCategory } from "@/lib/articles"

import { ArticleGrid } from "./article-grid"
import { editorial } from "./data"

export function EpisodesSection() {
  return (
    <ArticleGrid
      id="editorial"
      eyebrow={editorial.eyebrow}
      title={editorial.title}
      description={editorial.description}
      articles={getArticlesByCategory("founder-files")}
      columns="three"
    />
  )
}
