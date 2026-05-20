import "server-only"
import { cache } from "react"
import { auth } from "@/lib/auth"

export const getCurrentUser = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await getHeaders()
    })
    if (!session?.user) {
      return undefined
    }
    return session.user
  } catch {
    return undefined
  }
})

export const getSession = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await getHeaders()
    })
    return session
  } catch {
    return null
  }
})

async function getHeaders() {
  const { headers } = await import("next/headers")
  return await headers()
}
