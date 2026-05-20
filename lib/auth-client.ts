/**
 * Mock Auth Client for Demo
 * Works without database - stores session in localStorage AND cookies
 */
import { useState, useEffect } from "react";

// Simple in-memory session for demo
let mockSession: { id: string; name: string; email: string; image?: string } | null = null;

export const authClient = {
  // Get current session
  getSession: async () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("brandsome_session");
      if (stored) {
        mockSession = JSON.parse(stored);
      }
    }
    return mockSession ? { user: mockSession } : null;
  },

  // Sign in with email/password
  signIn: {
    email: async (
      credentials: { email: string; password: string; callbackURL?: string },
      callbacks?: {
        onRequest?: () => void;
        onError?: (ctx: { error: { message: string } }) => void;
        onSuccess?: () => void;
      }
    ) => {
      callbacks?.onRequest?.();
      
      try {
        const response = await fetch("/api/auth/sign-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          const data = await response.json();
          callbacks?.onError?.({ error: { message: data.error || "Invalid credentials" } });
          return;
        }

        const data = await response.json();
        mockSession = data.user;
        
        // Store in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("brandsome_session", JSON.stringify(data.user));
        }
        
        // Set cookie for server-side auth
        if (typeof document !== "undefined") {
          document.cookie = `brandsome_session=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=${60*60*24*7}`;
        }
        
        callbacks?.onSuccess?.();
      } catch (error) {
        callbacks?.onError?.({ error: { message: "Network error" } });
      }
    },
    social: async (options: { provider: string; callbackURL?: string }) => {
      mockSession = {
        id: "demo-user-" + Date.now(),
        name: "Demo User",
        email: "demo@example.com",
      };
      
      if (typeof window !== "undefined") {
        localStorage.setItem("brandsome_session", JSON.stringify(mockSession));
        document.cookie = `brandsome_session=${encodeURIComponent(JSON.stringify(mockSession))}; path=/; max-age=${60*60*24*7}`;
        window.location.href = options.callbackURL || "/dashboard";
      }
    },
  },

  // Sign up
  signUp: {
    email: async (
      credentials: { name: string; email: string; password: string },
      callbacks?: {
        onRequest?: () => void;
        onError?: (ctx: { error: { message: string } }) => void;
        onSuccess?: () => void;
      }
    ) => {
      callbacks?.onRequest?.();
      
      try {
        const response = await fetch("/api/auth/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          const data = await response.json();
          callbacks?.onError?.({ error: { message: data.error || "Sign up failed" } });
          return;
        }

        const data = await response.json();
        mockSession = data.user;
        
        // Store in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("brandsome_session", JSON.stringify(data.user));
        }
        
        // Set cookie for server-side auth
        if (typeof document !== "undefined") {
          document.cookie = `brandsome_session=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=${60*60*24*7}`;
        }
        
        callbacks?.onSuccess?.();
      } catch (error) {
        callbacks?.onError?.({ error: { message: "Network error" } });
      }
    },
  },

  // Sign out
  signOut: async (callbacks?: { onSuccess?: () => void }) => {
    mockSession = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("brandsome_session");
      // Clear cookie
      document.cookie = "brandsome_session=; path=/; max-age=0";
    }
    callbacks?.onSuccess?.();
  },
};

// React hook for session
export function useSession() {
  const [session, setSession] = useState<{ user: typeof mockSession } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then((s) => {
      setSession(s);
      setIsLoading(false);
    });
  }, []);

  return { data: session, isLoading };
}

// Named export for signOut (NavUser compatibility)
export function signOut({ callbackUrl }: { callbackUrl: string }) {
  authClient.signOut({
    onSuccess: () => {
      if (typeof window !== "undefined" && callbackUrl) {
        window.location.href = callbackUrl;
      }
    },
  });
}
