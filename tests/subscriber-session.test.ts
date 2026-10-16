import assert from "node:assert/strict"
import { afterEach, beforeEach, test } from "node:test"

import { createSubscriberSession, SUBSCRIBER_MAX_AGE, verifySubscriberSession } from "../lib/subscriber-session"

const originalKey = process.env.RESEND_API_KEY
const originalSecret = process.env.SUBSCRIBER_SESSION_SECRET
const now = Date.UTC(2026, 9, 16)

beforeEach(() => {
  process.env.RESEND_API_KEY = "test-signing-key"
  delete process.env.SUBSCRIBER_SESSION_SECRET
})

afterEach(() => {
  if (originalKey === undefined) delete process.env.RESEND_API_KEY
  else process.env.RESEND_API_KEY = originalKey
  if (originalSecret === undefined) delete process.env.SUBSCRIBER_SESSION_SECRET
  else process.env.SUBSCRIBER_SESSION_SECRET = originalSecret
})

test("subscriber sessions are signed, distinct, and expire after one year", () => {
  const token = createSubscriberSession(now)
  assert.equal(verifySubscriberSession(token, now), true)
  assert.notEqual(createSubscriberSession(now), token)
  assert.equal(verifySubscriberSession(token, now + SUBSCRIBER_MAX_AGE * 1000 - 1000), true)
  assert.equal(verifySubscriberSession(token, now + SUBSCRIBER_MAX_AGE * 1000), false)
})

test("forged, modified and malformed cookies never grant access", () => {
  const token = createSubscriberSession(now)
  const [version, expiry, nonce, signature] = token.split(".")
  for (const invalid of [undefined, "true", "1", "subscribed", `${version}.${expiry}.${nonce}`, `${version}.${Number(expiry) + 1}.${nonce}.${signature}`, `${token.slice(0, -1)}${token.endsWith('0') ? '1' : '0'}`, "v1.9999999999.bad.bad", "x".repeat(5000)]) {
    assert.equal(verifySubscriberSession(invalid, now), false)
  }
  process.env.RESEND_API_KEY = "another-server-key"
  assert.equal(verifySubscriberSession(token, now), false)
})

test("a dedicated signing secret survives Resend key rotation and missing keys fail closed", () => {
  process.env.SUBSCRIBER_SESSION_SECRET = "dedicated-test-secret"
  const token = createSubscriberSession(now)
  process.env.RESEND_API_KEY = "rotated-resend-key"
  assert.equal(verifySubscriberSession(token, now), true)
  delete process.env.RESEND_API_KEY
  delete process.env.SUBSCRIBER_SESSION_SECRET
  assert.equal(verifySubscriberSession(token, now), false)
  assert.throws(() => createSubscriberSession(now))
})
