import { loadEnvConfig } from "@next/env"

import { getFromEmail, getResendClient } from "../lib/resend"

loadEnvConfig(process.cwd())

async function checkSubscriptions() {
  let failed = false
  const fail = (message: string) => {
    failed = true
    console.error(`FAIL: ${message}`)
  }

  if (!process.env.RESEND_API_KEY?.trim()) {
    fail("Set RESEND_API_KEY to a Resend key with Full access (Contacts and sending).")
  }
  if (!process.env.RESEND_FROM_EMAIL?.trim()) {
    fail("Set RESEND_FROM_EMAIL to a sender on your verified Resend domain.")
  }
  if (failed) {
    process.exitCode = 1
    return
  }

  const resend = getResendClient()
  const contacts = await resend.contacts.list({ limit: 1 })
  if (contacts.error) {
    fail(`Contacts access rejected (${contacts.error.name}, HTTP ${contacts.error.statusCode ?? "unavailable"}). Check the API key is valid and has Full access.`)
  } else {
    console.log("PASS: Resend accepts the API key and allows Contacts access.")
  }

  const segmentId = process.env.RESEND_SEGMENT_ID?.trim()
  if (segmentId) {
    const segment = await resend.segments.get(segmentId)
    if (segment.error) {
      fail(`Newsletter segment unavailable (${segment.error.name}). Check RESEND_SEGMENT_ID belongs to this Resend team.`)
    } else {
      console.log("PASS: Newsletter segment exists and is accessible.")
    }
  } else {
    console.log("INFO: No newsletter segment configured; signups go to the global Contacts list.")
  }

  const from = getFromEmail()
  const senderAddress = (from.match(/<([^<>]+)>$/)?.[1] ?? from).trim()
  const senderDomain = senderAddress.split("@")[1]?.toLowerCase()
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(senderAddress) || senderDomain === "resend.dev") {
    fail("RESEND_FROM_EMAIL must contain a valid address on your own verified domain. The resend.dev test sender cannot email general subscribers.")
  } else {
    let after: string | undefined
    let senderVerified = false
    do {
      const domains = await resend.domains.list({ limit: 100, ...(after ? { after } : {}) })
      if (domains.error) {
        fail(`Cannot verify sender domain (${domains.error.name}). Check API key permissions and domain status in Resend.`)
        break
      }
      senderVerified = domains.data.data.some((domain) => domain.name.toLowerCase() === senderDomain && domain.status === "verified")
      after = domains.data.has_more ? domains.data.data.at(-1)?.id : undefined
    } while (!senderVerified && after)

    if (senderVerified) console.log("PASS: Sender domain is verified in this Resend team.")
    else fail("Sender domain is not verified or was not found. Verify the domain used by RESEND_FROM_EMAIL in Resend.")
  }

  console.log("No contacts were changed and no emails were sent. Delivery and sending quotas require a separate live check.")
  if (failed) process.exitCode = 1
}

checkSubscriptions().catch(() => {
  console.error("FAIL: Configuration check could not finish. Check network connectivity and the Resend environment variables.")
  process.exitCode = 1
})
