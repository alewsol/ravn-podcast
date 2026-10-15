import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight"
import { MicrophoneIcon } from "@phosphor-icons/react/dist/ssr/Microphone"

import { atoms } from "@/components/atoms/data"
import { getSiteUrl } from "@/lib/site"

const socialImage = {
  url: "/illustrations/atoms-studio-v2.webp",
  width: 1254,
  height: 1254,
  alt: "The ATOMS robot hosts recording from comically mismatched chairs.",
}

export const metadata: Metadata = {
  title: "ATOMS Podcast — A Budera Original",
  description: "The people building the physical future. A Budera Original podcast with the brilliant, slightly insane people bringing robotics and physical AI to life.",
  alternates: { canonical: "/atoms" },
  openGraph: {
    type: "website",
    url: new URL("/atoms", getSiteUrl()).toString(),
    siteName: "Budera",
    title: "ATOMS Podcast. A Budera Original.",
    description: atoms.subtitle,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATOMS Podcast. A Budera Original.",
    description: atoms.subtitle,
    images: [socialImage.url],
  },
}

export default function AtomsPage() {
  return (
    <div className="podcast-site atoms-page relative flex min-h-full flex-col bg-background">
      <header className="editorial-header">
        <div className="site-container atoms-header-bar">
          <nav aria-label="Breadcrumb" className="atoms-breadcrumb">
            <Link href="/" aria-label="Budera home" className="atoms-home-link">
              <Image src="/logo.svg" alt="" width={28} height={28} className="ink-logo" />
              <span>BUDERA</span>
            </Link>
            <span aria-hidden="true" className="atoms-breadcrumb-divider">/</span>
            <span aria-current="page">ATOMS</span>
          </nav>
          <nav aria-label="ATOMS sections" className="atoms-section-nav">
            <a href="#conversations" className="editorial-nav-link">Conversations</a>
            <a href="#episodes" className="editorial-nav-link">Episodes</a>
            <a href="#your-turn" className="editorial-nav-link">Your turn</a>
          </nav>
        </div>
      </header>

      <main id="main-content" className="site-container atoms-main">
        <section className="atoms-hero ink-panel" aria-labelledby="atoms-title">
          <div className="atoms-hero-copy">
            <p className="editorial-eyebrow atoms-podcast-label">
              <MicrophoneIcon size={17} aria-hidden="true" />
              {atoms.eyebrow}
            </p>
            <h1 id="atoms-title" className="atoms-display">{atoms.title}</h1>
            <h2 className="atoms-hero-subtitle">{atoms.subtitle}</h2>
            <div className="atoms-prose">
              <p>{atoms.introduction.lead} <em>{atoms.introduction.aside}</em></p>
              <p>{atoms.introduction.body}</p>
            </div>
            <a href="#conversations" className="ink-button ink-button-solid atoms-button">
              <span>{atoms.introduction.cta}</span>
              <ArrowUpRightIcon size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="atoms-hero-art">
            <Image
              src="/illustrations/atoms-studio-v2.webp"
              alt="The ATOMS robot podcasters in mismatched chairs, with the smaller host raised on a stack of engineering books."
              width={1254}
              height={1254}
              sizes="(min-width: 1500px) 700px, (min-width: 900px) 48vw, 100vw"
              preload
            />
          </div>
        </section>

        <section id="conversations" className="atoms-section" aria-labelledby="conversations-title">
          <div className="atoms-section-intro">
            <p className="editorial-eyebrow">{atoms.conversations.eyebrow}</p>
            <h2 id="conversations-title" className="editorial-heading">{atoms.conversations.title}</h2>
          </div>
          <ol className="atoms-conversation-grid">
            {atoms.conversations.questions.map((question, index) => (
              <li key={question.title} className="atoms-conversation-card ink-panel">
                <h3 className="atoms-question-title">
                  <span className="atoms-question-number">0{index + 1} /</span>{" "}
                  {question.title}
                </h3>
                <p className="editorial-body">{question.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="episodes" className="atoms-section atoms-episodes ink-panel" aria-labelledby="episodes-title">
          <div className="atoms-episodes-art">
            <Image
              src="/illustrations/atoms-doorknob-lab-v2.webp"
              alt="The ATOMS robot mascots overengineering a simple doorknob test in their robotics lab."
              fill
              sizes="(min-width: 1500px) 700px, (min-width: 900px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="atoms-episodes-copy">
            <p className="editorial-eyebrow">{atoms.episodes.eyebrow}</p>
            <h2 id="episodes-title" className="editorial-heading">{atoms.episodes.title}</h2>
            <div className="atoms-prose">
              {atoms.episodes.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <a href={atoms.episodes.href} className="ink-button ink-button-solid atoms-button">
              <span>{atoms.episodes.cta}</span>
              <ArrowUpRightIcon size={18} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section id="your-turn" className="atoms-section atoms-guests ink-panel" aria-labelledby="guests-title">
          <div>
            <p className="editorial-eyebrow">{atoms.guests.eyebrow}</p>
            <h2 id="guests-title" className="editorial-heading">{atoms.guests.title}</h2>
          </div>
          <div className="atoms-guests-copy">
            <div className="atoms-prose">
              {atoms.guests.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              <p className="atoms-guest-bonus">{atoms.guests.bonus}</p>
            </div>
            <div className="atoms-guest-actions">
              <a href={atoms.guests.appear.href} className="ink-button ink-button-solid atoms-button">
                <span>{atoms.guests.appear.label}</span>
                <ArrowUpRightIcon size={18} aria-hidden="true" />
              </a>
              <a href={atoms.guests.suggest.href} className="ink-button atoms-button">
                <span>{atoms.guests.suggest.label}</span>
                <ArrowUpRightIcon size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-container atoms-footer">
        <p className="atoms-footer-original">
          <span className="atoms-footer-wordmark">{atoms.title}</span>{" "}
          <span>A <Link href="/">Budera</Link> Original podcast.</span>
        </p>
        <p className="atoms-footer-tagline"><em>{atoms.tagline}</em></p>
      </footer>
    </div>
  )
}
