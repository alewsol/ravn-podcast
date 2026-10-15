"use client"

import { useRef, useState, type FormEvent } from "react"
import Image from "next/image"
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight"

type Status = "idle" | "submitting" | "success" | "error"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState<string | null>(null)
  const submitting = useRef(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current) return

    submitting.current = true
    setStatus("submitting")
    setMessage(null)

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
        signal: AbortSignal.timeout(25_000),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok || data?.ok !== true) {
        setStatus("error")
        setMessage(data?.error ?? "Something went wrong. Try again.")
        return
      }

      setStatus("success")
      setMessage(data.message ?? "You're in. Check your inbox for a welcome email.")
      setEmail("")
    } catch {
      setStatus("error")
      setMessage("We couldn't confirm your subscription. Please try again.")
    } finally {
      submitting.current = false
    }
  }

  return (
    <section id="newsletter" className="site-container editorial-section" aria-labelledby="newsletter-title">
      <div className="newsletter-panel">
        <div className="newsletter-copy ink-panel">
          <h2 id="newsletter-title" className="editorial-heading">Subscribe to Budera.</h2>
          <form onSubmit={handleSubmit} className="newsletter-form" aria-busy={status === "submitting"}>
            <label htmlFor="newsletter-email">Email address</label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              disabled={status === "submitting"}
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (status !== "idle") {
                  setStatus("idle")
                  setMessage(null)
                }
              }}
              placeholder="Email address"
              aria-invalid={status === "error"}
              aria-describedby={message ? "newsletter-message" : undefined}
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="ink-button ink-button-solid"
            >
              {status === "submitting" ? "Subscribing…" : "Subscribe"}
              <ArrowUpRightIcon size={18} aria-hidden="true" />
            </button>
          </form>
          <p
            id="newsletter-message"
            role="status"
            aria-live="polite"
            className={`newsletter-message ${status === "error" ? "text-destructive" : ""}`}
          >
            {message}
          </p>
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
