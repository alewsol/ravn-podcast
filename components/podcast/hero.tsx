import Image from "next/image"
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight"

import { hero } from "./data"

export function PodcastHero() {
  return (
    <section className="site-container editorial-hero" aria-labelledby="hero-title">
      <div className="editorial-hero-copy ink-panel">
        <h1 id="hero-title" className="editorial-display">{hero.title}</h1>
        <div className="editorial-hero-actions">
          <a href="/atoms" className="ink-button ink-button-solid">
            ATOMS podcast
            <ArrowUpRightIcon size={17} aria-hidden="true" />
          </a>
          <a href="#editorial" className="ink-button">
            Founder Files
            <ArrowUpRightIcon size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="editorial-hero-art editorial-hero-art-robots ink-panel">
        <Image
          src="/illustrations/podcast-ink.svg"
          alt="Budera's two robot mascots chatting into microphones from their armchairs."
          width={2560}
          height={1440}
          sizes="(min-width: 1500px) 690px, (min-width: 900px) 48vw, 100vw"
          className="hero-robots"
          preload
        />
      </div>
    </section>
  )
}
