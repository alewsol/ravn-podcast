import { NextResponse } from "next/server"

import { getFromEmail, getNotifyEmail, getResendClient } from "@/lib/resend"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let email: unknown

  try {
    const body = await request.json()
    email = body?.email
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (typeof email !== "string" || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 })
  }

  const normalizedEmail = email.trim().toLowerCase()

  try {
    const resend = getResendClient()
    const from = getFromEmail()
    const notifyEmail = getNotifyEmail()

    await Promise.all([
      resend.emails.send({
        from,
        to: notifyEmail,
        subject: "New Budera subscriber",
        text: `New subscriber: ${normalizedEmail}`,
      }),
      resend.emails.send({
        from,
        to: normalizedEmail,
        subject: "You're subscribed to Budera",
        text: "You're on the list. New Founder Files, Worth Watching, and Hot Takes land in your inbox as soon as they're published.",
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to process subscription", error)
    return NextResponse.json(
      { error: "Something went wrong. Try again in a moment." },
      { status: 500 }
    )
  }
}
