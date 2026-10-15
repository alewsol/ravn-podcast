import assert from "node:assert/strict"
import { afterEach, beforeEach, test } from "node:test"

import { POST } from "../app/api/subscribe/route"
import { getResendClient } from "../lib/resend"

type ApiCall = { url: URL; method: string; body: unknown; headers: Headers }
type ApiReply = { status?: number; body: unknown; headers?: Record<string, string> }

let calls: ApiCall[]
let replies: ApiReply[]
const originalFetch = globalThis.fetch
const originalEnv = { ...process.env }

beforeEach(() => {
  calls = []
  replies = []
  process.env.RESEND_API_KEY = "test-key-never-sent"
  process.env.RESEND_FROM_EMAIL = "Budera <hello@example.com>"
  process.env.RESEND_NOTIFY_EMAIL = "team@example.com"
  delete process.env.RESEND_SEGMENT_ID

  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input))
    assert.equal(url.origin, "https://api.resend.com", "Only the mocked Resend API can be called")
    calls.push({
      url,
      method: init?.method ?? "GET",
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
      headers: new Headers(init?.headers),
    })
    assert.ok(init?.signal, "Every provider request must have a timeout")
    const reply = replies.shift()
    assert.ok(reply, `Unexpected Resend call: ${url.pathname}`)
    return Response.json(reply.body, { status: reply.status ?? 200, headers: reply.headers })
  }
})

afterEach(() => {
  globalThis.fetch = originalFetch
  for (const key of ["RESEND_API_KEY", "RESEND_FROM_EMAIL", "RESEND_NOTIFY_EMAIL", "RESEND_SEGMENT_ID"]) {
    if (originalEnv[key] === undefined) delete process.env[key]
    else process.env[key] = originalEnv[key]
  }
})

function subscribe(body: unknown) {
  return POST(new Request("http://localhost/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }))
}

const missingContact: ApiReply = {
  status: 404,
  body: { name: "not_found", message: "Contact not found", statusCode: 404 },
}
const existingContact: ApiReply = {
  body: { id: "contact-1", email: "reader@example.com", unsubscribed: false },
}
const acceptedWelcome: ApiReply = { body: { id: "welcome-1" } }
const acceptedNotification: ApiReply = { body: { id: "notification-1" } }

test("rejects malformed JSON and invalid email values without calling Resend", async () => {
  const malformed = await POST(new Request("http://localhost/api/subscribe", { method: "POST", body: "{" }))
  assert.equal(malformed.status, 400)
  for (const body of [null, {}, { email: 42 }, { email: "" }, { email: "not-an-email" }, { email: `${"a".repeat(250)}@example.com` }]) {
    const response = await subscribe(body)
    assert.equal(response.status, 400)
    assert.equal((await response.json()).ok, undefined)
  }
  assert.equal(calls.length, 0)
})

test("normalizes the address, saves the subscriber to a segment, then sends both emails", async () => {
  process.env.RESEND_SEGMENT_ID = "newsletter-segment"
  replies.push(missingContact, { body: { id: "contact-1", object: "contact" } }, acceptedWelcome, acceptedNotification)

  const response = await subscribe({ email: "  Reader+News@Example.com  " })
  assert.equal(response.status, 200)
  assert.equal((await response.json()).ok, true)
  assert.equal(calls.length, 4)
  assert.equal(calls[0].url.pathname, "/contacts/reader%2Bnews%40example.com")
  assert.equal(calls[1].method, "POST")
  assert.equal(calls[1].url.pathname, "/contacts")
  assert.deepEqual(calls[1].body, {
    email: "reader+news@example.com",
    unsubscribed: false,
    segments: [{ id: "newsletter-segment" }],
  })
  assert.equal(calls[2].url.pathname, "/emails")
  const welcome = calls[2].body as { to: string; from: string; reply_to: string }
  const notification = calls[3].body as typeof welcome
  assert.equal(welcome.to, "reader+news@example.com")
  assert.equal(welcome.from, "Budera <hello@example.com>")
  assert.equal(welcome.reply_to, "team@example.com")
  assert.equal(notification.to, "team@example.com")
  assert.equal(notification.reply_to, "reader+news@example.com")
  assert.ok(calls[2].headers.get("idempotency-key"))
  assert.notEqual(calls[2].headers.get("idempotency-key"), calls[3].headers.get("idempotency-key"))
})

test("email rejection preserves a saved subscription and does not promise a welcome email", async () => {
  replies.push(existingContact, {
    status: 403,
    body: { name: "validation_error", message: "Sender domain is not verified", statusCode: 403 },
  }, acceptedNotification)
  const response = await subscribe({ email: "reader@example.com" })
  assert.equal(response.status, 200)
  const result = await response.json()
  assert.equal(result.ok, true)
  assert.equal(result.welcomeSent, false)
  assert.match(result.message, /couldn't send your welcome email/)
  assert.doesNotMatch(JSON.stringify(result), /domain|test-key|reader@/)
})

test("a contact storage or permission failure prevents sending welcome emails", async () => {
  replies.push(missingContact, {
    status: 401,
    body: { name: "restricted_api_key", message: "Key cannot manage contacts", statusCode: 401 },
  })
  const response = await subscribe({ email: "reader@example.com" })
  assert.equal(response.status, 503)
  assert.equal(calls.length, 2)
  assert.ok(calls.every((call) => call.url.pathname !== "/emails"))
})

test("a lookup failure is not treated as a missing contact", async () => {
  replies.push({ status: 401, body: { name: "restricted_api_key", message: "Key cannot manage contacts", statusCode: 401 } })
  assert.equal((await subscribe({ email: "reader@example.com" })).status, 503)
  assert.equal(calls.length, 1)
})

test("existing subscribers are not duplicated and retries reuse the email idempotency key", async () => {
  replies.push(existingContact, acceptedWelcome, acceptedNotification, existingContact, acceptedWelcome, acceptedNotification)
  assert.equal((await subscribe({ email: "reader@example.com" })).status, 200)
  assert.equal((await subscribe({ email: "READER@example.com" })).status, 200)
  assert.equal(calls.length, 6)
  assert.ok(calls.every((call) => call.url.pathname !== "/contacts"))
  assert.equal(calls[1].headers.get("idempotency-key"), calls[4].headers.get("idempotency-key"))
  assert.equal(calls[2].headers.get("idempotency-key"), calls[5].headers.get("idempotency-key"))
})

test("a returning subscriber can opt back in and join the newsletter segment", async () => {
  process.env.RESEND_SEGMENT_ID = "newsletter-segment"
  replies.push(
    { body: { id: "contact-1", email: "reader@example.com", unsubscribed: true } },
    { body: { id: "contact-1", object: "contact" } },
    { body: { id: "segment-membership" } },
    acceptedWelcome,
    acceptedNotification,
  )
  assert.equal((await subscribe({ email: "reader@example.com" })).status, 200)
  assert.equal(calls[1].method, "PATCH")
  assert.deepEqual(calls[1].body, { unsubscribed: false })
  assert.match(calls[2].url.pathname, /segments/)
})

test("a notification failure cannot prevent a reader's welcome email", async () => {
  replies.push(existingContact, acceptedWelcome, {
    status: 422,
    body: { name: "validation_error", message: "Invalid team email", statusCode: 422 },
  })
  const response = await subscribe({ email: "reader@example.com" })
  assert.equal(response.status, 200)
  assert.equal((await response.json()).welcomeSent, true)
})

test("missing credentials fail with a reference before contacting Resend", async () => {
  delete process.env.RESEND_API_KEY
  const response = await subscribe({ email: "reader@example.com" })
  assert.equal(response.status, 503)
  assert.match((await response.json()).reference, /^[a-f0-9-]{36}$/)
  assert.equal(calls.length, 0)
})

test("a missing sender does not prevent saving the subscriber", async () => {
  delete process.env.RESEND_FROM_EMAIL
  replies.push(missingContact, { body: { id: "contact-1", object: "contact" } })
  const response = await subscribe({ email: "reader@example.com" })
  assert.equal(response.status, 200)
  assert.equal((await response.json()).welcomeSent, false)
  assert.equal(calls.length, 2)
})

const rateLimited: ApiReply = {
  status: 429,
  body: { name: "rate_limit_exceeded", message: "Too many requests", statusCode: 429 },
  headers: { "retry-after": "0.01" },
}

test("temporary rate limits are retried without requiring another form submission", async () => {
  replies.push(rateLimited, existingContact, rateLimited, acceptedWelcome, acceptedNotification)
  const response = await subscribe({ email: "reader@example.com" })
  assert.equal(response.status, 200)
  assert.equal((await response.json()).welcomeSent, true)
  assert.equal(calls[0].url.pathname, calls[1].url.pathname)
  assert.equal(calls[2].headers.get("idempotency-key"), calls[3].headers.get("idempotency-key"))
})

test("persistent rate limits stop after three attempts and never send emails", async () => {
  replies.push(rateLimited, rateLimited, rateLimited)
  const response = await subscribe({ email: "reader@example.com" })
  assert.equal(response.status, 503)
  assert.equal(calls.length, 3)
})

test("email quota exhaustion is not retried and the subscriber stays saved", async () => {
  const quota: ApiReply = { status: 429, body: { name: "daily_quota_exceeded", message: "Daily quota exceeded", statusCode: 429 } }
  replies.push(existingContact, quota, quota)
  const response = await subscribe({ email: "reader@example.com" })
  assert.equal(response.status, 200)
  assert.equal((await response.json()).welcomeSent, false)
  assert.equal(calls.length, 3)
})

test("segment failures do not claim a successful newsletter signup", async () => {
  process.env.RESEND_SEGMENT_ID = "missing-segment"
  replies.push(existingContact, missingContact)
  const response = await subscribe({ email: "reader@example.com" })
  assert.equal(response.status, 503)
  assert.equal(calls.length, 2)
})

test("missing welcome acceptance never promises that an email is on its way", async () => {
  replies.push(existingContact, { body: {} }, acceptedNotification)
  const response = await subscribe({ email: "reader@example.com" })
  const result = await response.json()
  assert.equal(result.ok, true)
  assert.equal(result.welcomeSent, false)
  assert.match(result.message, /couldn't send/)
})

test("a provider Retry-After longer than the form budget fails promptly", async () => {
  replies.push({ ...rateLimited, headers: { "retry-after": "60" } })
  assert.equal((await subscribe({ email: "reader@example.com" })).status, 503)
  assert.equal(calls.length, 1)
})

test("the provider time budget is shared across operations in a signup", async (context) => {
  const now = Date.now()
  const resend = getResendClient()
  context.mock.method(Date, "now", () => now + 20_000)
  const result = await resend.contacts.get({ id: "contact-1" })
  assert.equal(result.error?.name, "application_error")
  assert.equal(calls.length, 0)
})

test("temporary provider failures recover during a signup", async () => {
  replies.push({ status: 500, body: { name: "internal_server_error", message: "Temporary failure", statusCode: 500 } }, existingContact, acceptedWelcome, acceptedNotification)
  const response = await subscribe({ email: "reader@example.com" })
  assert.equal(response.status, 200)
  assert.equal((await response.json()).welcomeSent, true)
  assert.equal(calls.length, 4)
})
