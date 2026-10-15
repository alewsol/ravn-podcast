import { Resend } from "resend"

let client: Resend | null = null

export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set")
  }

  if (!client) {
    client = new Resend(apiKey)
  }

  return client
}

export function getNotifyEmail(): string {
  return process.env.RESEND_NOTIFY_EMAIL ?? "budera.founders@gmail.com"
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? "Budera <onboarding@resend.dev>"
}
