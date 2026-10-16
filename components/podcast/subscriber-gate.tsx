import { LockSimpleIcon } from "@phosphor-icons/react/dist/ssr/LockSimple"

import { SubscribeForm } from "./subscribe-form"

export function SubscriberGate({ listing = false }: { listing?: boolean }) {
  return (
    <div className="subscriber-gate ink-panel">
      <p className="editorial-eyebrow inline-flex items-center gap-2">
        <LockSimpleIcon size={16} aria-hidden="true" />
        For subscribers
      </p>
      <h2 className="type-section mt-4 text-foreground">
        {listing ? "Four down. Six more worth your time." : "There’s more to this story."}
      </h2>
      <p className="editorial-body mt-4">
        Subscribe to Budera for free to read stories 5–10 in every section.
      </p>
      <div className="mt-6"><SubscribeForm unlock /></div>
      <p className="type-meta mt-2 text-muted-foreground">
        Already subscribed? Enter your email to unlock this browser.
      </p>
    </div>
  )
}
