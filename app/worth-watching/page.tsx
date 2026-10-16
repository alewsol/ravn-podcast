import { getSectionMetadata, SectionPage } from "@/components/podcast/section-page"

export const metadata = getSectionMetadata("worth-watching")

export default function WorthWatchingPage() {
  return <SectionPage category="worth-watching" />
}
