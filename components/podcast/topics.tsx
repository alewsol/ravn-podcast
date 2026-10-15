import { getArticlesByCategory } from "@/lib/articles"

import { ArticleGrid } from "./article-grid"
import { companies, opinions } from "./data"

export function TopicsSection() {
  return (
    <>
      <ArticleGrid
        id="companies"
        eyebrow={companies.eyebrow}
        title={companies.title}
        description={companies.description}
        articles={getArticlesByCategory("worth-watching")}
        columns="three"
      />
      <ArticleGrid
        id="opinions"
        eyebrow={opinions.eyebrow}
        title={opinions.title}
        description={opinions.description}
        articles={getArticlesByCategory("hot-takes")}
        columns="two"
      />
    </>
  )
}
