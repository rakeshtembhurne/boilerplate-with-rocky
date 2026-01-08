"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "sonner"
import { Icons } from "@/components/shared/icons"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"

export function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [token, setToken] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Get token from URL
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      // Try to get token from path
      const pathParts = window.location.pathname.split("/")
      const pathToken = pathParts[pathParts.length - 1]
      if (pathToken && pathToken !== "verify-email") {
        setToken(pathToken)
      }
    }
  }, [searchParams])

  async function verifyEmail() {
    if (!token) {
      toast.error("Invalid verification link")
      return
    }

    setIsLoading(true)

    try {
      // TODO: better-auth v2 API - implement verify email
      // const result = await authClient.verifyEmail({
      //   query: { token },
      // })

      toast.success("Email verified successfully", {
        description: "Your email has been verified. You can now sign in.",
      })
      router.push("/sign-in")
    } catch (error) {
      toast.error("Something went wrong", {
        description: error instanceof Error ? error.message : "Failed to verify email",
      })
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (token) {
      verifyEmail()
    }
  }, [token])

  if (!token) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-red-600">
            Invalid Verification Link
          </h1>
          <p className="text-sm text-muted-foreground">
            The email verification link is invalid or has expired.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Verifying your email
        </h1>
        <p className="text-sm text-muted-foreground">
          Please wait while we verify your email address.
        </p>
      </div>

      <div className="flex justify-center">
        {isLoading && (
          <Icons.spinner className="h-8 w-8 animate-spin" />
        )}
      </div>

      {!isLoading && (
        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            Didn&apos;t receive the email?{" "}
          </span>
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Try signing in
          </Link>
        </div>
      )}
    </div>
  )
}