import { createHash, randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import type { ErrorResponse } from "resend"

import { getFromEmail, getNotifyEmail, getResendClient } from "@/lib/resend"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const maxDuration = 30

function requireData<T>(result: { data: T | null; error: ErrorResponse | null }, operation: string, reference: string): T {
  if (result.error || !result.data) {
    // Keep addresses and credentials out of logs and client responses.
    console.error(`Subscription ${operation} failed`, {
      code: result.error?.name,
      status: result.error?.statusCode,
      reference,
    })
    throw new Error(`Subscription ${operation} failed`)
  }

  return result.data
}

export async function POST(request: Request) {
  let email: unknown

  try {
    const body = await request.json()
    email = body?.email
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : ""

  if (normalizedEmail.length > 254 || !EMAIL_PATTERN.test(normalizedEmail)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 })
  }

  const reference = randomUUID()

  try {
    const resend = getResendClient()
    const segmentId = process.env.RESEND_SEGMENT_ID?.trim()
    const existing = await resend.contacts.get({ email: encodeURIComponent(normalizedEmail) })

    if (existing.error?.name === "not_found" || existing.error?.statusCode === 404) {
      requireData(await resend.contacts.create({
        email: normalizedEmail,
        unsubscribed: false,
        ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
      }), "save contact", reference)
    } else {
      const contact = requireData(existing, "look up contact", reference)

      if (contact.unsubscribed) {
        requireData(await resend.contacts.update({
          id: contact.id,
          unsubscribed: false,
        }), "resubscribe contact", reference)
      }

      if (segmentId) {
        requireData(await resend.contacts.segments.add({
          contactId: contact.id,
          segmentId,
        }), "add contact to newsletter", reference)
      }
    }

    // A retry after a lost response must not send the same emails twice.
    // Resend retains idempotency keys for 24 hours.
    const subscriberKey = createHash("sha256").update(normalizedEmail).digest("hex")
    let welcomeSent = false

    try {
      const from = getFromEmail()
      const notifyEmail = getNotifyEmail()
      const sent = requireData(await resend.emails.send({
        from,
        to: normalizedEmail,
        replyTo: notifyEmail,
        subject: "You're subscribed to Budera",
        text: "You're on the list. We'll send you new Founder Files, Worth Watching, Hot Takes, and ATOMS updates. Thanks for subscribing to Budera.",
      }, { idempotencyKey: `budera-subscribe/welcome/${subscriberKey}` }), "send welcome email", reference)
      if (!sent.id) throw new Error("Welcome email was not accepted")
      welcomeSent = true
    } catch {
      console.error("Subscriber saved; welcome email unavailable", { reference })
    }

    try {
      const sent = requireData(await resend.emails.send({
        from: getFromEmail(),
        to: getNotifyEmail(),
        replyTo: normalizedEmail,
        subject: "New Budera subscriber",
        text: `New subscriber: ${normalizedEmail}`,
      }, { idempotencyKey: `budera-subscribe/notification/${subscriberKey}` }), "send team notification", reference)
      if (!sent.id) throw new Error("Notification was not accepted")
    } catch {
      console.error("Subscriber saved; team notification unavailable", { reference })
    }

    return NextResponse.json({
      ok: true,
      welcomeSent,
      message: welcomeSent
        ? "You're in. Check your inbox for a welcome email."
        : "You're subscribed. We couldn't send your welcome email, but you're on the list for future updates.",
    })
  } catch {
    console.error("Failed to save subscription; check RESEND_API_KEY permissions and newsletter segment configuration", { reference })
    return NextResponse.json(
      { error: "We couldn't complete your subscription. Please try again in a moment.", reference },
      { status: 503 }
    )
  }
}
