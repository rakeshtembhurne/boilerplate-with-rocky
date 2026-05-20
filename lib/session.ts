import "server-only"
import { cache } from "react"
import { cookies } from "next/headers"

export const getCurrentUser = cache(async () => {
  // Read session from cookie (set by client-side login)
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("brandsome_session")
  
  if (!sessionCookie?.value) {
    return undefined
  }
  
  try {
    const user = JSON.parse(decodeURIComponent(sessionCookie.value))
    return user
  } catch {
    return undefined
  }
})
