import Image from "next/image"

import { SubscribeForm } from "./subscribe-form"

export function NewsletterSection() {
  return (
    <section id="newsletter" className="site-container editorial-section" aria-labelledby="newsletter-title">
      <div className="newsletter-panel">
        <div className="newsletter-copy ink-panel">
          <h2 id="newsletter-title" className="editorial-heading">Want more stories like this? Subscribe.</h2>
          <SubscribeForm />
        </div>
        <div className="newsletter-art ink-panel">
          <Image
            src="/illustrations/robotics-lab.webp"
            alt="Budera's robot mascots building and testing prototypes inside a warehouse robotics lab."
            fill
            sizes="(min-width: 1500px) 690px, (min-width: 900px) 48vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
