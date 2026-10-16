import { companies, editorial, opinions } from "@/components/podcast/data"
import type { ArticleCategory } from "@/lib/articles"

export const articleSections = {
  "founder-files": { ...editorial, id: "editorial", columns: "three" },
  "worth-watching": { ...companies, id: "companies", columns: "three" },
  "hot-takes": { ...opinions, id: "opinions", columns: "two" },
} as const satisfies Record<ArticleCategory, {
  eyebrow: string
  title: string
  description: readonly string[]
  id: string
  columns: "two" | "three"
}>
