/**
 * Auth Client for Brandsome
 * Uses better-auth's next-js integration
 */
import { createAuthClient } from "better-auth/react"

// Create auth client with proper configuration
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
})

// Re-export the session hook
export const useSession = authClient.useSession

// Re-export sign out helper
export function signOut(callbackUrl: string = "/") {
  authClient.signOut({
    callbackURL: callbackUrl,
  })
}
