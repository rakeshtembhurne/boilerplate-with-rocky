import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

// Disable Edge Runtime for betterAuth compatibility
export const runtime = "nodejs"

export const { GET, POST } = toNextJsHandler(auth)
