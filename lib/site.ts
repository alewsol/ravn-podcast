// lib/site.ts
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://budera.ai").replace(/\/+$/, "")
}
