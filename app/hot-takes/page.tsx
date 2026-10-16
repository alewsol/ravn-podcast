import { getSectionMetadata, SectionPage } from "@/components/podcast/section-page"

export const metadata = getSectionMetadata("hot-takes")

export default function HotTakesPage() {
  return <SectionPage category="hot-takes" />
}
