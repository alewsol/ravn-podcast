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
}

const articles = articleData as Article[]

export function getAllArticles(): Article[] {
  return articles
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return articles.filter((article) => article.category === category)
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}
