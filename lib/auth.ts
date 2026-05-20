// Mock auth for demo
// IMPORTANT: This should return null for no session (used by proxy.ts middleware)

export const auth = {
  api: {
    getSession: async () => {
      // Return null by default (no session)
      // Session is managed client-side via localStorage
      return null;
    },
  },
} as any;
