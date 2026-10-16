import { cookies } from "next/headers"

import { SUBSCRIBER_COOKIE, verifySubscriberSession } from "./subscriber-session"

export async function hasSubscriberAccess(): Promise<boolean> {
  return verifySubscriberSession((await cookies()).get(SUBSCRIBER_COOKIE)?.value)
}
