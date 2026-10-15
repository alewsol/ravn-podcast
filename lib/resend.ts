import { Resend } from "resend"

let client: Resend | null = null

export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim()

  if (!apiKey) {
    console.error("RESEND_API_KEY is not set")
    throw new Error("RESEND_API_KEY is not set")
  }

  if (!client) {
    client = new Resend(apiKey)
  }

  return client
}

export function getNotifyEmail(): string {
  return process.env.RESEND_NOTIFY_EMAIL?.trim() || "budera.founders@gmail.com"
}

export function getFromEmail(): string {
  const from = process.env.RESEND_FROM_EMAIL?.trim()

  if (!from) {
    console.error("RESEND_FROM_EMAIL must use a verified sending domain")
    throw new Error("RESEND_FROM_EMAIL is not set")
  }

  return from
}
