import { getArticleCards } from "@/lib/articles"

import { ArticleGrid } from "./article-grid"
import { companies, opinions } from "./data"

export function TopicsSection() {
  const companyArticles = getArticleCards("worth-watching")
  const opinionArticles = getArticleCards("hot-takes")
  return (
    <>
      <ArticleGrid
        id="companies"
        eyebrow={companies.eyebrow}
        title={companies.title}
        description={companies.description}
        articles={companyArticles.slice(0, 3)}
        archiveHref="/worth-watching"
        totalCount={companyArticles.length}
        columns="three"
      />
      <ArticleGrid
        id="opinions"
        eyebrow={opinions.eyebrow}
        title={opinions.title}
        description={opinions.description}
        articles={opinionArticles.slice(0, 4)}
        archiveHref="/hot-takes"
        totalCount={opinionArticles.length}
        columns="two"
      />
    </>
  )
}
