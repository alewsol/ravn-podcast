import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/lib/site"

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
  ]
}
