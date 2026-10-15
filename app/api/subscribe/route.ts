import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import type { ErrorResponse } from "resend"

import { getFromEmail, getNotifyEmail, getResendClient } from "@/lib/resend"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function requireData<T>(result: { data: T | null; error: ErrorResponse | null }, operation: string): T {
  if (result.error || !result.data) {
    // Keep addresses and credentials out of logs and client responses.
    console.error(`Subscription ${operation} failed`, {
      code: result.error?.name,
      status: result.error?.statusCode,
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

  try {
    const resend = getResendClient()
    const from = getFromEmail()
    const notifyEmail = getNotifyEmail()
    const segmentId = process.env.RESEND_SEGMENT_ID?.trim()
    const existing = await resend.contacts.get({ email: encodeURIComponent(normalizedEmail) })

    if (existing.error?.name === "not_found" || existing.error?.statusCode === 404) {
      requireData(await resend.contacts.create({
        email: normalizedEmail,
        unsubscribed: false,
        ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
      }), "save contact")
    } else {
      const contact = requireData(existing, "look up contact")

      if (contact.unsubscribed) {
        requireData(await resend.contacts.update({
          id: contact.id,
          unsubscribed: false,
        }), "resubscribe contact")
      }

      if (segmentId) {
        requireData(await resend.contacts.segments.add({
          contactId: contact.id,
          segmentId,
        }), "add contact to newsletter")
      }
    }

    // A retry after a lost response must not send the same emails twice.
    // Resend retains idempotency keys for 24 hours.
    const subscriberKey = createHash("sha256").update(normalizedEmail).digest("hex")
    const sent = requireData(await resend.batch.send([
      {
        from,
        to: notifyEmail,
        replyTo: normalizedEmail,
        subject: "New Budera subscriber",
        text: `New subscriber: ${normalizedEmail}`,
      },
      {
        from,
        to: normalizedEmail,
        replyTo: notifyEmail,
        subject: "You're subscribed to Budera",
        text: "You're on the list. We'll send you new Founder Files, Worth Watching, Hot Takes, and ATOMS updates. Thanks for subscribing to Budera.",
      },
    ], { idempotencyKey: `budera-subscribe/${subscriberKey}` }), "send emails")

    if (sent.data.length !== 2 || sent.data.some((email) => !email.id)) {
      throw new Error("Subscription emails were not accepted")
    }

    return NextResponse.json({ ok: true, message: "You're in. Check your inbox for a welcome email." })
  } catch {
    console.error("Failed to complete subscription")
    return NextResponse.json(
      { error: "We couldn't complete your subscription. Please try again in a moment." },
      { status: 503 }
    )
  }
}
