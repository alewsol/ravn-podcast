import assert from "node:assert/strict"
import { afterEach, beforeEach, test } from "node:test"

import { POST } from "../app/api/subscribe/route"

type ApiCall = { url: URL; method: string; body: unknown; headers: Headers }
type ApiReply = { status?: number; body: unknown }

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
    const reply = replies.shift()
    assert.ok(reply, `Unexpected Resend call: ${url.pathname}`)
    return Response.json(reply.body, { status: reply.status ?? 200 })
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
const acceptedEmails: ApiReply = { body: { data: [{ id: "notification-1" }, { id: "welcome-1" }] } }

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
  replies.push(missingContact, { body: { id: "contact-1", object: "contact" } }, acceptedEmails)

  const response = await subscribe({ email: "  Reader+News@Example.com  " })
  assert.equal(response.status, 200)
  assert.equal((await response.json()).ok, true)
  assert.equal(calls.length, 3)
  assert.equal(calls[0].url.pathname, "/contacts/reader%2Bnews%40example.com")
  assert.equal(calls[1].method, "POST")
  assert.equal(calls[1].url.pathname, "/contacts")
  assert.deepEqual(calls[1].body, {
    email: "reader+news@example.com",
    unsubscribed: false,
    segments: [{ id: "newsletter-segment" }],
  })
  assert.equal(calls[2].url.pathname, "/emails/batch")
  const emails = calls[2].body as { to: string; from: string; reply_to: string }[]
  assert.equal(emails.length, 2)
  assert.equal(emails[0].to, "team@example.com")
  assert.equal(emails[0].reply_to, "reader+news@example.com")
  assert.equal(emails[1].to, "reader+news@example.com")
  assert.equal(emails[1].from, "Budera <hello@example.com>")
  assert.equal(emails[1].reply_to, "team@example.com")
  assert.ok(calls[2].headers.get("idempotency-key"))
})

test("provider email rejections return an error rather than a false success", async () => {
  replies.push(existingContact, {
    status: 403,
    body: { name: "validation_error", message: "Sender domain is not verified", statusCode: 403 },
  })
  const response = await subscribe({ email: "reader@example.com" })
  assert.equal(response.status, 503)
  const result = await response.json()
  assert.equal(result.ok, undefined)
  assert.match(result.error, /try again/i)
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
  assert.ok(calls.every((call) => call.url.pathname !== "/emails/batch"))
})

test("a lookup failure is not treated as a missing contact", async () => {
  replies.push({ status: 429, body: { name: "rate_limit_exceeded", message: "Too many requests", statusCode: 429 } })
  assert.equal((await subscribe({ email: "reader@example.com" })).status, 503)
  assert.equal(calls.length, 1)
})

test("existing subscribers are not duplicated and retries reuse the email idempotency key", async () => {
  replies.push(existingContact, acceptedEmails, existingContact, acceptedEmails)
  assert.equal((await subscribe({ email: "reader@example.com" })).status, 200)
  assert.equal((await subscribe({ email: "READER@example.com" })).status, 200)
  assert.equal(calls.length, 4)
  assert.ok(calls.every((call) => call.url.pathname !== "/contacts"))
  assert.equal(calls[1].headers.get("idempotency-key"), calls[3].headers.get("idempotency-key"))
})

test("a returning subscriber can opt back in and join the newsletter segment", async () => {
  process.env.RESEND_SEGMENT_ID = "newsletter-segment"
  replies.push(
    { body: { id: "contact-1", email: "reader@example.com", unsubscribed: true } },
    { body: { id: "contact-1", object: "contact" } },
    { body: { id: "segment-membership" } },
    acceptedEmails,
  )
  assert.equal((await subscribe({ email: "reader@example.com" })).status, 200)
  assert.equal(calls[1].method, "PATCH")
  assert.deepEqual(calls[1].body, { unsubscribed: false })
  assert.match(calls[2].url.pathname, /segments/)
})

test("incomplete batch acceptance does not report success", async () => {
  replies.push(existingContact, { body: { data: [{ id: "notification-1" }] } })
  assert.equal((await subscribe({ email: "reader@example.com" })).status, 503)
})

test("missing credentials or a missing verified sender fail before contacting Resend", async () => {
  delete process.env.RESEND_API_KEY
  assert.equal((await subscribe({ email: "reader@example.com" })).status, 503)
  process.env.RESEND_API_KEY = "test-key-never-sent"
  delete process.env.RESEND_FROM_EMAIL
  assert.equal((await subscribe({ email: "reader@example.com" })).status, 503)
  assert.equal(calls.length, 0)
})
