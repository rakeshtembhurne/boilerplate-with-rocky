import "server-only"

import { cache } from "react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user) {
    return undefined
  }
  return session.user
})
