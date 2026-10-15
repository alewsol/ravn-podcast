import { Resend, type Response as ResendResponse } from "resend"

// Each signup has one time budget, including retries, below the form's timeout.
class SubscriptionResend extends Resend {
  private readonly deadline = Date.now() + 18_000

  override async fetchRequest<T>(path: string, options: RequestInit = {}): Promise<ResendResponse<T>> {
    for (let attempt = 0; ; attempt++) {
      const remaining = this.deadline - Date.now()
      if (remaining <= 0) {
        return { data: null, error: { name: "application_error", statusCode: null, message: "Subscription request timed out" }, headers: null }
      }

      const result = await super.fetchRequest<T>(path, {
        ...options,
        signal: AbortSignal.timeout(Math.min(5_000, remaining)),
      })
      // Quota, authentication and validation errors need operator action, not retries.
      const retryable = result.error?.name === "rate_limit_exceeded"
        || result.error?.name === "concurrent_idempotent_requests"
        || (result.error?.name === "application_error" && result.error.statusCode === null)
        || (result.error?.statusCode != null && result.error.statusCode >= 500)
      if (!retryable || attempt >= 2) return result

      const retryAfter = Number(result.headers?.["retry-after"])
      const delay = Math.max(500 * 2 ** attempt, Number.isFinite(retryAfter) ? retryAfter * 1_000 : 0)
      if (delay >= this.deadline - Date.now()) return result
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim()

  if (!apiKey) {
    console.error("RESEND_API_KEY is not set")
    throw new Error("RESEND_API_KEY is not set")
  }

  return new SubscriptionResend(apiKey)
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
