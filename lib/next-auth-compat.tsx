/**
 * Compatibility layer for migrating from NextAuth to betterAuth
 * This file re-exports betterAuth client with NextAuth-compatible names
 */

import React from "react"
import { authClient } from "@/lib/auth-client"

// Re-export authClient for backward compatibility
export { authClient }

// Re-export useSession hook
export const useSession = authClient.useSession

// Re-export signIn function
export const signIn = {
  email: authClient.signIn.email,
  social: authClient.signIn.social,
}

// Export a function that mimics NextAuth's signIn(provider) signature
export function signInSocial(provider: string, options?: any) {
  return authClient.signIn.social({ provider, ...options })
}

// Backward compatible: allow signIn("google") syntax
export default function signInCompat(provider?: string, options?: any) {
  if (!provider) {
    throw new Error("Provider is required")
  }
  if (provider === "email") {
    return authClient.signIn.email
  }
  return authClient.signIn.social({ provider, ...options })
}

// Re-export signOut function
export const signOut = (options?: { callbackUrl?: string }) => {
  return authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        if (options?.callbackUrl) {
          window.location.href = options.callbackUrl
        }
      },
    },
  })
}
