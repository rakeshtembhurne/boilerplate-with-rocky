/**
 * Auth Client
 * Uses better-auth's React integration
 */
import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Create auth client with proper configuration
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [emailOTPClient()],
});

// Re-export the session hook
export const useSession = authClient.useSession;

// Re-export sign out helper
export function signOut(options?: { callbackUrl?: string }) {
  return authClient.signOut({
    callbackURL: options?.callbackUrl ?? "/",
  });
}
