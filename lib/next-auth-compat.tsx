/**
 * @deprecated Use auth-client instead
 * Compatibility layer for next-auth imports
 */
import { authClient, useSession as _useSession, signOut as _signOut } from "./auth-client";

// Re-export useSession
export const useSession = _useSession;

// Re-export signOut
export function signOut(options?: { callbackUrl?: string }) {
  return _signOut(options?.callbackUrl || "/");
}

// Also export the client for direct access
export { authClient };
