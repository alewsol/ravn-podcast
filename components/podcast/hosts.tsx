import Image from "next/image"
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight"

import { podcast } from "./data"

export function HostsSection() {
  return (
    <section id="podcast" className="site-container editorial-section" aria-labelledby="podcast-title">
      <div className="podcast-panel ink-panel">
        <div className="podcast-intro">
          <div className="podcast-intro-copy">
            <p className="editorial-eyebrow">{podcast.label}</p>
            <h2 id="podcast-title" className="editorial-heading">{podcast.name}</h2>
            <p className="podcast-subheading">{podcast.title}</p>
            <p className="editorial-body">{podcast.subtitle}</p>
          </div>
          <div className="podcast-illustration">
            <Image
              src="/illustrations/atoms-workshop.webp"
              alt="Budera's robot hosts calmly recording while their prototype tangles itself in microphone cables."
              width={1536}
              height={1024}
              sizes="(min-width: 900px) 45vw, 100vw"
            />
          </div>
        </div>
        <div className="podcast-conversation">
          <p className="editorial-body podcast-description">{podcast.body}</p>
          <div className="podcast-closing">
            {podcast.closing.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? "editorial-body" : "podcast-signoff"}>
                {paragraph}
              </p>
            ))}
          </div>
          <a className="ink-button ink-button-solid podcast-cta" href={podcast.cta.href}>
            {podcast.cta.label}
            <ArrowUpRightIcon size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
