import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"

export const SUBSCRIBER_COOKIE = "budera_subscriber"
export const SUBSCRIBER_MAX_AGE = 60 * 60 * 24 * 365

function signingKey() {
  // The existing server credential provides a stable fallback without new setup.
  const secret = process.env.SUBSCRIBER_SESSION_SECRET?.trim() || process.env.RESEND_API_KEY?.trim()
  return secret ? createHmac("sha256", secret).update("budera:subscriber-session:v1").digest() : null
}

export function createSubscriberSession(now = Date.now()): string {
  const key = signingKey()
  if (!key) throw new Error("Subscriber signing key is unavailable")
  const payload = `v1.${Math.floor(now / 1000) + SUBSCRIBER_MAX_AGE}.${randomBytes(16).toString("hex")}`
  return `${payload}.${createHmac("sha256", key).update(payload).digest("hex")}`
}

export function verifySubscriberSession(token: string | undefined, now = Date.now()): boolean {
  const key = signingKey()
  if (!key || !token) return false
  const match = /^(v1\.(\d{10,12})\.[a-f0-9]{32})\.([a-f0-9]{64})$/.exec(token)
  if (!match || Number(match[2]) <= Math.floor(now / 1000)) return false
  const expected = createHmac("sha256", key).update(match[1]).digest()
  return timingSafeEqual(expected, Buffer.from(match[3], "hex"))
}
