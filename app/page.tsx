
import { FeaturedQuote } from "@/components/podcast/featured-quote"
import { PodcastHero } from "@/components/podcast/hero"
import { HostsSection } from "@/components/podcast/hosts"
import { NewsletterSection } from "@/components/podcast/newsletter"
import { EpisodesSection } from "@/components/podcast/episodes"
import { PodcastSiteFooter } from "@/components/podcast/site-footer"
import { PodcastSiteHeader } from "@/components/podcast/site-header"
import { TopicsSection } from "@/components/podcast/topics"

export default function Home() {
  return (
    <div className="podcast-site relative flex min-h-full flex-col bg-background">
      <PodcastSiteHeader />
      <PodcastHero />
      <main>
        <FeaturedQuote />
        <EpisodesSection />
        <HostsSection />
        <TopicsSection />
        <NewsletterSection />
      </main>
      <PodcastSiteFooter />
    </div>
  )
}
