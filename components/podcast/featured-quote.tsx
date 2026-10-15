import { hero } from "./data"

export function FeaturedQuote() {
  return (
    <section className="site-container editorial-section" aria-labelledby="manifesto-title">
      <div className="manifesto-panel ink-panel">
        <h2 id="manifesto-title" className="editorial-heading">{hero.about[0]}</h2>
        <div className="manifesto-body">
          {hero.about.slice(1).map((paragraph, index) => (
            <p key={paragraph} className={index === hero.about.length - 2 ? "manifesto-signoff" : undefined}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
