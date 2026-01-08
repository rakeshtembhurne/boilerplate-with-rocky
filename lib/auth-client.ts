import { createAuthClient } from "better-auth/react"

// Use the current origin for client-side requests to avoid port conflicts
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
})

// Export useSession hook - better-auth/react provides this directly
export const useSession = authClient.useSession

// Note: better-auth doesn't provide a SessionProvider component.
// Session management is handled through the useSession hook in client components.
// For layout-level session management, use the useSession hook directly in client components.
