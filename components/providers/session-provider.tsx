"use client"

import { authClient } from "@/lib/auth-client"

interface SessionProviderProps {
  children: React.ReactNode
}

// Note: better-auth doesn't require a SessionProvider component.
// Session management is handled through the useSession hook in client components.
// This component is kept for compatibility but doesn't wrap with a provider.
export function SessionProvider({ children }: SessionProviderProps) {
  return <>{children}</>
}