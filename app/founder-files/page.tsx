import { getSectionMetadata, SectionPage } from "@/components/podcast/section-page"

export const metadata = getSectionMetadata("founder-files")

export default function FounderFilesPage() {
  return <SectionPage category="founder-files" />
}
