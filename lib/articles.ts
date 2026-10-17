import articleData from "@/content/articles.json"

export type ArticleCategory = "founder-files" | "worth-watching" | "hot-takes"

export type Article = {
  id: string
  slug: string
  category: ArticleCategory
  section: string
  series: string
  title: string
  excerpt: string
  author: string
  publishedAt: string
  readTime: string
  featured: boolean
  tags: string[]
  coverImage: string | null
  markdown: string
  sources?: { title: string; url: string }[]
}

const articles = articleData as Article[]

export type ArticleCard = Omit<Article, "markdown" | "sources">

export function getAllArticles(): Article[] {
  return articles
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return articles
    .filter((article) => article.category === category)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export function getArticleCards(category: ArticleCategory): ArticleCard[] {
  return getArticlesByCategory(category).map((article) => {
    // Full text and research sources stay on the server, out of listing payloads.
    const { markdown, sources, ...card } = article
    void markdown
    void sources
    return card
  })
}
