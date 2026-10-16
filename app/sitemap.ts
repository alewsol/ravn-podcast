import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/lib/site"
import { articleSections } from "@/lib/article-sections"
import { getAllArticles } from "@/lib/articles"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getSiteUrl(),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${getSiteUrl()}/atoms`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...Object.keys(articleSections).map((category) => ({
      url: `${getSiteUrl()}/${category}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getAllArticles().map((article) => ({
      url: `${getSiteUrl()}/articles/${article.slug}`,
      lastModified: article.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]
}
